/*
 * @Author: tackchen
 * @Date: 2021-04-15 13:22:55
 * @LastEditors: theajack
 * @LastEditTime: 2021-04-17 14:55:40
 * @FilePath: \util\public\main.ts
 * @Description: Coding something
 */
import tcUtils from '../src/index';
// export tcUtils from '../src/lib/byte';

// export default _byte;

declare global {
    interface Window {
        tcUtils: any;
    }
}

window.tcUtils = tcUtils;