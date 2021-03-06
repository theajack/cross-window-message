## version log

### 1.0.0

初始版本

优雅的跨窗口通信与全局页面管理解决方案

1. 支持不同页面之间的 定向通信 和 广播通信
2. 支持任意方式打开的页面，不局限于 window.open 方法
3. 支持多个由主页面打开的子页面之间通信
4. 支持标记和追踪各个页面的状态，方便进行全局页面管理
5. 支持关闭子页面等多种方法调用
6. 支持监听页面事件
7. 页面存活检查，保证页面状态同步
8. typescript开发，使用简单，体积小巧

### 1.0.1

1. 修改readme

### 1.0.2

1. 将参数改为object类型
2. 增加 data 参数，用于携带页面信息
3. 增加 useSessionStorage 参数，用于使用 sessionStorage 存储状态

### 1.0.3

1. 增加 onPageChange 事件，用于监听页面改变
2. 增加 method.updatePageData 方法，用于更新页面携带的数据
3. 增加当前页面存活检查，用于修复多个页面同时打开导致的bug
4. 修改 page.index 的计算方式

### 1.0.4

1. npm 包增加 main字段

### 1.0.5

1. 修正 updatePageData 方法名
2. 优化 webpack 构建流程

### 1.0.6

1. 使用 unload 事件代替之前的 beforeunload 事件，可以解决在取消关闭页面时页面已经被删除的问题
2. 增加 onBeforeUnload 事件
3. 使用 console.warn 代替 error