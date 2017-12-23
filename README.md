# raaay-blog

Personal blog system， but obsoleted.

曾经自己尝试做的个人博客系统，实现了很基本的功能，因为种种原因暂且先放弃使用。

因为代码中包含自己一些尝试，所以暂且留着repo。

## 技术组成

Node.js后端，MongoDB数据库，Koa框架，单独一个React写成的Admin App，URL设计的尽可能Restful，
后端根据HTTP请求的`Accept`字段，对浏览器(`text/html`)返回HTML页面，对Admin App(`application/json`)返回json。

出于方便备份转移的想法，使用MongoDB的GridFS功能存储图片。

## 其他

如果有以下的需求，这个repo可能有值得参考的地方：

- ES6语法 + MongoDB Native Driver
- Koa/Express文件上传，并使用MongoDB GridFS存储文件
- 使用jsonSchema在数据库层面做数据校验（MongoDB 3.6 or later）
- Koa/Express，同一个URL通过`Accept`字段区别请求，执行不同的业务逻辑（e.g. 同一个URL同时提供HTML和JSON）


