/*
 * @Author: tackchen
 * @Date: 2021-05-26 15:29:30
 * @LastEditors: theajack
 * @LastEditTime: 2021-05-29 10:37:37
 * @FilePath: \cross-window-message\src\ensure-alive.ts
 * @Description: 页面存活和关闭检查机制
 */

import {INNER_MSG_TYPE} from './method';
import {checkPageQueueAlive, findMaxPageIndex, findPageById, writePageQueue} from './page-queue';
import {IPage, IPostMessage} from './type';

const alivePageIds: string[] = [];

let postMessage: IPostMessage;
export function initEnsurePostMessage (func: IPostMessage) {
    postMessage = func;
}


export function onOtherReply (pageId: string) {
    if (alivePageIds.indexOf(pageId) === -1)
        alivePageIds.push(pageId);
}

export function initEnsureAlive (page: IPage) {
    ensureOtherAlive();
    ensureSelfAlive(page);

    // 确认其他页面是否是存活的
    // 可能存在同时关闭写入storage异常导致有假的存活页面
}

function ensureOtherAlive () {
    // 确认其他页面是否是存活的
    // 可能存在同时关闭写入storage异常导致有假的存活页面
    postMessage({innerMessageType: INNER_MSG_TYPE.ENSURE_ALIVE});
    setTimeout(() => {
        checkPageQueueAlive(alivePageIds);
    }, 200);
}

const needContinueEnsure = (() => {
    const MAX = 5;
    let index = 0;
    return () => {
        index ++;
        return (index <= MAX);
    };
})();

function ensureSelfAlive (curPage: IPage) {
    // 确认自身是写入queue成功
    // 可能存在同时打开写入storage异常导致有假的存活页面
    setTimeout(() => {
        const {pageQueue, page} = findPageById(curPage.id);
        if (!page) {
            curPage.index = findMaxPageIndex(pageQueue) + 1;
            pageQueue.push(curPage);
            writePageQueue(pageQueue);
            if (needContinueEnsure())
                ensureSelfAlive(curPage);
        }
    }, 100);
}