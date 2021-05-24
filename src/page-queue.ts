/*
 * @Autor: theajack
 * @Date: 2021-05-19 22:40:45
 * @LastEditors: theajack
 * @LastEditTime: 2021-05-25 00:14:41
 * @Description: Coding something
 */

import storage from './storage';
import {IJson, IPage} from './type';
import {random} from './util';
import {isPageHide} from './method';
import {creatEventReady} from './event';

export const PAGE_QUEUE_KEY = 'cwm_page_queue';

export async function readPageQueue (): Promise<IPage[]> {
    console.warn('before QueueLocker.waitRelease');
    await QueueLocker.waitRelease();
    console.warn('after QueueLocker.waitRelease');
    QueueLocker.lock();
    return readPageQueueSync();
}

export function readPageQueueSync (): IPage[] {
    const result = storage.read(PAGE_QUEUE_KEY);
    return (result instanceof Array) ? result : [];
}

function writePageQueue (pageQueue: IPage[]) {
    console.warn('=============================');
    console.log('timestamp', Date.now());
    console.log('pageQueue', pageQueue.map(page => page.id).join(' | '));
    console.warn('=============================');
    QueueLocker.lock();
    storage.write(PAGE_QUEUE_KEY, pageQueue);
}

async function findPageById (pageId: string) {
    const pageQueue = await readPageQueue();
    const page = pageQueue.find(page => page.id === pageId);
    return {pageQueue, page};
}

export function generatePage (pageName: string, pageId: string, data?: IJson) {
    const page: IPage = {
        name: pageName,
        id: pageId || `${pageName}${Date.now().toString().substr(4)}${random(100000, 999999)}`,
        index: 0,
        show: !isPageHide(),
    };
    if (typeof data !== 'undefined') {page.data = data;}
    return page;
}

export async function onPageEnter (page: IPage): Promise<IPage> {
    const pageQueue = await readPageQueue();
    page.index = pageQueue.length;
    pageQueue.push(page);
    debugger;
    writePageQueue(pageQueue);
    return page;
}

export function onPageUnload (page: IPage) {
    removePageById(page.id);
}

export async function removePageByName (pageName: string, write = true) {
    const pageQueue = await readPageQueue();
    let hasItem = false;
    for (let i = pageQueue.length - 1; i >= 0; i--) {
        if (pageQueue[i].name === pageName) {
            removePage(pageQueue, i);
            hasItem = true;
        }
    }
    if (write && hasItem) {
        writePageQueue(pageQueue);
    }
    return hasItem;
}

export async function removePageById (pageId: string, write = true) {
    const {pageQueue, page} = await findPageById(pageId);
    if (page) {
        removePage(pageQueue, page);
        if (write) writePageQueue(pageQueue);
        return true;
    }
    return false;
}

// 获取最新有活动的页面
export async function getLatestActivePage () {
    return countLatestActivePage(await readPageQueue());
}
export function getLatestActivePageSync () {
    return countLatestActivePage(readPageQueueSync());
}
function countLatestActivePage (pageQueue: IPage[]) {
    if (pageQueue.length === 0) return null;
    return pageQueue[pageQueue.length - 1];
}

// 获取最后一个打开的页面
export async function getLastOpenPage () {
    return countLastOpenPage(await readPageQueue());
}

export function getLastOpenPageSync () {
    return countLastOpenPage(readPageQueueSync());
}

function countLastOpenPage (pageQueue: IPage[]) {
    if (pageQueue.length === 0) return null;
    pageQueue.sort((a, b) => b.index - a.index);
    return pageQueue[0];
}

export async function getBigestPageIndex () {
    const lastOpenPage = await getLastOpenPage();
    return (!lastOpenPage) ? 0 : lastOpenPage.index;
}

export async function checkPageQueueAlive (alivePageIds: string[]) {
    const pageQueue = await readPageQueue();
    let hasItem = false;
    for (let i = pageQueue.length - 1; i >= 0; i--) {
        if (alivePageIds.indexOf(pageQueue[i].id) === -1) {
            removePage(pageQueue, i);
            hasItem = true;
        }
    }
    if (hasItem) {writePageQueue(pageQueue);}
}

export async function putPageOnTop (pageId: string, fromPageShow: boolean = false) {
    const {pageQueue, page} = await findPageById(pageId);
    if (page) {
        if (fromPageShow) {
            page.show = true;
        }
        removePage(pageQueue, page);
        pageQueue.push(page);
        writePageQueue(pageQueue);
    }
}

export async function hidePage (pageId: string) {
    const {pageQueue, page} = await findPageById(pageId);
    if (page) {
        page.show = false;
        writePageQueue(pageQueue);
    }
}

function removePage (pageQueue: IPage[], page: number | IPage) {
    const index = typeof page === 'number' ? page : pageQueue.indexOf(page);
    pageQueue.splice(index, 1);
}

export const QueueLocker = (() => {
    const LOCKER_KEY = 'cwm_queue_locker';
    const {eventReady, onEventReady, clearEvent} = creatEventReady();

    const isLocked = () => {
        return storage.read(LOCKER_KEY) === true;
    };

    const lock = () => {
        if (!isLocked())
            storage.write(LOCKER_KEY, true);
    };
    const unlock = () => {
        storage.write(LOCKER_KEY, false);
        eventReady();
        clearEvent();
    };

    window.addEventListener('storage', (e) => {
        if (!e.key) return;
        const key = storage.parseKey(e.key);
        console.log('window.addEventListener(', key, e.newValue);
        if (isLocked()) {
            if (key === PAGE_QUEUE_KEY ) {
                unlock();
            } else if (key === LOCKER_KEY) {
                if (storage.parseValue(e.newValue || '') === false) {
                    unlock();
                }
            }
        }
    }, false);
    return {
        async waitRelease () {
            return new Promise((resolve) => {
                if (isLocked()) {
                    onEventReady(() => {
                        resolve(true);
                    });
                } else {
                    resolve(false);
                }
            });
        },
        lock,
        unlock,
        isLocked,
    };
})();
declare global {
    interface Window {
        QueueLocker: any;
    }
}
window.QueueLocker = QueueLocker;