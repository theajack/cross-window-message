# [cross-window-message](https://www.github.com/theajack/util)


<p>
    <a href="https://www.github.com/theajack/util/stargazers" target="_black">
        <img src="https://img.shields.io/github/stars/theajack/util?logo=github" alt="stars" />
    </a>
    <a href="https://www.github.com/theajack/util/network/members" target="_black">
        <img src="https://img.shields.io/github/forks/theajack/util?logo=github" alt="forks" />
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
    <a href="https://www.github.com/theajack/util/blob/master/LICENSE" target="_black">
        <img src="https://img.shields.io/github/license/theajack/util?color=%232DCE89&logo=github" alt="license" />
    </a>
    <a href="https://cdn.jsdelivr.net/gh/theajack/util/dist/cross-window-message.latest.min.js"><img src="https://img.shields.io/bundlephobia/minzip/cross-window-message.svg" alt="Size"></a>
    <a href="https://github.com/theajack/util/search?l=javascript"><img src="https://img.shields.io/github/languages/top/theajack/util.svg" alt="TopLang"></a>
    <a href="https://github.com/theajack/util/issues"><img src="https://img.shields.io/github/issues-closed/theajack/util.svg" alt="issue"></a>
    <a href="https://www.github.com/theajack/util"><img src="https://img.shields.io/librariesio/dependent-repos/npm/cross-window-message.svg" alt="Dependent"></a>
</p>

<h3>一些常用的工具方法</h3>

**[English](https://github.com/theajack/util/blob/master/README.md) | [Update Log](https://github.com/theajack/util/blob/master/helper/version.md) | [Feedback bug](https://github.com/theajack/util/issues/new) | [Gitee](https://gitee.com/theajack/util)**

---

### 0. 模块

1. byte
2. constant
3. cookie
4. datetime
5. dom
6. extend
7. gbk
8. is
9. lib
10. math
11. polyfill
12. storage
13. tool
14. event

### 1. 安装使用

#### 1.1 npm

```
npm i cross-window-message
```

完整引用

```js
import tcUtil from 'cross-window-message'; 
```

按需引入

```js
import tcMath from 'cross-window-message/math'; 
import {formatDate} from 'cross-window-message/datetime';
```

#### 1.2 cdn 引入

完整引用

```html
<script src="https://cdn.jsdelivr.net/npm/cross-window-message/cross-window-message.min.js"></script>
<script>
    console.log(tcUtil);
</script>
```

按需引入

```html
<script src="https://cdn.jsdelivr.net/npm/cross-window-message/math.js"></script>
<script>
    console.log(tcMath);
</script>
```

### 2. api

#### 2.1. byte

0. stringToBytes
1. stringToGbkBytes
2. bytesToString
3. bytesToNumber

#### 2.2. constant

0. TYPE
1. UINT_TYPE
2. VERSION
3. COMPARE_RESULT

#### 2.3. cookie

0. getCookie
1. setCookie
2. removeCookie

#### 2.4. datetime

0. getDaysInMonth
1. getFirstDayWeekInMonth
2. formatTime
3. formatDate
4. timeToJson
5. dateToJson
6. timeToDate
7. dateToTime
8. nowTime
9. nowDate
10. msToSecond
11. secondToMs
12. minuteToMs
13. hourToMs

#### 2.5. dom

0. $: 请参考 [easy-dom-util](https://github.com/theajack/easy-dom)
1. registDisableContextMenu
2. disableDefaultEvent
3. onPageShowHide

#### 2.6. extend

0. String
1. Array
2. Number
3. Function
4. Object
5. Json

#### 2.7. gbk

0. encodeGBK
1. decodeGBK

#### 2.8. is

0. isUndf
1. isFunc
2. isObject
3. isJson
4. isJsonOrArray
5. isNumber
6. isNull
7. isBool
8. isString
9. isType
10. isArray
11. isPC
12. isMobile
13. isIOS
14. isAndroid
15. isWX
16. isQQ
17. isTenVideo
18. isWxMiniProgram
19. isIOSWx
20. isIPAddress
21. isInited

#### 2.9. lib

0. creatEventReady
1. createDotAnimation
2. createState
3. createStatus

#### 2.10. math

0. countDistance
1. countDistanceByDiff
2. countSumOfSquare
3. countValueByRateAndRange
4. circleToRect
5. isPointInRect
6. isPointInCircle
7. countPosDiffByStep

#### 2.11. polyfill

0. keys
1. values
2. assign

#### 2.12. storage

0. getStorage
1. setStorage
2. removeStorage

#### 2.13. tool

**tcUtil._**

0. getUrlParam
1. parseUrlParam
2. copy
3. type
4. random
5. download
6. execute
7. importScript
8. readFile
9. mapArray
10. mapJson
11. parseJSON
12. pick
13. pickAttr
14. pickTo
15. removeRedundantAttrInObject
16. getUUID
17. boolPipe
18. throttle
19. countImgSize
20. compareVersion
21. versionToArray

#### 2.14. event

请参考 [cross-window-message](https://github.com/theajack/util)