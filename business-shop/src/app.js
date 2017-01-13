var appModule = angular.module("shopManagerApp", [
    // Libs
    "ionic",
    "ionicLazyLoad",
    // models
    "App.Models",
    //widgets
    "App.Widgets",

    "App.Home",
    "App.Seniority",
    "App.User",
    "App.Goods",
    "App.Shop",
    "App.Back",
    "App.Order",
    "App.Footer"

]);
// Http Interceptor Http配置
appModule.factory("httpInterceptor", [
    "$q",
    "$injector",
    function(
        $q,
        $injector
    ) {
        return {
            request: function(config) {
                config.headers["X-Requested-With"] = "xmlhttprequest";
                if(window.DYW_AUTHENTICATION){
                    config.headers["X-Dyw-Authentication"] = window.DYW_AUTHENTICATION;
                }
                // do something on success
                return config;
            },
            response: function(response) {
                if (response.data.error == "2020101" || response.data.error == "2020102") { //未登录
                    function isWechat() {
                        var ua = navigator.userAgent.toLowerCase();
                        if (ua.match(/MicroMessenger/i) == "micromessenger") {
                            return true;
                        } else {
                            return false;
                        }
                    };
                    function isIos(){
                        if(/iPhone|mac|iPod|iPad/i.test(navigator.userAgent)){
                            return true;
                        }else{
                            return false;
                        }
                    };
                    var isw = isWechat();
                    if (isw) {
                        window.location.href = "http://m.cellmyth.cn/wechat/oauth/connect?callback=" + encodeURIComponent(window.location.href);
                    } else {
                        if (isIos()){
                            window.location.href = 'dyw://login?location=' + encodeURI(window.location.href);
                        }else{
                            window.location.href = "dyw://login";
                        }

                    }
                }
                if (angular.isObject(response.data)) { //
                    if (response.data.error) {
                        if (response.data.error == "0") {
                            return response.data;
                        } else {
                            return $q.reject(response)
                        }
                    } else {
                        return response;
                    }
                } else {
                    return response;
                }

            },
            responseError: function(rejection) {
                //Handle Request error
                if (rejection.status === 403) {

                    window.location.href = "";
                }
                return $q.reject(rejection)
            }
        }
    }
]);


//路由配置
appModule.config([
    "$stateProvider",
    "$urlRouterProvider",
    "$httpProvider",
    "$locationProvider",
    function(
        $stateProvider,
        $urlRouterProvider,
        $httpProvider,
        $locationProvider
    ) {

        //$locationProvider.html5Mode(true);
        $urlRouterProvider.otherwise("/home");
        $stateProvider

        //home页面
            .state("home", {
            url: "/home",
            templateUrl: "home/home.html"
        })

        //资格类商品页面
            .state("seniority", {
            url: "/seniority",
            templateUrl: "seniority/seniority.html"
        })   

        //用户中心
        .state("user", {
                url: "/user",
                templateUrl: "user/user.html"
            })
            // 用户信息
            .state("user.info", {
                url: "/info",
                templateUrl: "user/user-info/user-info.html",
                cache: false
            })

            // 收货地址
            .state("user.address", {
                url: "/address",
                templateUrl: "user/address/address.html",
                cache: false
            })
            
            // 添加/编辑收货地址
            .state("user.address-edit", {
                url: "/address-edit/:id",
                templateUrl: "user/address-edit/address-edit.html",
                cache: false
            })
            // 入驻信息审核
            .state("user.information-check", {
                url: "/information-check",
                templateUrl: "user/information-check/information-check.html",
                cache: false
            })
            // 填写入驻信息
            .state("user.merchant-information", {
                url: "/merchant-information/:type",
                templateUrl: "user/merchant-information/merchant-information.html",
                cache: false
            })
            // 商家入驻信息
            .state("user.join-infor", {
                url: "/join-infor",
                templateUrl: "user/join-infor/join-infor.html",
                cache: false
            })
            // 选择支付方式
            .state("user.join-pay", {
                url: "/join-pay",
                templateUrl: "user/join-pay/join-pay.html",
                cache: false
            })
            // 入驻信息审核
            .state("user.merchant-notes", {
                url: "/merchant-notes",
                templateUrl: "user/merchant-notes/merchant-notes.html"
            })
            // 订单详情
            .state("user.order-detail", {
                url: "/order-detail/:id",
                templateUrl: "user/order-detail/order-detail.html"
            })
            // 我的收藏
            .state("user.mycollection", {
                url: "/mycollection",
                templateUrl: "user/mycollection/mycollection.html"
            })
            // 我的代言资格
            .state("user.myseniority", {
                url: "/myseniority",
                templateUrl: "user/myseniority/myseniority.html"
            })
            // 我的代言人资格商品
            .state("user.myseniorityGoods", {
                url: "/myseniorityGoods",
                templateUrl: "user/myseniorityGoods/myseniorityGoods.html"
            })
            // 我的代言商资格商品
            .state("user.myseniorityBusiGoods", {
                url: "/myseniorityBusiGoods",
                templateUrl: "user/myseniorityBusiGoods/myseniorityBusiGoods.html"
            })
            // 我的代言大赛资格
            .state("user.myseniorityMegagame", {
                url: "/myseniorityMegagame",
                templateUrl: "user/myseniorityMegagame/myseniorityMegagame.html"
            })
            // 资格类商品购买成功
            .state("user.buy-success", {
                url: "/buy-success/:goods_type",
                templateUrl: "user/buy-success/buy-success.html"
            })
            // 我的代言资料
            .state("user.mydata", {
                url: "/mydata",
                templateUrl: "user/mydata/mydata.html"
            })
            // 订单列表
            .state("user.orderList", {
                url: "/orderList/:status",
                templateUrl: "user/orderList/orderList.html",
                cache: false
            })
            // 自提订单列表
            .state("user.orderPick", {
                url: "/orderPick",
                templateUrl: "user/order-pick/order-pick.html",
                cache: false
            })
            // 自提订单列表
            .state("user.orderPickDetail", {
                url: "/orderPickDetail/:id/:shop_id",
                templateUrl: "user/order-pick/detail/detail.html",
                cache: false
            })
            // 补货订单列表
            .state("user.orderReplenish", {
                url: "/orderReplenish",
                templateUrl: "user/order-replenish/order-replenish.html",
                cache: false
            })
            // 自提订单列表
            .state("user.orderReplenishDetail", {
                url: "/orderReplenishDetail/:id/:shop_id",
                templateUrl: "user/order-replenish/detail/detail.html",
                cache: false
            })
            // 待付款订单列表
            .state("user.orderList.unpaid", {
                url: "/unpaid",
                templateUrl: "user/orderList/orderList.html"
            })
            // 代收货订单列表
            .state("user.orderList.unsined", {
                url: "/unsined",
                templateUrl: "user/orderList/orderList.html"
            })
            // 已完成订单列表
            .state("user.orderList.done", {
                url: "/done",
                templateUrl: "user/orderList/orderList.html"
            })
            // 代付订单列表
            .state("user.anotherPay", {
                url: "/anotherPay",
                templateUrl: "user/another-pay/another-pay.html"
            })
            // 余额支付密码输入页面
            .state("user.balance-pay", {
                url: "/balance-pay/:order_id?store_id",
                templateUrl: "user/balance-pay/balance-pay.html",
                cache: false
            })
            // 代付余额支付密码输入页面
            .state("user.another-balance-pay", {
                url: "/another-balance-pay/:order_id",
                templateUrl: "user/another-balance-pay/another-balance-pay.html",
                cache: false
            })


        // 商品
        .state("goods", {
                url: "/goods",
                templateUrl: "goods/goods.html"
            })
            //商品详情
            .state("goods.detail", {
                url: "/detail/:id?is_show?share_id ",
                templateUrl: "goods/detail/detail.html",
                cache: false
            })
            // 商品搜索
            .state("goods.search", {
                url: "/search",
                templateUrl: "goods/search/search.html"
            })
            //全部商家
            .state("goods.seller", {
                url: "/seller",
                templateUrl: "goods/seller/seller.html"
            })
            //兑换专区
            .state("goods.change", {
                url: "/change/:type_status?search_type?key",
                templateUrl: "goods/change/change.html",
                cache: false
            })
            //商品奖金规则
            .state("goods.reward", {
                url: "/reward/:id?goods_id?shop_id",
                templateUrl: "goods/reward/index.html",
                cache: false
            })
            //商品搜索结果
            .state("goods.search-goods", {
                url: "/search-goods/:key?category_id",
                templateUrl: "goods/search-goods/search-goods.html"
            })
            //搜索结果
            .state("goods.search-result", {
                url: "/search-result/:key",
                templateUrl: "goods/search-result/search-result.html"
            })

        // 订单
        .state("order", {
                url: "/order",
                templateUrl: "order/order.html"
            })
            // 订单地点
            .state("order.order-address", {
                url: "/order-address",
                templateUrl: "order/order-address/order-address.html"
            })
            // 订单预约点
            .state("order.order-appointment", {
                url: "/order-appointment/?shop_id&goods_id",
                templateUrl: "order/order-appointment/order-appointment.html"
            })
            // 填写订单
            .state("order.order-fill", {
                url: "/order-fill/:id?quantity",
                templateUrl: "order/order-fill/order-fill.html",
                cache: false
            })
            // 支付页面
            .state("order.pay", {
                url: "/pay/:order_id",
                templateUrl: "order/pay/pay.html",
                cache: false
            })
            // 代付支付页面
            .state("order.anotherPay", {
                url: "/anotherPay/:order_id",
                templateUrl: "order/another-pay/another-pay.html"
            })
            // 代付信息页面
            .state("order.anotherPayInfo", {
                url: "/anotherPayInfo/:order_id",
                templateUrl: "order/another-pay-info/another-pay-info.html"
            })


        // 店铺
        .state("shop", {
                url: "/shop",
                templateUrl: "shop/shop.html"
            })
            // 商家店铺首页
            .state("shop.seller-home", {
                url: "/seller-home/:id",
                templateUrl: "shop/seller-home/seller-home.html",
                cache: false
            })
            // 店铺相册
            .state("shop.album", {
                url: "/album/:id",
                templateUrl: "shop/album/album.html"
            })
            // 店铺相册
            .state("shop.share", {
                url: "/share",
                templateUrl: "shop/share/share.html"
            })

        // 退款
        .state("back", {
                url: "/back",
                templateUrl: "back/back.html"
            })
            // 退款进度提示
            .state("back.back-tip", {
                url: "/back-tip",
                templateUrl: "back/back-tip/back-tip.html"
            })
            // 退款
            .state("back.return-progress", {
                url: "/return-progress",
                templateUrl: "back/return-progress/return-progress.html"
            })
            // 申请售后
            .state("back.application-services", {
                url: "/application-services",
                templateUrl: "back/application-services/application-services.html"
            })
            // 待退货订单
            .state("back.orderReturned", {
                url: "/orderReturned",
                templateUrl: "back/orderReturned/orderReturned.html"
            })


        $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
        $httpProvider.defaults.transformRequest.unshift(function(data, headersGetter) {
            var key, result = [],
                response;
            if (typeof data == "string") { //$http support
                response = data;
            } else {
                for (key in data) {
                    if (data.hasOwnProperty(key)) {
                        result.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
                    }
                }
                response = result.join("&");
            }
            return response;
        });

        $httpProvider.defaults.useXDomain = true;
        $httpProvider.defaults.withCredentials = true;
        $httpProvider.interceptors.unshift("httpInterceptor");
    }
]);

//价格格式转换
appModule.directive('dyCurrency', function() {
    return {
        require: 'ngModel',
        link: function(elem, $scope, attrs, ngModel) {
            ngModel.$formatters.push(function(val) {
                return val / 100;
            });
            ngModel.$parsers.push(function(val) {
                return val * 100;
            });
        }
    }
});
//价格格式转换
appModule.filter('dyCurrency', function() {
    return function(input) {
        var result;
        result = input / 100 || 0;
        return "￥" + (result ? result.toFixed(2) : '0');
    }

});

appModule.factory("setData", function(){
    var saveData = {};
    function setData(data){
        saveData = data;
    }
    function getData(){
        return saveData;
    }
    return {
        setData: setData,
        getData: getData
    }
});

//地图定位
appModule.factory('dyLocation', ['$q', function($q) {
    var url,
        type,
        charset,
        loaded,
        position,
        script_deferred;

    url = 'http://webapi.amap.com/maps?v=1.3&key=6791fcfe2ebc625db08025c5001accbd&callback=initAmapDy';
    type = 'text/javascript';
    charset = "utf-8";
    loaded = false;

    function getLocation() {
        var map, geolocation, deferred, promise;
        deferred = $q.defer();
        promise = deferred.promise;
        //加载地图，调用浏览器定位服务
        map = new AMap.Map('container', {
            resizeEnable: true
        });
        map.plugin('AMap.Geolocation', function() {
            geolocation = new AMap.Geolocation({
                enableHighAccuracy: true, //是否使用高精度定位，默认:true
                timeout: 10000, //超过10秒后停止定位，默认：无穷大
                buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                buttonPosition: 'RB'
            });
            map.addControl(geolocation);
            geolocation.getCurrentPosition();
            AMap.event.addListener(geolocation, 'complete', onComplete); //返回定位信息
            AMap.event.addListener(geolocation, 'error', onError); //返回定位出错信息
        });
        //解析定位结果
        function onComplete(data) {
            var result = [data.position.getLng(), data.position.getLat()];
            deferred.resolve(result);
            return result;
        }
        //解析定位错误信息
        function onError(data) {
            deferred.reject('定位失败');
        }
        return promise;
    };

    function loadScript() {
        var heads,
            head,
            srcipt;
        var deferred,
            promise;

        deferred = $q.defer();
        promise = deferred.promise;

        //script = document.querySelector("script[src*='"+url+"']");
        if (!loaded) {
            heads = document.getElementsByTagName("head");
            if (heads && heads.length) {
                head = heads[0];
                if (head) {
                    script = document.createElement('script');
                    script.setAttribute('src', url);
                    script.setAttribute('type', type);
                    script.setAttribute('charset', charset);
                    script.onload = script.onreadystatechange = function() {
                        if (!loaded && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
                            loaded = true;
                        }
                    };
                    head.appendChild(script);
                } else {
                    deferred.reject('head not found');
                }
            } else {
                deferred.reject('heads not found');
            }
        } else {
            //deferred.resolve();
        }
        return deferred;
    };

    function init() {
        script_deferred = loadScript();
    };

    init();

    //地图加载回调
    window.initAmapDy = function() {
        script_deferred.resolve();
    };

    function get() {
        var deferred, location;
        deferred = $q.defer();
        if (position) {
            deferred.resolve(position);
        } else {
            script_deferred.promise.then(function() {
                location = getLocation();
                location.then(function(data) {
                    position = data;
                    deferred.resolve(data);
                }, function(error) {
                    deferred.reject(error);
                });
            }, function(error) {
                deferred.reject(error);
            });
        }

        return deferred.promise;
    };

    return {
        get: get
    };

}]);

appModule.run(['$rootScope', function($scope){
    $scope.$on('$stateChangeStart', function(evt, toState, roParams, fromState, fromParams) {
        switch(toState.name){
            case 'home':
            case 'goods.seller':
            case 'goods.search-goods':
            case 'user.info':
                loadURL('dyw://back?show=0');
                break;
            default:
                loadURL('dyw://back?show=1');
        }

        function loadURL(url) {
            var iFrame;
            iFrame = document.createElement("iframe");
            iFrame.setAttribute("src", url);
            iFrame.setAttribute("style", "display:none;");
            iFrame.setAttribute("height", "0px");
            iFrame.setAttribute("width", "0px");
            iFrame.setAttribute("frameborder", "0");
            document.body.appendChild(iFrame);
            // 发起请求后这个 iFrame 就没用了，所以把它从 dom 上移除掉
            iFrame.parentNode.removeChild(iFrame);
            iFrame = null;
        }
    });
}]);

// 图片尺寸调整
appModule.directive('onFinishRenderFilters', [
    "$timeout",
    function ($timeout) {
        return {
            restrict: 'A',
            scope:{
                size: '@'
            },
            link: function(scope, element, attr) {
                    $timeout(function() {
                        if(element.hasClass('adjust-size')){
                            var size_rule = scope.size.split('*');
                            var h = element[0].offsetWidth*size_rule[1]/size_rule[0];
                            console.log(size_rule + "," + h);
                            element.css({
                                height: h + 'px'
                            })
                        }
                    });
                }
        }
}]);