# [cross-window-message](https://www.github.com/theajack/util)

<p>
    <a href="https://www.github.com/theajack/util"><img src="https://img.shields.io/github/stars/theajack/util.svg?style=social" alt="star"></a>
    <a href="https://theajack.gitee.io"><img src="https://img.shields.io/badge/author-theajack-blue.svg?style=social" alt="Author"></a>
</p> 

<p>
    <a href="https://www.npmjs.com/package/cross-window-message"><img src="https://img.shields.io/npm/v/cross-window-message.svg" alt="Version"></a>
    <a href="https://npmcharts.com/compare/cross-window-message?minimal=true"><img src="https://img.shields.io/npm/dm/cross-window-message.svg" alt="Downloads"></a>
    <a href="https://cdn.jsdelivr.net/npm/cross-window-message/cross-window-message.min.js"><img src="https://img.shields.io/bundlephobia/minzip/cross-window-message.svg" alt="Size"></a>
    <a href="https://github.com/theajack/util/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/cross-window-message.svg" alt="License"></a>
    <a href="https://github.com/theajack/util/search?l=typescript"><img src="https://img.shields.io/github/languages/top/theajack/util.svg" alt="TopLang"></a>
    <a href="https://github.com/theajack/util/issues"><img src="https://img.shields.io/github/issues-closed/theajack/util.svg" alt="issue"></a>
</p>

<h3>Some commonly used tools and methods</h3>

**[中文](https://github.com/theajack/util/blob/master/README.cn.md) | [Update Log](https://github.com/theajack/util/blob/master/helper/version.md) | [Feedback bug](https://github.com/theajack/util/issues/new) | [Gitee](https://gitee.com/theajack/util)**

---

### 0. Module

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

### 1. Installation and use

#### 1.1 npm

```
npm i cross-window-message
```

Full reference

```js
import tcUtil from 'cross-window-message';
```

On-demand introduction

```js
import tcMath from 'cross-window-message/math';
import {formatDate} from'cross-window-message/datetime';
```

#### 1.2 cdn introduction

Full reference

```html
<script src="https://cdn.jsdelivr.net/npm/cross-window-message/cross-window-message.min.js"></script>
<script>
    console.log(tcUtil);
</script>
```

On-demand introduction

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

0. $: Please refer to [easy-dom-util](https://github.com/theajack/easy-dom)
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

Please refer to [cross-window-message](https://github.com/theajack/cross-window-message)