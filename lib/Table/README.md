### Table插件

. 继承el-table插件
. 可以通过标准的data自动实现加载 查询数据
. 可以指定数据进行查询
. 可以指定状态刷选
. 自动解析返回数据并且进行分页处理
. 如果不符合您的业务 可以切回 el-table

### 参数

ueb-table 参数

|参数名称|参数类型|是否必须|默认值|备注|
|---|---|---|---|---
|source|Object|否|null|数据源
|paging|Boolean|否|true|是否分页
|search|Object|否|null|查询条件


<a href="http://element.eleme.io/#/zh-CN/component/table" target="_blank" title="el-table 使用文档">el-table 使用文档</a>


### 使用

```
<ueb-table :source="xxx" :paging="true" :search="search">
    ......
</ueb-table>

```

### 注意事项
该Table继承于el-table 只是对一些业务功能进行了封装处理如有更改