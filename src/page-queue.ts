/*
 * @Autor: theajack
 * @Date: 2021-05-19 22:40:45
 * @LastEditors: tackchen
 * @LastEditTime: 2021-05-26 16:28:25
 * @Description: Coding something
 */

import storage from './storage';
import {IJson, IOnPageChange, IPage} from './type';
import {random} from './util';
import {isPageHide} from './method';

export const PAGE_QUEUE_KEY = 'cwm_page_queue';

// 用于触发自身的pageQueueChange 因为 onstorage 对于当前页面不触发
let onSelfPageQueueChange: IOnPageChange;
export function injectSelfPageQueueChange (onPageChange: IOnPageChange) {
    onSelfPageQueueChange = onPageChange;
}

export function readPageQueue (): IPage[] {
    const result = storage.read(PAGE_QUEUE_KEY);
    return (result instanceof Array) ? result : [];
}

export function findPageById (pageId: string) {
    const pageQueue = readPageQueue();
    const page = pageQueue.find(page => page.id === pageId);
    return {pageQueue, page};
}

export function writePageQueue (pageQueue: IPage[]) {
    if (onSelfPageQueueChange) {
        onSelfPageQueueChange(pageQueue, readPageQueue());
    }
    storage.write(PAGE_QUEUE_KEY, pageQueue);
}

export function findMaxPageIndex (pageQueue: IPage[]) {
    let max = 0;
    pageQueue.forEach(page => {
        if (page.index > max) max = page.index;
    });
    return max;
}

export function onPageEnter (pageName: string, pageId: string, data?: IJson): IPage {
    const pageQueue = readPageQueue();
    const page: IPage = {
        name: pageName,
        id: pageId || `${pageName}${Date.now().toString().substr(4)}${random(100000, 999999)}`,
        index: findMaxPageIndex(pageQueue) + 1,
        show: !isPageHide(),
    };
    if (typeof data !== 'undefined') {page.data = data;}
    pageQueue.push(page);
    writePageQueue(pageQueue);
    return page;
}

export function updataPageData (data: IJson, pageId: string, cover: boolean) {
    const {pageQueue, page} = findPageById(pageId);
    if (!page) {
        console.error('不存在的页面 pageId');
        return false;
    }
    if (cover || !page.data) {
        page.data = data;
    } else {
        for (const k in data) {
            page.data[k] = data[k];
        }
    }
    writePageQueue(pageQueue);
    return true;
}

export function onPageUnload (page: IPage) {
    removePageById(page.id);
}

export function removePageByName (pageName: string, write = true) {
    const pageQueue = readPageQueue();
    let hasItem = false;
    for (let i = pageQueue.length - 1; i >= 0; i--) {
        if (pageQueue[i].name === pageName) {
            pageQueue.splice(i, 1);
            hasItem = true;
        }
    }
    if (write && hasItem) {
        writePageQueue(pageQueue);
    }
    return hasItem;
}

export function removePageById (pageId: string, write = true) {
    const {pageQueue, page} = findPageById(pageId);
    if (page) {
        pageQueue.splice(pageQueue.indexOf(page), 1);
        if (write) writePageQueue(pageQueue);
        return true;
    }
    return false;
}

// 获取最新有活动的页面
export function getLatestActivePage () {
    const pageQueue = readPageQueue();
    if (pageQueue.length === 0) return null;
    return pageQueue[pageQueue.length - 1];
}

// 获取最后一个打开的页面
export function getLastOpenPage () {
    const pageQueue = readPageQueue();
    if (pageQueue.length === 0) return null;
    pageQueue.sort((a, b) => b.index - a.index);
    return pageQueue[0];
}

export function getBigestPageIndex () {
    const lastOpenPage = getLastOpenPage();
    return (!lastOpenPage) ? 0 : lastOpenPage.index;
}

export function checkPageQueueAlive (alivePageIds: string[]) {
    const pageQueue = readPageQueue();
    let hasItem = false;
    for (let i = pageQueue.length - 1; i >= 0; i--) {
        if (alivePageIds.indexOf(pageQueue[i].id) === -1) {
            pageQueue.splice(i, 1);
            hasItem = true;
        }
    }
    if (hasItem) {writePageQueue(pageQueue);}
}

export function putPageOnTop (pageId: string, fromPageShow: boolean = false) {
    const {pageQueue, page} = findPageById(pageId);
    if (page) {
        if (fromPageShow) {
            page.show = true;
        }
        pageQueue.splice(pageQueue.indexOf(page), 1);
        pageQueue.push(page);
        writePageQueue(pageQueue);
    }
}

export function hidePage (pageId: string) {
    const {pageQueue, page} = findPageById(pageId);
    if (page) {
        page.show = false;
        writePageQueue(pageQueue);
    }
}