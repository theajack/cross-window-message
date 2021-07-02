/*
 * @Autor: theajack
 * @Date: 2021-05-19 22:53:39
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-07-03 00:54:30
 * @Description: Method
 */

export const INNER_MSG_TYPE = {
    CLOSE_OTHER_SAME_PAGE: 1,
    CLOSE_OTHER_PAGE: 2,
    CLOSE_PAGE_BY_ID: 3,
    CLOSE_PAGE_BY_NAME: 4,
    ALERT_IN_TARGET_NAME: 5,
    ALERT_IN_TARGET_ID: 6,
    ENSURE_ALIVE: 7,
    REPLAY_ALIVE: 8,
};

export function getDefaultPageName () {
    return location.pathname.replace(/\//g, '_');
}

export function closePage () {
    window.close();
    setTimeout(() => {
        window.location.href = `https://tackchen.gitee.io/404.html?h=${encodeURIComponent(location.host)}`;
    }, 100);
}

export function onUnload (fn: (e: Event)=>void) {
    if (typeof window.onunload !== 'undefined') {
        window.addEventListener('unload', fn, true);
    } else { // 如果不支持onunload事件 则使用beforeUnload代替
        onBeforeUnload(fn);
    }
}

export function onBeforeUnload (fn: (e: BeforeUnloadEvent)=>void) {
    window.addEventListener('beforeunload', fn, true);
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
    document.removeEventListener(PageShowStateStr.visibilityChange, callback, true);
    document.addEventListener(PageShowStateStr.visibilityChange, callback, true);
}