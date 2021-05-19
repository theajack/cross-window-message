/*
 * @Author: tackchen
 * @Date: 2021-05-19 13:26:53
 * @LastEditors: theajack
 * @LastEditTime: 2021-05-20 00:18:20
 * @FilePath: \cross-window-message\src\index.ts
 * @Description: Coding something
 */
import {random} from './util';
import {creatEventReady, IEventReadyEmit} from './event';
import storage from './storage';
import {closePage, getDefaultPageName, INNER_MSG_TYPE, onUnload} from './method';
import {onPageEnter, onPageUnload} from './page-queue';
import {IMsgData, IPage} from './type';

const MSG_KEY = 'cross_window_msg';

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
        default: break;
    }
}

interface IPostMessage {
    ({data, messageType, innerMessageType}: {
        data?: any;
        messageType?: string | number;
        innerMessageType?: number;
    }): void;
}

function createPostMessageBase (page: IPage, eventReady: IEventReadyEmit<IMsgData>): IPostMessage {
    let msgId = 0;
    return ({
        data = null,
        messageType = '',
        innerMessageType
    }: {
        data?: any;
        messageType?: string|number;
        innerMessageType?: number
    }) => {
        const msgData: IMsgData = {
            data,
            page,
            messageType,
            messageId: `${page.id}-${msgId++}`, // ! 记录一个msgId 不然相同的msg不会被触发
        };
        if (typeof innerMessageType === 'number') {
            msgData.innerMessageType = innerMessageType;
        }
        storage.write(MSG_KEY, msgData);
        eventReady(msgData); // 通知当前窗口
    };
}

function initStorageEvent (page: IPage, onHandleData: (msgData: IMsgData)=>void) {
    window.addEventListener('storage', (e) => {
        if (e.key && storage.parseKey(e.key) !== MSG_KEY) return null;
        const data = (e.newValue !== null) ? storage.parseValue(e.newValue) as IMsgData : null;
        if (!data) return;
        onHandleData(data);
    }, false);
}


function createPageMethod (postMessage: IPostMessage) {
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
        }
    };
}

function createDataHandler (page: IPage, eventReady: IEventReadyEmit<IMsgData>) {
    return (data: IMsgData) => {
        if (data.innerMessageType) { // 内部事件 被拦截
            handleInnerMessage(data, page);
        } else {
            eventReady(data);
        }
    };
}

export function initMessager (
    pageName = getDefaultPageName(),
    pageId: string = ''
) {
    const page = {
        name: pageName,
        id: pageId || `${pageName}${Date.now().toString().substr(4)}${random(100000, 999999)}`
    };

    onPageEnter(page);

    onUnload(() => {onPageUnload(page);});

    const {onEventReady, eventReady, removeListener} = creatEventReady<IMsgData>();

    const onHandleData = createDataHandler(page, eventReady);

    initStorageEvent(page, onHandleData);

    const postMessage = createPostMessageBase(page, onHandleData);

    const messager = {
        pageId: page.id,
        pageName,
        postMessage (data: any, messageType: number | string = '') {
            postMessage({data, messageType});
        },
        onMessage (fn: (msgData: IMsgData) => void) {
            onEventReady(fn);
        },
        removeListener (fn: (msgData: IMsgData) => void) {
            removeListener(fn);
        },
        method: createPageMethod(postMessage)
    };
    return messager;
}