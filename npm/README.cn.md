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

<h3>🚀 优雅的跨窗口通信与全局页面管理解决方案</h3>

**[English](https://github.com/theajack/cross-window-message/blob/master/README.md) | [使用实例](https://www.theajack.com/cross-window-message/) | [更新日志](https://github.com/theajack/cross-window-message/blob/master/helper/version.md) | [反馈](https://github.com/theajack/cross-window-message/issues/new) | [Gitee](https://gitee.com/theajack/cross-window-message)**

---

### 0. 特性

1. 支持不同页面之间的 定向通信 和 广播通信
2. 支持任意方式打开的页面，不局限于 window.open 方法
3. 支持多个由主页面打开的子页面之间通信
4. 支持标记和追踪各个页面的状态，方便进行全局页面管理
5. 支持关闭子页面等多种方法调用
6. 支持监听页面事件
7. 页面存活检查，保证页面状态同步
8. 支持页面携带数据和选择sessionStorage作为存储源
9.  typescript开发，使用简单，体积小巧

### 1. 安装使用

#### 1.1 npm

```
npm i cross-window-message
```

```js
import initMessager from 'cross-window-message'; 
```

#### 1.2 cdn 引入

```html
<script src="https://cdn.jsdelivr.net/npm/cross-window-message/cross-window-message.min.js"></script>
<script>
    console.log(initMessager);
</script>
```

### 2. 使用介绍


`cross-window-message` 原理是基于 window.onstorage 事件以及 localStorage 进行跨页面通信

为什么不使用 window.open 配合 postMessage和onMessage事件，有以下几点原因

1. 使用条件比较苛刻，只适用于使用 window.open 打开的页面
2. 多个由主页面打开的子页面之间不方便通信
3. 多个页面之间无法广播通信
4. 无法标记各个页面状态

使用流程

进入页面时调用 `initMessager` 生成一个 Messager, 该方法支持传入一个可选参数 option，其中的所有属性都是可选的，数据结构如下:

```ts
interface IOptions {
    pageName?: string;
    pageId?: string;
    data?: IJson;
    useSessionStorage?: boolean;
}
```

1. pageName 表示页面名称，可以有相同的页面。如果不传入则使用当前页面的 pathname
2. pageId 表示页面ID，每一个新页面必须是唯一的。如果不传入会生成一个默认的唯一id
3. 当前页面携带的数据，会写入storage中
4. 是否使用 sessionStorage 存储状态，默认是使用 localStorage，这个参数需要所有页面保持一致

```js
import initMessager from 'cross-window-message'; 
const messager = initMessager({
    pageName: 'xxx'
});
```

之后各个页面之间的通信都是依赖于这个 Messager 进行

### 3. api

#### 3.1 initMessager

调用 `initMessager` 生成一个 Messager，该方法传入可选的 option参数

```js
import initMessager from 'cross-window-message'; 
const messager = initMessager({
    pageName: 'xxx'
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

#### 3.2 Messager ts声明

```ts
interface IMessager {
    pageId: string;
    pageName: string;
    postMessage(data: any, messageType?: number | string): void;
    postMessageToTargetId(targetPageId: string, data: any, messageType?: number | string): void;
    postMessageToTargetName(targetPageName: string, data: any, messageType?: number | string): void;
    onMessage(fn: (msgData: IMsgData) => void): () => void;
    onPageChange(fn: IOnPageChange): () => void;
    onUnload(func: (event: BeforeUnloadEvent) => void): () => void;
    onClick(func: (event: MouseEvent) => void): () => void;
    onShow(func: (event: Event) => void): () => void;
    onHide(func: (event: Event) => void): () => void;
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
        updataPageData(data: IJson, cover?: boolean): boolean; // 更新页面数据
    }
}

interface IPage {
    name: string; // 页面的名称
    id: string; // 页面id
    index: number; // 页面打开的次序
    show: boolean; // 页面是否可见
    data?: IJson; // 页面携带的数据
}
interface IMsgData {
    data: any; // postMessage 传入的data
    page: IPage; // 消息来源页面的信息
    messageType: string | number; // postMessage 传入的 messageType
    messageId: string; // 生成的唯一消息id
    targetPageId?: string; // 调用 postMessageToTargetId 时传入的 targetPageId 可以通过这个属性判断消息是否来自与 postMessageToTargetId 方法
    targetPageName?: string;  // 调用 postMessageToTargetName 时传入的 targetPageName 可以通过这个属性判断消息是否来自与 postMessageToTargetName 方法
}
```

#### 3.3 postMessage 方法

```ts
function postMessage(data: any, messageType?: number | string): void;
```

```js
import initMessager from 'cross-window-message'; 
const messager = initMessager();
messager.postMessage({
    text: 'Hello World!'
})
```

向其他所有页面（包含自己）发送数据，第二个参数表示消息类型，可以为空

### 3.4 postMessageToTargetId 和 postMessageToTargetName

```ts
function postMessageToTargetId(targetPageId: string, data: any, messageType?: number | string): void;
function postMessageToTargetName(targetPageName: string, data: any, messageType?: number | string): void;
```

这两个方法用于向指定 pageId 或者 pageName 的页面定向发送数据，其他非目标页面不会收到消息

其他用法与 postMessage 一致

#### 3.5 onMessage

监听消息，该方法会返回一个函数，执行可以用去取消此次监听

```ts
function onMessage(fn: (msgData: IMsgData) => void): () => void;

interface IMsgData {
    data: any; // postMessage 传入的data
    page: IPage; // 消息来源页面的信息
    messageType: string | number; // postMessage 传入的 messageType
    messageId: string; // 生成的唯一消息id
    targetPageId?: string; // 调用 postMessageToTargetId 时传入的 targetPageId 可以通过这个属性判断消息是否来自与 postMessageToTargetId 方法
    targetPageName?: string;  // 调用 postMessageToTargetName 时传入的 targetPageName 可以通过这个属性判断消息是否来自与 postMessageToTargetName 方法
}
interface IPage {
    name: string; // 页面的名称
    id: string; // 页面id
    index: number; // 页面打开的次序
    show: boolean; // 页面是否可见
}
```

```js
import initMessager from 'cross-window-message'; 
const messager = initMessager();
messager.onMessage((msgData)=>{
    console.log(msgData);
})
```

注册一个接收消息的事件

事件回调接收的参数是一个 IMsgData 类型

#### 3.6 onPageChange

监听所有页面改变的事件，该方法会返回一个函数，执行可以用去取消此次监听

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

#### 3.7 页面事件

```ts
function onUnload(func: (event: BeforeUnloadEvent) => void): () => void;
function onClick(func: (event: MouseEvent) => void): () => void;
function onShow(func: (event: Event) => void): () => void;
function onHide(func: (event: Event) => void): () => void;
```

分别用于监听页面的 beforeunload click visibilitychange 事件

参数与原生一致

#### 3.8 工具方法

messager.method 对象上暴露了一些工具方法

```js
import initMessager from 'cross-window-message'; 
const messager = initMessager();
messager.method.closeOtherPage();
```

```ts
closeOtherPage(): void; // 关闭其他所有页面
closeOtherSamePage(): void; // 关闭其他所有和当前页面pageName相同的页面
alertInTargetName(text: string | number, pageName: string): void; // 在目标pageName页面alert一条消息
alertInTargetId(text: string | number, pageId: string): void; // 在目标pageId页面alert一条消息
closePageByPageName(pageName: string): void; // 关闭所有目标pageName页面
closePageByPageId(pageId: string): void; // 关闭目标pageId页面
getLastOpenPage(): IPage | null; // 获取最新打开的页面
getLatestActivePage(): IPage | null; // 获取最新的活跃页面 (触发了click或者onshow事件的页面)
getAllPages(): IPage[]; // 获取所有打开的页面
updataPageData(data: IJson, cover?: boolean): boolean; // 更新页面数据 cover 参数表示是否需要覆盖旧的数据，默认为false
```

#### 3.9 版本

```js
import initMessager from 'cross-window-message'; 
initMessager.version;
```
