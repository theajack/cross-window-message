/*
 * @Author: tackchen
 * @Date: 2021-05-19 14:38:19
 * @LastEditors: theajack
 * @LastEditTime: 2021-05-24 23:17:06
 * @FilePath: \cross-window-message\src\event.ts
 * @Description: Event lib
 */
interface IEventReadyListener<T> {
    (...args: T[]): void
}

export interface IEventReadyEmit<T = any> extends IEventReadyListener<T> {}

interface IEventReadyOption<T> {
    once?: boolean;
    after?: boolean;
    head?: boolean;
    listener: IEventReadyListener<T>;
}
interface IEventReady<T = any> {
    onEventReady(option: IEventReadyListener<T> | IEventReadyOption<T>, ...args: T[]): IEventReadyListener<T>;
    eventReady: IEventReadyEmit<T>;
    removeListener(fn: Function): void;
    isFirstReady(): boolean;
    clearEvent(): void;
}

export function creatEventReady<T = any> (): IEventReady<T> {
    let queue: {
        listener: IEventReadyListener<T>;
        args: T[];
        once: boolean;
    }[] = [];
    let lastArgs: T[] | null = null;
    let isFirst = true;

    function onEventReady (option: IEventReadyListener<T> | IEventReadyOption<T>, ...args: T[]) {
        let once = false, after = false, head = false;
        let listener: IEventReadyListener<T>;
        if (typeof option === 'object') {
            if (typeof option.once === 'boolean') once = option.once;
            if (typeof option.after === 'boolean') after = option.after;
            if (typeof option.head === 'boolean') head = option.head;
            listener = option.listener;
        } else
            listener = option;
        if (!queue.find(item => item.listener === listener))
            queue[head ? 'unshift' : 'push']({listener, args, once});
        if (lastArgs !== null && !after) {
            if (args.length === 0 && lastArgs) args = lastArgs;
            listener(...args);
            if (once) removeListener(listener);
        }
        return listener;
    }
     
    function eventReady (...args: T[]) {
        lastArgs = args;
        queue.forEach(item => {
            item.listener(...((args.length === 0) ? item.args : args));
            if (item.once) removeListener(item.listener);
        });
        isFirst = false;
    }

    function removeListener (listener: IEventReadyListener<T>) {
        const result = queue.find(item => item.listener === listener);
        if (result) queue.splice(queue.indexOf(result), 1);
    }

    function clearEvent () {
        queue = [];
    }

    return {
        onEventReady,
        eventReady,
        removeListener,
        isFirstReady: () => isFirst,
        clearEvent
    };
}