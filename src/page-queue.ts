/*
 * @Autor: theajack
 * @Date: 2021-05-19 22:40:45
 * @LastEditors: theajack
 * @LastEditTime: 2021-05-19 23:03:34
 * @Description: Coding something
 */

import storage from './storage';
import {IPage} from './type';

const PAGE_QUEUE_KEY = 'cwm_page_queue';

let pageQueue: IPage[] = readQueue();

function readQueue (): IPage[] {
    const result = storage.read(PAGE_QUEUE_KEY);
    return (result instanceof Array) ? result : [];
}

function writeQueue () {
    storage.write(PAGE_QUEUE_KEY, pageQueue);
}

export function onPageEnter (page: IPage) {
    pageQueue.push(page);
    writeQueue();
}

export function onPageUnload (page: IPage) {
    removePageById(page.id);
}

export function removePageByName (pageName: string, write = true) {
    let hasItem = false;
    for (let i = pageQueue.length - 1; i >= 0; i--) {
        if (pageQueue[i].name === pageName) {
            pageQueue.splice(i, 1);
            hasItem = true;
        }
    }
    if (write && hasItem) {
        writeQueue();
    }
    return hasItem;
}

export function removePageById (pageId: string, write = true) {
    const result = pageQueue.find(page => page.id === pageId);
    if (result) {
        pageQueue.splice(pageQueue.indexOf(result), 1);
        if (write) writeQueue();
        return true;
    }
    return false;
}

export function reinitPageQueue () {
    pageQueue = readQueue();
    return pageQueue;
}

export function getLatestPage () {
    if (pageQueue.length === 0) return null;
    return pageQueue[pageQueue.length - 1];
}
