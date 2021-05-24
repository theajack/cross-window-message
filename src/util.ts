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