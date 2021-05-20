/*
 * @Author: tackchen
 * @Date: 2021-05-19 13:26:53
 * @LastEditors: theajack
 * @LastEditTime: 2021-05-21 00:19:10
 * @FilePath: \cross-window-message\src\index.ts
 * @Description: Coding something
 */
import {creatEventReady, IEventReadyEmit} from './event';
import storage from './storage';
import {closePage, getDefaultPageName, INNER_MSG_TYPE, onUnload} from './method';
import {checkPageQueueAlive, getLastOpenPage, getLatestActivePage, hidePage, onPageEnter, onPageUnload, putPageOnTop} from './page-queue';
import {IMsgData, IPage, IMessager, IPostMessage, IPageEvents} from './type';
import {onPageShowHide} from './util';

const MSG_KEY = 'cross_window_msg';

let instance: IMessager; // 单例模式

let postMessage: IPostMessage;

function handleInnerMessage (msgData: IMsgData, currentPage: IPage) {
    const type = msgData.innerMessageType;

    const sourcePage = msgData.page;
    const data = msgData.data;
    const isCurrentPage = (pageId: string) => currentPage.id === pageId;
    const isSameNameWithCurrentPage = (pageName: string) => currentPage.name === pageName;

    switch (type) {
        case INNER_MSG_TYPE.CLOSE_OTHER_PAGE:
            if (!isCurrentPage(sourcePage.id))
                closePage();
            break;
        case INNER_MSG_TYPE.CLOSE_OTHER_SAME_PAGE:
            if (!isCurrentPage(sourcePage.id) && isSameNameWithCurrentPage(sourcePage.name)) {
                closePage();
            };break;
        case INNER_MSG_TYPE.ALERT_IN_TARGET_ID:
            if (isCurrentPage(data.pageId)) {
                alert(data.text);
            };break;
        case INNER_MSG_TYPE.ALERT_IN_TARGET_NAME:
            if (isSameNameWithCurrentPage(data.pageName)) {
                alert(data.text);
            };break;
        case INNER_MSG_TYPE.CLOSE_PAGE_BY_ID:
            if (isCurrentPage(data)) {
                closePage();
            };break;
        case INNER_MSG_TYPE.CLOSE_PAGE_BY_NAME:
            if (isSameNameWithCurrentPage(data)) {
                closePage();
            };break;
        case INNER_MSG_TYPE.ENSURE_ALIVE:
            if (!isCurrentPage(data)) {
                postMessage({targetPageId: sourcePage.id, innerMessageType: INNER_MSG_TYPE.REPLAY_ALIVE});
            };break;
        case INNER_MSG_TYPE.REPLAY_ALIVE:
            EnsureOtherPageAlive.onReply(sourcePage.id);
            break;
        default: break;
    }
}

function initBasePostMessage (page: IPage, onHandleData: (msgData: IMsgData)=>void) {
    let msgId = 0;
    postMessage = ({
        data = null,
        messageType = '',
        innerMessageType,
        targetPageId,
        targetPageName
    }: {
        data?: any;
        messageType?: string|number;
        innerMessageType?: number;
        targetPageId?: string;
        targetPageName?: string;
    }) => {
        const msgData: IMsgData = {
            data,
            page,
            messageType,
            messageId: `${page.id}-${msgId++}`, // ! 记录一个msgId 不然相同的msg不会被触发
        };
        if (typeof innerMessageType === 'number') msgData.innerMessageType = innerMessageType;
        if (typeof targetPageId === 'string') msgData.targetPageId = targetPageId;
        if (typeof targetPageName === 'string') msgData.targetPageName = targetPageName;

        storage.write(MSG_KEY, msgData);
        onHandleData(msgData); // 通知当前窗口
    };
}

function initStorageEvent (onHandleData: (msgData: IMsgData)=>void) {
    window.addEventListener('storage', (e) => {
        if (e.key && storage.parseKey(e.key) !== MSG_KEY) return null;
        const data = (e.newValue !== null) ? storage.parseValue(e.newValue) as IMsgData : null;
        if (!data) return;
        onHandleData(data);
    }, false);
}

function createPageMethod () {
    return {
        closeOtherPage () {
            postMessage({innerMessageType: INNER_MSG_TYPE.CLOSE_OTHER_PAGE});
        },
        closeOtherSamePage () {
            postMessage({innerMessageType: INNER_MSG_TYPE.CLOSE_OTHER_SAME_PAGE});
        },
        alertInTargetName (text: string | number, pageName: string) {
            postMessage({data: {text, pageName}, innerMessageType: INNER_MSG_TYPE.ALERT_IN_TARGET_NAME});
        },
        alertInTargetId (text: string | number, pageId: string) {
            postMessage({data: {text, pageId}, innerMessageType: INNER_MSG_TYPE.ALERT_IN_TARGET_ID});
        },
        closePageByPageName (pageName: string) {
            postMessage({data: pageName, innerMessageType: INNER_MSG_TYPE.CLOSE_PAGE_BY_NAME});
        },
        closePageByPageId (pageId: string) {
            postMessage({data: pageId, innerMessageType: INNER_MSG_TYPE.CLOSE_PAGE_BY_ID});
        },
        getLastOpenPage,
        getLatestActivePage,
    };
}

function createDataHandler (currentPage: IPage, eventReady: IEventReadyEmit<IMsgData>) {
    return (data: IMsgData) => {
        const isTargetIdMode = data.targetPageId === 'string';
        const isTagertNameMode =  data.targetPageName === 'string';
        if (
            (!isTargetIdMode && !isTagertNameMode) ||
                (isTargetIdMode && data.targetPageId === currentPage.id) ||
                (isTagertNameMode && data.targetPageName === currentPage.name)
        ) {
            if (data.innerMessageType) { // 内部事件 被拦截
                handleInnerMessage(data, currentPage);
            } else {
                eventReady(data);
            }
        }
    };
}

export function initMessager (
    pageName = getDefaultPageName(),
    pageId: string = ''
): IMessager {

    if (instance) return instance;

    const pageEvents = createPageEvents();

    const page = onPageEnter(pageName, pageId);

    onUnload((event) => {
        onPageUnload(page);
        pageEvents.triggerUnload(event);
    });

    const {onEventReady, eventReady, removeListener} = creatEventReady<IMsgData>();

    const onHandleData = createDataHandler(page, eventReady);

    initStorageEvent(onHandleData);

    initBasePostMessage(page, onHandleData);

    const messager = {
        pageId: page.id,
        pageName,
        postMessage (data: any, messageType: number | string = '') {
            postMessage({data, messageType});
        },
        postMessageToTargetId (targetPageId: string, data: any, messageType?: number | string) {
            postMessage({targetPageId, data, messageType});
        },
        postMessageToTargetName (targetPageName: string, data: any, messageType?: number | string) {
            postMessage({targetPageName, data, messageType});
        },
        onMessage (fn: (msgData: IMsgData) => void) {
            onEventReady(fn);
            return () => removeListener(fn);
        },
        ...pageEvents.events,
        method: createPageMethod()
    };
    instance = messager;
    EnsureOtherPageAlive.send();
    initPageActiveEvent(page.id, pageEvents);
    return messager;
}

// 确认其他页面是否是存活的
// 可能存在同时关闭写入storage异常导致有假的存活页面
const EnsureOtherPageAlive = (() => {
    const alivePageIds: string[] = [];
    return {
        onReply (pageId: string) {
            if (alivePageIds.indexOf(pageId) === -1)
                alivePageIds.push(pageId);
        },
        send () {
            postMessage({innerMessageType: INNER_MSG_TYPE.ENSURE_ALIVE});
            setTimeout(() => {
                checkPageQueueAlive(alivePageIds);
            }, 300);
        }
    };
})();

function initPageActiveEvent (pageId: string, pageEvents: IPageEvents) {
    onPageShowHide((event) => {
        putPageOnTop(pageId, true);
        pageEvents.triggerPageShow(event);
    }, (event) => {
        hidePage(pageId);
        pageEvents.triggerPageHide(event);
    });
    window.addEventListener('click', (event) => {
        putPageOnTop(pageId);
        pageEvents.triggerClick(event);
    }, true);
}

function createPageEvents (): IPageEvents {
    enum EventType {
        Unload,
        Click,
        Show,
        Hide,
    }
    interface IPageEventData {
        type: EventType;
        event: Event;
    }
    
    const {onEventReady, eventReady, removeListener} = creatEventReady<IPageEventData>();
    
    const registEvent = (func: (event: Event)=>void, currentType: EventType) => {
        const listener = ({type, event}: IPageEventData) => {
            if (currentType === type)
                func(event);
        };
        onEventReady({
            after: true,
            listener
        });
        return () => removeListener(listener);
    };

    const emitEvent = (event: Event, currentType: EventType) => {
        return eventReady({
            type: currentType,
            event
        });
    };

    return {
        events: {
            onUnload (func: (event: BeforeUnloadEvent)=>void) {
                return registEvent(func, EventType.Unload);
            },
            onClick (func: (event: MouseEvent)=>void) {
                return registEvent(func, EventType.Click);
            },
            onShow (func: (event: Event)=>void) {
                return registEvent(func, EventType.Show);
            },
            onHide (func: (event: Event)=>void) {
                return registEvent(func, EventType.Hide);
            }
        },
        triggerUnload (event: BeforeUnloadEvent) {
            return emitEvent(event, EventType.Unload);
        },
        triggerClick (event: MouseEvent) {
            return emitEvent(event, EventType.Click);
        },
        triggerPageShow (event: Event) {
            return emitEvent(event, EventType.Show);
        },
        triggerPageHide (event: Event) {
            return emitEvent(event, EventType.Hide);
        }
    };
}