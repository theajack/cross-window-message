/*
 * @Author: tackchen
 * @Date: 2021-05-19 14:37:36
 * @LastEditors: theajack
 * @LastEditTime: 2021-05-20 23:46:56
 * @FilePath: \cross-window-message\src\util.ts
 * @Description: Coding something
 */

declare global {
    interface Document {
        mozHidden?: boolean;
        msHidden?: boolean;
        webkitHidden?: boolean;
        mozVisibilityState?: string;
        msVisibilityState?: string;
        webkitVisibilityState?: string;
    }
}

export function random (a: number, b: number) {
    return (a + Math.round(Math.random() * (b - a)));
};

export function parseJSON (data: any) {
    if (typeof data === 'object') {return data;}
    try {
        return JSON.parse(data);
    } catch (e) {
        return null;
    }
}

const PageShowStateStr = (() => {
    let hidden: string = '',
        state: 'visibilityState' | 'mozVisibilityState' | 'msVisibilityState' | 'webkitVisibilityState' = 'visibilityState',
        visibilityChange: string = '';
    if (typeof document.hidden !== 'undefined') {
        hidden = 'hidden';
        visibilityChange = 'visibilitychange';
        state = 'visibilityState';
    } else if (typeof document.mozHidden !== 'undefined') {
        hidden = 'mozHidden';
        visibilityChange = 'mozvisibilitychange';
        state = 'mozVisibilityState';
    } else if (typeof document.msHidden !== 'undefined') {
        hidden = 'msHidden';
        visibilityChange = 'msvisibilitychange';
        state = 'msVisibilityState';
    } else if (typeof document.webkitHidden !== 'undefined') {
        hidden = 'webkitHidden';
        visibilityChange = 'webkitvisibilitychange';
        state = 'webkitVisibilityState';
    }
    return {
        hidden, state, visibilityChange
    };
})();

export function isPageHide () {
    return document[PageShowStateStr.state] === PageShowStateStr.hidden;
}

export function onPageShowHide (onshow: (e: Event)=>void, onhide?: (e: Event)=>void) {
    // 切换后台倒计时停止问题
    const callback = (e: Event) => {
        if (isPageHide()) {
            if (onhide)onhide(e);
        } else {
            onshow(e);
        }
    };
    document.removeEventListener(PageShowStateStr.visibilityChange, callback, false);
    document.addEventListener(PageShowStateStr.visibilityChange, callback, false);
}