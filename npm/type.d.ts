export interface IJson<T = any> {
    [prop: string]: T;
}

export interface IPage {
    name: string; // 页面的名称
    id: string; // 页面id
    index: number; // 页面打开的次序
    show: boolean; // 页面是否可见
}

export interface IMsgData {
    data: any; // postMessage 传入的data
    page: IPage; // 消息来源页面的信息
    messageType: string | number; // postMessage 传入的 messageType
    messageId: string; // 生成的唯一消息id
    targetPageId?: string; // 调用 postMessageToTargetId 时传入的 targetPageId 可以通过这个属性判断消息是否来自与 postMessageToTargetId 方法
    targetPageName?: string;  // 调用 postMessageToTargetName 时传入的 targetPageName 可以通过这个属性判断消息是否来自与 postMessageToTargetName 方法
}

export interface IInnerMsgData extends IMsgData{
    innerMessageType?: number;
}

interface IPageEventCollection {
    onUnload(func: (event: BeforeUnloadEvent) => void): () => void;
    onClick(func: (event: MouseEvent) => void): () => void;
    onShow(func: (event: Event) => void): () => void;
    onHide(func: (event: Event) => void): () => void;
}
export interface IMessager extends IPageEventCollection {
    pageId: string;
    pageName: string;
    postMessage(data: any, messageType?: number | string): void;
    postMessageToTargetId(targetPageId: string, data: any, messageType?: number | string): void;
    postMessageToTargetName(targetPageName: string, data: any, messageType?: number | string): void;
    onMessage(fn: (msgData: IMsgData) => void): () => void;
    method: {
        closeOtherPage(): void;
        closeOtherSamePage(): void;
        alertInTargetName(text: string | number, pageName: string): void;
        alertInTargetId(text: string | number, pageId: string): void;
        closePageByPageName(pageName: string): void;
        closePageByPageId(pageId: string): void;
        getLastOpenPage(): IPage | null;
        getLatestActivePage(): IPage | null;
        getAllPages(): IPage[];
    }
}

export interface IPostMessage {
    ({
        data,
        messageType,
        innerMessageType,
        targetPageId,
        targetPageName
    }: {
        data?: any;
        messageType?: string | number;
        innerMessageType?: number;
        targetPageId?: string;
        targetPageName?: string;
    }): void;
}

export interface IPageEvents {
    events: IPageEventCollection;
    triggerUnload(event: BeforeUnloadEvent): void;
    triggerClick(event: MouseEvent): void;
    triggerPageShow(event: Event): void;
    triggerPageHide(event: Event): void;
}