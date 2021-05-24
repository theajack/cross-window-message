
import {IMessager} from './type';

interface IInitMessager {
    (pageName?: string, pageId?: string): IMessager;
    version: string;
}

declare const initMessager: IInitMessager;

export default initMessager;