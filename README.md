#angular
一. 环境必要软件的安装(翻墙环境)
  1.node 安装官方网站 https://nodejs.org/en/
  2.Sourtree 的安装   https://www.sourcetreeapp.com/
  3.bower 安装 npm install -g bower  (mac前面加 sudo)
  4.gulp 安装  npm install -g gulp   (mac前面加 sudo)
  5.anywhere 静态服务器安装  npm install -g anywhere  (mac前面加 sudo)

二. 项目的启动
  1.进入项目目录  bower install
  2.进入项目目录  npm install
  3.gulp watch
  4.anywhere -h seller.cellmyth.cn -p 80  (80端口不能被其他程序占用)


三、虚拟Hostadmin (Chrome 插件Hostadmin) 配置
#==== 隐藏
127.0.0.1           local                 #hide
127.0.0.1           localhost             #hide
127.0.0.1			seller.cellmyth.cn  
#====


#编码规范
1.变量的命名  正确：shop_list  错误 shopList
2.方法的命名  正确：loadMorese() 错误 load_morese()
3.class的命名 正确：has-header 错误 hasHeader has_header 等
4.html js 文件用双引号
5.a标签 不要用 src  用ng-src="{{good.image}}"
6.文件，文件夹的命名  正确：order-list(order-list.html)   错误：orderList(错误：orderList.html)


#环境参考(切换环节  模拟登陆  账号密码)
1.代言秀环境
网络	daiyanwang-develop

2.代颜街环境
网络	daiyanwang-test

3.代颜街后台登录
