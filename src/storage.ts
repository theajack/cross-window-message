/**
 * 操作web本地存储数据的工具方法
 *
 * storage()：获取所有值
 * storage(null)：清空所有值
 * storage('a',1) :存储一个值
 * storage('a') :获取一个值
 * storage('a',null) :清除一个值
 * storage({
 *   a:1,
 *   b:{b1:11}
 * }) :以json格式存储值}
 * storage('a',1,true): 最后一个参数表示是否使用sessionStorage
 * storage.session('a',1): 或使用storage.session方法
 */
import {IJson} from './type';
 
 interface IStorage {
    (key: string | IJson, value?: any): any;
    useLocalStorage(): void;
    useSessionStorage(): void;
    geneKey(key: string): string;
    parseKey(key: string): string;
    parseValue(value: string): any;
    write(key: string, value: any): void;
    read(key: string): any;
    readAll(): IJson;
    remove(key: string): void;
    clear(): void;
}

let store = window.localStorage;
const tail = '_note';
  
function useLocalStorage () {
    store = window.localStorage;
}
  
function useSessionStorage () {
    store = window.sessionStorage;
}
  
function geneKey (key: string) {
    return key + tail;
}
  
function parseKey (key: string) {
    const index = key.length - tail.length;
    if (key.substr(index) === tail) {
        return key.substr(0, index);
    }
    return key;
}
  
function write (key: string, value: any) {
    const type = typeof value;
    if (type === 'object') {
        value = JSON.stringify(value);
    } else if (type !== 'string') {
        value = value.toString();
    }
    store.setItem(geneKey(key), `${type}:${value}`);
}
  
function read (key: string) {
    const value = store.getItem(geneKey(key));
    if (value === null) return null;
    return parseValue(value);
}
  
function parseValue (value: string) {
    if (value === null) {
        return null;
    }
    const splitIndex = value.indexOf(':');
    let type = 'string';
    if (splitIndex !== -1) {
        const readType = value.substr(0, splitIndex);
        if (['string', 'number', 'boolean', 'object', 'undefined'].indexOf(readType) !== -1) {
            type = readType;
            value = value.substr(splitIndex + 1);
        }
    }
    if (type === 'number') {
        return parseFloat(value);
    } else if (type === 'boolean') {
        return value === 'true';
    } else if (type === 'object') {
        try {
            return JSON.parse(value);
        } catch (e) {
            return null;
        }
    }
    return value;
}
  
function readAll () {
    const obj: IJson = {};
    Object.keys(store).forEach(function (item) {
        obj[item] = store.getItem(item);
    });
    return obj;
}
  
function remove (key: string) {
    store.removeItem(geneKey(key));
}
  
function clear () {
    Object.keys(store).forEach(function (item) {
        store.removeItem(item);
    });
}
 
const storage: IStorage = (key: string | IJson, value?: any) => {
    if (typeof key === 'object' && key !== null) {
        for (const k in key) storage(k, key[k]);
        return;
    }
    if (typeof value === 'undefined') {
        if (typeof key === 'undefined') return readAll();
        else if (key === null) clear();
        else return read(key);
    }
    else if (value === null) remove(key);
    else return write(key, value);
};
  
storage.useLocalStorage = useLocalStorage;
storage.useSessionStorage = useSessionStorage;
storage.read = read;
storage.readAll = readAll;
storage.write = write;
storage.remove = remove;
storage.clear = clear;
storage.parseValue = parseValue;
storage.parseKey = parseKey;
storage.geneKey = geneKey;
 
export default storage;