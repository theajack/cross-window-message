export interface IJson<T = any> {
    [prop: string]: T;
}

export interface IPage {
    name: string; // 页面的名称
    id: string; // 页面id
    index: number; // 页面打开的次序
    show: boolean; // 页面是否可见
    data?: IJson; // 页面携带的数据
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
    onPageChange(fn: IOnPageChange): () => void;
    method: {
        closeOtherPage(): void; // 关闭其他所有页面
        closeOtherSamePage(): void; // 关闭其他所有和当前页面pageName相同的页面
        alertInTargetName(text: string | number, pageName: string): void; // 在目标pageName页面alert一条消息
        alertInTargetId(text: string | number, pageId: string): void; // 在目标pageId页面alert一条消息
        closePageByPageName(pageName: string): void; // 关闭所有目标pageName页面
        closePageByPageId(pageId: string): void; // 关闭目标pageId页面
        getLastOpenPage(): IPage | null; // 获取最新打开的页面
        getLatestActivePage(): IPage | null; // 获取最新的活跃页面 (触发了click或者onshow事件的页面)
        getAllPages(): IPage[]; // 获取所有打开的页面
        updatePageData(data: IJson, cover?: boolean): boolean; // 更新页面数据 cover 参数表示是否需要覆盖旧的数据，默认为false
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

export interface IOnPageChange {
    (newQueue: IPage[], oldQueue: IPage[]): void;
}

export interface IOptions {
    pageName?: string;
    pageId?: string;
    data?: IJson;
    useSessionStorage?: boolean;
}