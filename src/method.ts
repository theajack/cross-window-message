/*
 * @Autor: theajack
 * @Date: 2021-05-19 22:53:39
 * @LastEditors: theajack
 * @LastEditTime: 2021-05-19 23:55:36
 * @Description: Coding something
 */

export const INNER_MSG_TYPE = {
    CLOSE_OTHER_SAME_PAGE: 1,
    CLOSE_OTHER_PAGE: 2,
    CLOSE_PAGE_BY_ID: 3,
    CLOSE_PAGE_BY_NAME: 4,
    ALERT_IN_TARGET_NAME: 5,
    ALERT_IN_TARGET_ID: 6,
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

export function onUnload (fn: ()=>void) {
    window.addEventListener('beforeunload', fn, true);
}