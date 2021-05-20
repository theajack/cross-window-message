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