# 个人博客管理平台 #

## 前言 ##
本人在无法忍受初学时自己做的博客后台管理的样子，一怒之下断断续续用了两个月的时间重新做了一个博客后台管理平台。在接触vue之后，本后台就运用到了（当练练手了）。在这里打个广告我的博客--[文博客](https://cwb763.com)。虽然前端博客页面还是不太尽如人意，毕竟是我一年前做的东西，有时间我在重做一下，有时间大家可以支持一下。

本管理平台使用Vue-Iview-Yii2.0,使用vue-cli3.0脚手架实现打包。可以体验一下（体验账号：admin 密码：admin）[线上地址](http://blog_admin.cwb763.com)

## 功能 ##
本博客后台管理平台实现账号多复用功能，根据账号显示你的平台的内容（这就是后端PHP做的工作啦）。还提供api文档，使你在后台管理系统创建的文章、分类等等的内容获取到。[API文档平台](http://api.cwb763.com)这个平台还是我个人书签，有兴趣的同学也可以看看。需要源码的可以联系我。下面说说项目的具体功能。

1、用户登录、注销

2、博客文章展示、创建、编辑、删除、隐藏显示。

3、博客文章类别的展示、创建、删除。

4、博客用户的展示、限制登录。

5、博客用户评论的隐藏功能。

6、以柱状图、曲线图按照日期/月份显示博客、博客管理平台的访问量。

7、数字形式显示博客访问量、博客用户数量、博客中阅读量前三的文章。

8、显示用户信息：用户名、APIToken（用于api接口请求内容）、上一次登录时间。

9、添加、限制平台管理员登录。

## 安装步骤 ##
```cmd
	git clone https://github.com/cwb2819259/vue-blog-manage.git // 把模板下载到本地
	cd vue-blog-manage    // 进入模板目录
	npm install         // 安装项目依赖，安装失败可用 cnpm
```

## 本地开发 ##
```cmd
	// 开启服务器，浏览器访问 http://localhost:8080
	npm run serve
```
## 构建生产 ##
```cmd
	// 执行构建命令，生成的dist文件夹放在服务器下即可访问
	npm run build
```

## 组件使用 ##
1、文本编辑器我使用的是这个[vue-ueditor-wrap](https://github.com/HaoChuan9421/vue-ueditor-wrap)

2、数据可视化--柱状图、曲线图使用的是[Echarts](https://www.echartsjs.com/index.html),其实还有很多，比如：Hcharts、Amcharts这一类的，喜欢研究的可以研究一下。

3、[Iview-UI](https://www.iviewui.com/)这个不用多做介绍了吧。

## 求打赏 ##
如果有什么问题可以加我的微信,喜欢我的话我会持续更新新的东西希望您start、follow、收藏。谢谢支持~

![微信号](https://github.com/cwb2819259/vue-blog-manage/master/pnd/weixin.png)

求送投食o(*￣︶￣*)o

![微信](https://github.com/cwb2819259/vue-blog-manage/master/pnd/wchart.jpg)
![支付宝](https://github.com/cwb2819259/vue-blog-manage/master/pnd/ali.jpg)

## 项目截图 ##
![Image text](https://github.com/cwb2819259/vue-blog-manage/master/pnd/item1.png)
![Image text](https://github.com/cwb2819259/vue-blog-manage/master/pnd/item2.png)
