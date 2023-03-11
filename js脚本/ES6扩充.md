# 游戏开发ES6补充

## 暂时性死区

块内变量拥有更严谨的生命周期

```js
var pi = 0
if(true){
    console.log(pi)   // error!
    let pi = 1
}
```

## Symbol

新的内置数据类型，功能类似于UUID，使用：

```js
let s = Symbol()
```

我们也可以为Symbol增加一些描述，生成一个新的Symbol

```js
let s1 = Symbol("another symbol")
let s2 = Symbol("another symbol")
console.log(s2===s1)
--->false
```

## 解构赋值

### 基本语法

```js
let [a, b, c] = [0, 1, 2]
```

可嵌套，可忽略，可剩余(如下, a=1, b=[ 2, 3] )

```js
let [a, ...b] = [1, 2, 3]
```

可以设置默认值，如果找不到值会赋值为undefined

```js
let [a, b, c] = 'js'
// a='j' b='s' c=undefined
```

### 对象解构

```js
let {foo, bar} = {foo:{1:"test"}, bar:{1:"reload"}}
```

可以把foo, bar从后面的对象里解构出来，同样的支持：可嵌套，可忽略，可剩余(如下, a=1, b=[ 2, 3] )，可不完全解构

## 函数

### 函数写法

```js
function f1(){}
let f2 = function(){}
```

### 自执行函数

自执行函数就是声明完立即调用自己且只能使用一次

```js
( function (param){} )(param)
( function (param){}(param) )
```

### 箭头函数(语法糖)

```js
let f = (a, b) => {
    let result = a + b
    return result
}
f(1, 2)
```
