# [cross-window-message](https://www.github.com/theajack/cross-window-message)

<p>
    <a href="https://www.github.com/theajack/cross-window-message/stargazers" target="_black">
        <img src="https://img.shields.io/github/stars/theajack/cross-window-message?logo=github" alt="stars" />
    </a>
    <a href="https://www.github.com/theajack/cross-window-message/network/members" target="_black">
        <img src="https://img.shields.io/github/forks/theajack/cross-window-message?logo=github" alt="forks" />
    </a>
    <a href="https://www.npmjs.com/package/cross-window-message" target="_black">
        <img src="https://img.shields.io/npm/v/cross-window-message?logo=npm" alt="version" />
    </a>
    <a href="https://www.npmjs.com/package/cross-window-message" target="_black">
        <img src="https://img.shields.io/npm/dm/cross-window-message?color=%23ffca28&logo=npm" alt="downloads" />
    </a>
    <a href="https://www.jsdelivr.com/package/npm/cross-window-message" target="_black">
        <img src="https://data.jsdelivr.com/v1/package/npm/cross-window-message/badge" alt="jsdelivr" />
    </a>
</p>
<p>
    <a href="https://github.com/theajack" target="_black">
        <img src="https://img.shields.io/badge/Author-%20theajack%20-7289da.svg?&logo=github" alt="author" />
    </a>
    <a href="https://www.github.com/theajack/cross-window-message/blob/master/LICENSE" target="_black">
        <img src="https://img.shields.io/github/license/theajack/cross-window-message?color=%232DCE89&logo=github" alt="license" />
    </a>
    <a href="https://cdn.jsdelivr.net/npm/cross-window-message/cross-window-message.min.js"><img src="https://img.shields.io/bundlephobia/minzip/cross-window-message.svg" alt="Size"></a>
    <a href="https://github.com/theajack/cross-window-message/search?l=javascript"><img src="https://img.shields.io/github/languages/top/theajack/cross-window-message.svg" alt="TopLang"></a>
    <a href="https://github.com/theajack/cross-window-message/issues"><img src="https://img.shields.io/github/issues-closed/theajack/cross-window-message.svg" alt="issue"></a>
    <a href="https://www.github.com/theajack/cross-window-message"><img src="https://img.shields.io/librariesio/dependent-repos/npm/cross-window-message.svg" alt="Dependent"></a>
</p>

<h3>🚀 Elegant cross-window communication and global page management solution</h3>

**[中文](https://github.com/theajack/cross-window-message/blob/master/README.cn.md) | [Update Log](https://github.com/theajack/cross-window-message/blob/master/helper/version.md) | [Feedback bug](https://github.com/theajack/cross-window-message/issues/new) | [Gitee](https://gitee.com/theajack/cross-window-message)**

---

### 0. Features

1. Support directional communication and broadcast communication between different pages
2. Supports pages that can be opened in any way, not limited to the window.open method
3. Support communication between multiple sub-pages opened by the main page
4. Support tagging and tracking the status of each page to facilitate global page management
5. Support multiple method calls such as closing subpages
6. Support monitoring page events
7. Page survival check to ensure page status synchronization
8. Typescript development, easy to use, small in size

### 1. Installation and use

#### 1.1 npm

```
npm i cross-window-message
```

```js
import initMessager from'cross-window-message';
```

#### 1.2 cdn introduction

```html
<script src="https://cdn.jsdelivr.net/npm/cross-window-message/cross-window-message.min.js"></script>
<script>
    console.log(initMessager);
</script>
```

### 2. Introduction


The principle of `cross-window-message` is based on window.onstorage event and localStorage for cross-page communication

Why not use window.open with postMessage and onMessage events? There are several reasons

1. The conditions of use are relatively harsh, and only apply to pages opened with window.open
2. Inconvenient communication between multiple sub-pages opened by the main page
3. Cannot broadcast communication between multiple pages
4. Unable to mark the status of each page

manual

Call `initMessager` when entering the page to generate a Messager, this method supports two optional parameters, pageName and pageId

pageName represents the name of the page, and there can be the same page. If not passed in, use the pathname of the current page

pageId represents the page ID, each new page must be unique. If not passed in, a default unique id will be generated

```js
import initMessager from'cross-window-message';
const messager = initMessager('pageName','pageId');
```

After that, the communication between each page depends on this Messager.

### 3. api

#### 3.1 Messager ts statement

```ts
interface IMessager {
    pageId: string;
    pageName: string;
    postMessage(data: any, messageType?: number | string): void;
    postMessageToTargetId(targetPageId: string, data: any, messageType?: number | string): void;
    postMessageToTargetName(targetPageName: string, data: any, messageType?: number | string): void;
    onMessage(fn: (msgData: IMsgData) => void): () => void;
    onUnload(func: (event: BeforeUnloadEvent) => void): () => void;
    onClick(func: (event: MouseEvent) => void): () => void;
    onShow(func: (event: Event) => void): () => void;
    onHide(func: (event: Event) => void): () => void;
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

interface IPage {
    name: string;
    id: string;
    index: number;
    show: boolean;
}
interface IMsgData {
    data: any;
    page: IPage;
    messageType: string | number;
    messageId: string;
    targetPageId?: string;
    targetPageName?: string;
}
```

#### 3.2 pageId and pageName

Incoming or generated page id and page name attributes

#### 3.3 postMessage method

```ts
function postMessage(data: any, messageType?: number | string): void;
```

```js
import initMessager from'cross-window-message';
const messager = initMessager('pageName','pageId');
messager.postMessage({
    text:'Hello World!'
})
```

Send data to all other pages (including yourself), the second parameter indicates the message type, can be empty

### 3.4 postMessageToTargetId and postMessageToTargetName

```ts
function postMessageToTargetId(targetPageId: string, data: any, messageType?: number | string): void;
function postMessageToTargetName(targetPageName: string, data: any, messageType?: number | string): void;
```

These two methods are used to send data to the page with the specified pageId or pageName, and other non-target pages will not receive the message

Other usage is consistent with postMessage

#### 3.5 onMessage

```ts
function onMessage(fn: (msgData: IMsgData) => void): () => void;

interface IMsgData {
    data: any; // data passed by postMessage
    page: IPage; // Information on the source page
    messageType: string | number; // messageType passed in by postMessage
    messageId: string; // The unique message id generated
    targetPageId?: string; // The targetPageId passed in when calling postMessageToTargetId can use this property to determine whether the message comes from the postMessageToTargetId method
    targetPageName?: string; // The targetPageName passed in when calling postMessageToTargetName can use this property to determine whether the message comes from the postMessageToTargetName method
}
interface IPage {
    name: string; // the name of the page
    id: string; // page id
    index: number; // order of page opening
    show: boolean; // Whether the page is visible
}
```

```js
import initMessager from'cross-window-message';
const messager = initMessager('pageName','pageId');
messager.onMessage((msgData)=>{
    console.log(msgData);
})
```

Register for an event to receive messages

The parameter received by the event callback is an IMsgData type

#### 3.6 Page events

```ts
function onUnload(func: (event: BeforeUnloadEvent) => void): () => void;
function onClick(func: (event: MouseEvent) => void): () => void;
function onShow(func: (event: Event) => void): () => void;
function onHide(func: (event: Event) => void): () => void;
```

They are used to monitor the beforeunload click visibilitychange event of the page respectively

The parameters are the same as the original

#### 3.7 Tool method

Some tool methods are exposed on the messager.method object

```js
import initMessager from'cross-window-message';
const messager = initMessager('pageName','pageId');
messager.method.closeOtherPage()
```

```ts
closeOtherPage(): void; // Close all other pages
closeOtherSamePage(): void; // Close all other pages with the same pageName as the current page
alertInTargetName(text: string | number, pageName: string): void; // alert a message on the target pageName page
alertInTargetId(text: string | number, pageId: string): void; // alert a message on the target pageId page
closePageByPageName(pageName: string): void; // Close all target pageName pages
closePageByPageId(pageId: string): void; // Close the target pageId page
getLastOpenPage(): IPage | null; // Get the latest opened page
getLatestActivePage(): IPage | null; // Get the latest active page (the page that triggered the click or onshow event)
getAllPages(): IPage[]; // Get all open pages
```

#### Version 3.8

```js
import initMessager from'cross-window-message';
initMessager.version;
```