/*
 * @Author: tackchen
 * @Date: 2021-05-19 14:38:19
 * @LastEditors: tackchen
 * @LastEditTime: 2021-05-19 14:38:37
 * @FilePath: \cross-window-message\src\event.ts
 * @Description: Coding something
 */

interface IEventReadyListener<T> {
    (...args: T[]): void
}

interface IEventReadyOption<T> {
    once?: boolean;
    after?: boolean;
    listener: IEventReadyListener<T>;
}

interface IEventReady<T = any> {
    onEventReady(option: IEventReadyListener<T> | IEventReadyOption<T>, ...args: T[]): IEventReadyListener<T>;
    eventReady(...args: T[]): void;
    removeListener(fn: Function): void;
}

export function creatEventReady<T = any> (): IEventReady<T> {

    const queue: {
        listener: IEventReadyListener<T>;
        args: T[];
        once: boolean;
    }[] = [];
    let lastArgs: T[] | null = null;

    function onEventReady (option: IEventReadyListener<T> | IEventReadyOption<T>, ...args: T[]) {
        let once = false, after = false;
        let listener: IEventReadyListener<T>;
        if (typeof option === 'object') {
            if (typeof option.once === 'boolean') once = option.once;
            if (typeof option.after === 'boolean') after = option.after;
            listener = option.listener;
        } else {
            listener = option;
        }

        if (!queue.find(item => item.listener === listener)) {
            queue.push({listener, args, once});
        }
        if (lastArgs !== null && !after) {
            if (args.length === 0 && lastArgs) {
                args = lastArgs;
            }
            listener(...args);
            if (once) removeListener(listener);
        }

        return listener;
    }
     
    function eventReady (...args: T[]) {
        lastArgs = args;
        queue.forEach(item => {
            item.listener(...((args.length === 0) ? item.args : args));
            if (item.once) {
                removeListener(item.listener);
            }
        });
    }

    function removeListener (listener: Function) {
        const result = queue.find(item => item.listener === listener);
        if (result) {
            queue.splice(queue.indexOf(result), 1);
        }
    }

    return {
        onEventReady,
        eventReady,
        removeListener,
    };
}