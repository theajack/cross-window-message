export interface IJson<T = any> {
    [prop: string]: T;
}

export interface IPage {
    name: string;
    id: string;
    index: number;
    show: boolean;
}

export interface IMsgData {
    data: any;
    page: IPage;
    messageType: string | number;
    messageId: string;
    innerMessageType?: number;
    targetPageId?: string;
    targetPageName?: string;
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