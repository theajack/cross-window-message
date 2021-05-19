import {initMessager} from '../src';

declare global {
    interface Window {
        initMessager: any;
    }
}

window.initMessager = initMessager;