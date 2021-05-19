/*
 * @Author: tackchen
 * @Date: 2021-05-19 14:37:36
 * @LastEditors: tackchen
 * @LastEditTime: 2021-05-19 14:39:44
 * @FilePath: \cross-window-message\src\util.ts
 * @Description: Coding something
 */
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