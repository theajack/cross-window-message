import initMessager from '../src';
import './index.css';
declare global {
    interface Window {
        initMessager: any;
        messager: any;
        [prop: string]: any;
    }
}

const messager = initMessager({pageName: 'cwm_page', pageId: location.hash});

window.messager = messager;

function main () {
    window.initMessager = initMessager;
    initHtml();
    initPageInfo();
    commonInit();

    onMessageInit();
    postMessageInit();
    postMessageToTargetIdInit();
    postMessageToTargetNameInit();
    closePageInit();
    getAllPagesInit();
}

main();

function initPageInfo () {
    getEleById('pageName').innerText = messager.pageName;
    getEleById('pageNameCopy').onclick = () => {
        copy(messager.pageName);
        toast(getEleById('pageName'), '复制成功');
    };
    getEleById('pageId').innerText = messager.pageId;
    getEleById('pageIdCopy').onclick = () => {
        copy(messager.pageId);
        toast(getEleById('pageIdCopy'), '复制成功');
    };
    getEleById('openNewPage').onclick = () => window.open(location.href);
}

function onMessageInit () {
    const id = 'onMessage';
    const display = getDisplayEle(id);
    messager.onMessage((msgData) => {
        display.innerText += `${JSON.stringify(msgData)}\r\n`;
    });
}
function postMessageInit () {
    const id = 'postMessage';
    getEleById(id).onclick = () => {
        const value = getValue(id);
        messager.postMessage(value);
    };
}
function postMessageToTargetIdInit () {
    const id = 'postMessageToTargetId';
    getEleById(id).onclick = () => {
        const pageId = getValue(id);
        const value = getValue2(id);
        if (pageId === '') {
            toast(getEleById(id), 'pageId不能为空');
            return;
        }
        messager.postMessageToTargetId(pageId, value);
    };
}
function postMessageToTargetNameInit () {
    const id = 'postMessageToTargetName';
    getEleById(id).onclick = () => {
        const pageName = getValue(id);
        const value = getValue2(id);
        if (pageName === '') {
            toast(getEleById(id), 'pageName不能为空');
            return;
        }
        messager.postMessageToTargetName(pageName, value);
    };
}
function closePageInit () {
    const id = 'closePageByPageId';
    getEleById(id).onclick = () => {
        const value = getValue(id);
        if (value === '') {
            toast(getEleById(id), 'pageId不能为空');
            return;
        }
        messager.method.closePageByPageId(value);
    };
    const id2 = 'closePageByPageName';
    getEleById(id2).onclick = () => {
        const value = getValue(id2);
        if (value === '') {
            toast(getEleById(id2), 'pageName不能为空');
            return;
        }
        messager.method.closePageByPageName(value);
    };
    const id3 = 'closeOtherPage';
    getEleById(id3).onclick = () => {
        messager.method.closeOtherPage();
    };
}

function commonInit () {
    const findDisplayEle = (el: HTMLElement) => {
        const pp = el.parentNode?.parentNode as HTMLElement;
        if (!pp) return document.createElement('div');
        return pp.querySelector('.display') as HTMLElement;
    };
    eachClass('copy-result', (el) => {
        el.onclick = () => {
            copy(findDisplayEle(el).innerText);
            toast(el, '复制成功');
        };
    });
    eachClass('clear-result', (el) => {
        el.onclick = () => {
            findDisplayEle(el).innerText = '';
            toast(el, '清除成功');
        };
    });
}

function getAllPagesInit () {
    const id = 'getAllPages';
    getEleById(id).onclick = () => {
        const display = getDisplayEle(id);
        display.innerText = JSON.stringify(messager.method.getAllPages());
    };
}

// utils
function toast (el: HTMLElement, text: string) {
    const result = el.parentNode?.querySelector('.tip');
    if (!result) return;
    const tip = result as HTMLElement & {__timer: number};

    clearTimeout(tip.__timer);
    tip.innerText = text;
    tip.__timer = window.setTimeout(() => {
        tip.innerText = '';
    }, 2000);
}
function getEleById<T extends HTMLElement = HTMLElement> (id: string) {
    return document.getElementById(id) as T;
}

function getValue (id: string) {
    return getEleById<HTMLInputElement>(`${id}Input`).value;
}
function getValue2 (id: string) {
    return getEleById<HTMLInputElement>(`${id}Input2`).value;
}

function getDisplayEle (id: string) {
    return getEleById(`${id}Display`);
}

function copy (str: string) {
    let input = document.getElementById('_copy_input_') as HTMLInputElement;
    if (!input) {
        input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute(
            'style',
            'height:10px;position:fixed;top:-100px;opacity:0;'
        );
        input.setAttribute('id', '_copy_input_');
        document.body.appendChild(input);
    }
    input.value = str;
    input.select();

    try {
        if (document.execCommand('Copy')) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        return false;
    }
};

function eachClass (className: string, callback: (el: HTMLElement)=>void) {
    const cols = document.querySelectorAll(`.${className}`);
    for (let i = 0; i < cols.length; i++) {
        callback(cols[i] as HTMLElement);
    }
}
function initHtml () {
    document.body.innerHTML = `
    <div class='block'>
        <div class='title'>
            🚀 优雅的跨窗口通信与全局页面管理解决方案 [cross-window-message]
            <a href="https://github.com/theajack/cross-window-message" class="link" target="_blank">Github</a>
            <a href="https://github.com/theajack/cross-window-message/blob/master/src/index.d.ts" class="link" target="_blank">声明文件</a>
        </div>
    </div>
    <div class='block'>
        <div class='title'>
            当前页面信息: <br>
            pageName: <span>
                <span id='pageName'></span> <span class='text-btn' id='pageNameCopy'>复制</span> <span class='tip'></span>
            </span> <br>
            pageId: <span>
                <span id='pageId'></span> <span class='text-btn' id='pageIdCopy'>复制</span> <span class='tip'></span>
            </span>
        </div>
        <div class='input-group'>
            <button id='openNewPage'>打开一个新页面</button>
        </div>
    </div>
    <div class='block'>
        <div class='title'>
            接收消息区域
            <a class='link' href="https://github.com/theajack/cross-window-message" target="_blank">文档</a>
        </div>
        <div class='code'>messager.onMessage((msg)=>{});</div>
        <div class='input-group'>
            <button class='copy-result'>复制</button>
            <button class='clear-result'>清除</button>
            <span class='tip'></span>
        </div>
        <div id='onMessageDisplay' class='display flat max-scroll'></div>
    </div>
    <div class='block'>
        <div class='title'>
            广播消息
            <a class='link' href="https://github.com/theajack/cross-window-message" target="_blank">文档</a>
        </div>
        <div class='code'>message.postMessage({});</div>
        <div class='input-group'>
            <input type="text" id='postMessageInput' placeholder="请输入要发送的消息">
            <button id='postMessage'>广播消息</button>
        </div>
    </div>
    <div class='block'>
        <div class='title'>
            向指定id的页面发送消息
            <a class='link' href="https://github.com/theajack/cross-window-message" target="_blank">文档</a>
        </div>
        <div class='code'>message.postMessageToTargetId('pageId', {});</div>
        <div class='input-group'>
            <input type="text" id='postMessageToTargetIdInput' placeholder="请输入目标页面id">
            <input type="text" id='postMessageToTargetIdInput2' placeholder="请输入要发送的消息">
            <button id='postMessageToTargetId'>发送消息</button>
            <span class='tip'></span>
        </div>
    </div>
    <div class='block'>
        <div class='title'>
            向指定name的页面发送消息
            <a class='link' href="https://github.com/theajack/cross-window-message" target="_blank">文档</a>
        </div>
        <div class='code'>message.postMessageToTargetName('pageId', {});</div>
        <div class='input-group'>
            <input type="text" id='postMessageToTargetNameInput' placeholder="请输入目标页面name">
            <input type="text" id='postMessageToTargetNameInput2' placeholder="请输入要发送的消息">
            <button id='postMessageToTargetName'>发送消息</button>
            <span class='tip'></span>
        </div>
    </div>
    <div class='block'>
        <div class='title'>
            关闭页面
            <a class='link' href="https://github.com/theajack/cross-window-message" target="_blank">文档</a>
        </div>
        <div class='code'>message.method.closePageByPageId('pageId');
message.method.closePageByPageName('pageName');
message.method.closeOtherPage();</div>
        <div class='input-group'>
            <input type="text" id='closePageByPageIdInput' placeholder="请输入目标页面id">
            <button id='closePageByPageId'>关闭指定id页面</button>
            <span class='tip'></span>
        </div>
        <div class='input-group'>
            <input type="text" id='closePageByPageNameInput' placeholder="请输入目标页面name">
            <button id='closePageByPageName'>关闭指定name页面</button>
        </div>
        <div class='input-group'>
            <button id='closeOtherPage'>关闭其他所有页面</button>
        </div>
    </div>
    <div class='block'>
        <div class='title'>
            获取所有页面
            <a class='link' href="https://github.com/theajack/cross-window-message" target="_blank">文档</a>
        </div>
        <div class='code'>messager.method.getAllPages();</div>
        <div class='input-group'>
            <button id='getAllPages'>获取所有页面信息</button>
            <span class='tip'></span>
        </div>
        <div class='input-group'>
            <button class='copy-result'>复制</button>
            <button class='clear-result'>清除</button>
            <span class='tip'></span>
        </div>
        <div id='getAllPagesDisplay' class='display flat max-scroll'></div>
    </div>
    <div class='block'>
        <div class='title'>
            其他api
            <a class='link' href="https://github.com/theajack/cross-window-message" target="_blank">文档</a>
        </div>
    </div>`;
}