/*
 * @Author: tackchen
 * @Date: 2021-05-19 13:26:53
 * @LastEditors: tackchen
 * @LastEditTime: 2021-05-26 16:10:56
 * @FilePath: \cross-window-message\src\index.ts
 * @Description: Main
 */
import {creatEventReady, IEventReadyEmit} from './event';
import storage from './storage';
import {closePage, getDefaultPageName, INNER_MSG_TYPE, onUnload, onPageShowHide} from './method';
import {getLastOpenPage, getLatestActivePage, hidePage, injectSelfPageQueueChange, onPageEnter, onPageUnload, PAGE_QUEUE_KEY, putPageOnTop, readPageQueue, updatePageData} from './page-queue';
import {IMsgData, IInnerMsgData, IPage, IMessager, IPostMessage, IPageEvents, IOptions, IOnPageChange, IJson} from './type';
import version from './version';
import {initEnsurePostMessage, onOtherReply, initEnsureAlive} from './ensure-alive';

const MSG_KEY = 'cross_window_msg';

let instance: IMessager; // 单例模式

let postMessage: IPostMessage;

function handleInnerMessage (msgData: IInnerMsgData, currentPage: IPage) {
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
            onOtherReply(sourcePage.id);
            break;
        default: break;
    }
}

function initBasePostMessage (page: IPage, onHandleData: (msgData: IInnerMsgData)=>void) {
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
        const msgData: IInnerMsgData = {
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
    initEnsurePostMessage(postMessage);
}

function initStorageEvent (onHandleData: (msgData: IMsgData)=>void, onPageChange: IOnPageChange) {
    window.addEventListener('storage', (e) => {
        if (!e.key) return;
        const key = storage.parseKey(e.key);
        if (key === MSG_KEY) {
            const data = (e.newValue !== null) ? storage.parseValue(e.newValue) as IMsgData : null;
            if (!data) return;
            onHandleData(data);
        } else if (key === PAGE_QUEUE_KEY) {
            onPageChange(
                (e.newValue !== null) ? storage.parseValue(e.newValue) as IPage[] : [],
                (e.oldValue !== null) ? storage.parseValue(e.oldValue) as IPage[] : [],
            );
        }
    }, false);
}

function createPageMethod (pageId: string) {
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
        getAllPages () {
            return readPageQueue();
        },
        updatePageData (data: IJson, cover: boolean = false) {
            return updatePageData(data, pageId, cover);
        }
    };
}

function createDataHandler (currentPage: IPage, eventReady: IEventReadyEmit<IInnerMsgData>) {
    return (data: IInnerMsgData) => {
        const isTargetIdMode = typeof data.targetPageId === 'string';
        const isTagertNameMode =  typeof data.targetPageName === 'string';
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

export default function initMessager ({
    pageName = getDefaultPageName(),
    pageId = '',
    useSessionStorage,
    data,
}: IOptions = {}): IMessager {
    
    if (instance) return instance;

    if (useSessionStorage === true) storage.useSessionStorage();

    const pageEvents = createPageEvents();

    const page = onPageEnter(pageName, pageId, data);

    onUnload((event) => {
        onPageUnload(page);
        pageEvents.triggerUnload(event);
    });

    const {onEventReady, eventReady, removeListener} = creatEventReady<IMsgData>();
    
    const onPageQueueChangeEvent = creatEventReady<IPage[]>();

    injectSelfPageQueueChange(onPageQueueChangeEvent.eventReady);

    const onHandleData = createDataHandler(page, eventReady);

    initStorageEvent(onHandleData, onPageQueueChangeEvent.eventReady);

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
            onEventReady({listener: fn, after: true});
            return () => removeListener(fn);
        },
        onPageChange (fn: IOnPageChange) {
            onPageQueueChangeEvent.onEventReady({listener: fn, after: true});
            return () => onPageQueueChangeEvent.removeListener(fn);
        },
        ...pageEvents.events,
        method: createPageMethod(page.id)
    };
    instance = messager;
    initEnsureAlive(page);
    initPageActiveEvent(page.id, pageEvents);
    return messager;
}

initMessager.version = version;

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
        BeforeUnload
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
            onBeforeUnload (func: (event: BeforeUnloadEvent)=>void) {
                return registEvent(func, EventType.BeforeUnload);
            },
            onUnload (func: (event: Event)=>void) {
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