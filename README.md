# flv2fmp4
博客的mp4软编码系列文章的demo

精简版的flv转fmp4工程,没有任何mse,io方面操作,只有flv转fmp4,可以当做核心解码使用,自己实现io,mse操作
http://blog.csdn.net/g332065255/article/details/71158863
```

npm install 

node debug.js

浏览器访问  127.0.0.1:8080即可

现在扔进去一个flv就可以直接播放了

支持拖拽啦,代码在seekDemo.html里面,拖拽想实现的话,稍微有些复杂

如果想把本工程嵌入到自己的项目中

import f2m from './js/flv2fmp4.js'

let kernel=new f2m({})

kernel.setflv(这里放flv数据);
剩下的看代码的注释吧 

```