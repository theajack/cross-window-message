export interface IJson<T = any> {
    [prop: string]: T;
}

export interface IPage {
    name: string;
    id: string;
}

export interface IMsgData {
    data: any;
    page: IPage;
    messageType: string | number;
    messageId: string;
    innerMessageType?: number;
}