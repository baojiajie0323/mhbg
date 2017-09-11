# 市看实战平台

## Environment

```
node >= 4
os >= win7
```

## Code Style

https://github.com/airbnb/javascript


## use

```
cnpm install
```
把 sheet.js 放到node_modules\excel-export里去。

## Develop

```
1.   npm run start        先启动热编译

2.   npm run dev-elec     再打开一个命令行窗口
                          使用electron调试
                          或者使用浏览器（推荐chrome 45版本以下）
                          打开http://127.0.0.1:8989调试
```

## Build

```
npm run build     编译文件到生产目录下
npm run elec      编译文件到生产目录下，并用electron打开

```

## 项目结构

```
  src 文件夹下为程序主要代码

  * entries 文件夹下为 程序入口
  * components 文件夹为 项目各组件实现

每个组件实现的js都有自己对应的less样式文件（除非改组件没有样式）

```
