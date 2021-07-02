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

**[中文](https://github.com/theajack/cross-window-message/blob/master/README.cn.md) | [Use Case](https://www.theajack.com/cross-window-message/) | [Update Log](https://github.com/theajack/cross-window-message/blob/master/helper/version.md) | [Feedback bug](https://github.com/theajack/cross-window-message/issues/new) | [Gitee](https://gitee.com/theajack/cross-window-message)**

---

<!--To ensure that the directory is generated normally, please modify the readme file in the helper-->

<details>
    <summary>Expand the table of contents</summary>

<!-- toc -->

- [0. Features](#0-features)
- [1. Installation and use](#1-installation-and-use)
  * [1.1 npm](#11-npm)
  * [1.2 cdn introduction](#12-cdn-introduction)
- [2. Introduction](#2-introduction)
- [3. api](#3-api)
  * [3.1 initMessager](#31-initmessager)
  * [3.2 Messager ts statement](#32-messager-ts-statement)
  * [3.3 postMessage method](#33-postmessage-method)
- [3.4 postMessageToTargetId and postMessageToTargetName](#34-postmessagetotargetid-and-postmessagetotargetname)
  * [3.5 onMessage](#35-onmessage)
  * [3.6 onPageChange](#36-onpagechange)
  * [3.7 Page events](#37-page-events)
  * [3.8 Tool method](#38-tool-method)
  * [Version 3.9](#version-39)

<!-- tocstop -->

</details>

---

### 0. Features

1. Support directional communication and broadcast communication between different pages
2. Supports pages that can be opened in any way, not limited to the window.open method
3. Support communication between multiple sub-pages opened by the main page
4. Support tagging and tracking the status of each page to facilitate global page management
5. Support multiple method calls such as closing subpages
6. Support monitoring page events
7. Page survival check to ensure page status synchronization
8. Support page to carry data and select sessionStorage as the storage source
9. Typescript development, easy to use, small in size

### 1. Installation and use

#### 1.1 npm

```
npm i cross-window-message
```

```js
import initMessager from 'cross-window-message';
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

When entering the page, call `initMessager` to generate a Messager. This method supports passing in an optional parameter option, all of which are optional. The data structure is as follows:

```ts
interface IOptions {
    pageName?: string;
    pageId?: string;
    data?: IJson;
    useSessionStorage?: boolean;
}
```

1. pageName represents the name of the page, and there can be the same page. If not passed in, use the pathname of the current page
2. pageId represents the page ID, each new page must be unique. If not passed in, a default unique id will be generated
3. The data carried on the current page will be written to storage
4. Whether to use sessionStorage to store the state, the default is to use localStorage, this parameter needs to be consistent across all pages

```js
import initMessager from 'cross-window-message';
const messager = initMessager({
    pageName:'xxx'
});
```

After that, the communication between each page depends on this Messager.

### 3. api

#### 3.1 initMessager

Call `initMessager` to generate a Messager, this method passes in optional option parameters

```js
import initMessager from 'cross-window-message';
const messager = initMessager({
    pageName:'xxx'
});
```

```ts
interface IOptions {
    pageName?: string;
    pageId?: string;
    data?: IJson;
    useSessionStorage?: boolean;
}
```

#### 3.2 Messager ts statement

```ts
interface IMessager {
    pageId: string;
    pageName: string;
    postMessage(data: any, messageType?: number | string): void;
    postMessageToTargetId(targetPageId: string, data: any, messageType?: number | string): void;
    postMessageToTargetName(targetPageName: string, data: any, messageType?: number | string): void;
    onMessage(fn: (msgData: IMsgData) => void): () => void;
    onPageChange(fn: IOnPageChange): () => void;
    onBeforeUnload(func: (event: BeforeUnloadEvent) => void): () => void;
    onUnload(func: (event: Event) => void): () => void;
    onClick(func: (event: MouseEvent) => void): () => void;
    onShow(func: (event: Event) => void): () => void;
    onHide(func: (event: Event) => void): () => void;
    method: {
        closeOtherPage(): void; // Close all other pages
        closeOtherSamePage(): void; // Close all other pages with the same pageName as the current page
        alertInTargetName(text: string | number, pageName: string): void; // alert a message on the target pageName page
        alertInTargetId(text: string | number, pageId: string): void; // alert a message on the target pageId page
        closePageByPageName(pageName: string): void; // Close all target pageName pages
        closePageByPageId(pageId: string): void; // Close the target pageId page
        getLastOpenPage(): IPage | null; // Get the latest opened page
        getLatestActivePage(): IPage | null; // Get the latest active page (the page that triggered the click or onshow event)
        getAllPages(): IPage[]; // Get all open pages
        updatePageData(data: IJson, cover?: boolean): boolean; // Update page data
    }
}

interface IPage {
    name: string; // the name of the page
    id: string; // page id
    index: number; // order of page opening
    show: boolean; // Whether the page is visible
    data?: IJson; // data carried on the page
}
interface IMsgData {
    data: any; // data passed by postMessage
    page: IPage; // Information on the source page
    messageType: string | number; // messageType passed in by postMessage
    messageId: string; // The unique message id generated
    targetPageId?: string; // The targetPageId passed in when calling postMessageToTargetId can use this property to determine whether the message comes from the postMessageToTargetId method
    targetPageName?: string; // The targetPageName passed in when calling postMessageToTargetName can use this property to determine whether the message comes from the postMessageToTargetName method
}
```

#### 3.3 postMessage method

```ts
function postMessage(data: any, messageType?: number | string): void;
```

```js
import initMessager from 'cross-window-message';
const messager = initMessager();
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

Listen to the message, this method will return a function, the execution can be used to cancel the monitoring

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
import initMessager from 'cross-window-message';
const messager = initMessager();
messager.onMessage((msgData)=>{
    console.log(msgData);
})
```

Register for an event to receive messages

The parameter received by the event callback is an IMsgData type

#### 3.6 onPageChange

Monitor all page change events, this method will return a function, the execution can be used to cancel the monitoring

```ts
function onPageChange(fn: (newQueue: IPage[], oldQueue: IPage[]) => void): () => void;
```

```js
import initMessager from 'cross-window-message';
const messager = initMessager();
messager.onPageChange((newQueue, oldQueue)=>{
     console.log(newQueue, oldQueue);
})
```

#### 3.7 Page events

```ts
function onBeforeUnload(func: (event: BeforeUnloadEvent) => void): () => void;
function onUnload(func: (event: Event) => void): () => void;
function onClick(func: (event: MouseEvent) => void): () => void;
function onShow(func: (event: Event) => void): () => void;
function onHide(func: (event: Event) => void): () => void;
```

They are used to monitor the beforeunload, unload, click, visibilitychange event of the page respectively

The parameters are the same as the original

#### 3.8 Tool method

Some tool methods are exposed on the messager.method object

```js
import initMessager from 'cross-window-message';
const messager = initMessager();
messager.method.closeOtherPage();
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
updatePageData(data: IJson, cover?: boolean): boolean; // Update page data The cover parameter indicates whether the old data needs to be overwritten, the default is false
```

#### Version 3.9

```js
import initMessager from 'cross-window-message';
initMessager.version;
```