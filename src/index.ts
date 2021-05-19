/*
 * @Author: tackchen
 * @Date: 2021-05-19 13:26:53
 * @LastEditors: tackchen
 * @LastEditTime: 2021-05-19 14:41:27
 * @FilePath: \cross-window-message\src\index.ts
 * @Description: Coding something
 */

import {random} from './util'
import {creatEventReady} from './event'
import storage from './storage'



let pageId = 0;
let msgId = random(0, 10000); // ! 记录一个msgId 不然相同的msg不会被触发

export function initMessager (pageName = '') {
    const MSG_KEY = 'cross_window_msg';

    const {onEventReady, eventReady, removeListener} = creatEventReady();

    window.addEventListener('storage', (e) => {
        if (storage.parseKey(e.key) !== MSG_KEY) return null;
        eventReady(storage.parseValue(e.newValue));
    }, false);

    return {
        pageId: pageId++,
        pageName,
        postMessage (data) {
            if (typeof data !== 'object') {
                data = {data};
            }
            data.page = pageName;
            data.pageId = this.pageId;
            data.msgId = msgId++;
            storage.write(MSG_KEY, data);
        },
        onMessage (fn) {
            onEventReady(fn);
        },
        removeListener (fn) {
            removeListener(fn);
        }
    };
}