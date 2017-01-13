var appModule = angular.module("businessManagerApp", [
    "App.Header",
    // Libs
    "ui.router",
    "ui.bootstrap",
    "ngCookies",
    "ngFileUpload",
    "ngLocale",
    // Models
    "App.Models",

    // Utils
    // "App.Utils",

    //widgets
    "App.Widgets",

    // Components
    "App.Sidebar",
    "App.Home",
    // orders
    "App.Orders",
    "App.Goods",
    "App.financia.settlement",
    "Warehouse"
]);
// Http Interceptor Http配置
appModule.factory("httpInterceptor", [
    "$q",
    "$injector",
    "$cookies",
    function(
        $q,
        $injector,
        $cookies
    ) {
        return {
            request: function(config) {
                config.headers["X-Requested-With"] = "xmlhttprequest";
                // do something on success
                return config
            },
            response: function(response) {
                if (response.data.error == "2020101") { //未登录
                    $cookies.remove('is_login', { path: '/' })
                    window.location.href = "login.html";
                }
                return response
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

        // $locationProvider.html5Mode(true);
        $urlRouterProvider.otherwise("/home");
        $stateProvider
            //我的店铺
            .state("home", {
                url: "/home",
                templateUrl: "home/home.html"
            })
            //线下店管理
            .state("offline", {
                url: "/offline",
                templateUrl: "home/offline/offline.html"
            })
            //修改店铺信息
            .state("edit", {
                url: "/home/edit",
                templateUrl: "home/edit/edit.html"
            })
            //商品管理
            .state("goods", {
                url: "/goods",
                templateUrl: "goods/goods.html"
            })
            //新品发布
            .state("goods.add", {
                url: "/add",
                templateUrl: "goods/add/add.html"
            })
            //修改商品分类
            .state("goods.edit", {
                url: "/edit/:id",
                templateUrl: "goods/add/add.html"
            })
            //修改商品详情
            .state("goods.editDetial", {
                url: "/edit-detial/:id",
                templateUrl: "goods/publish/publish.html"
            })
            // 商品详情
            .state("goods.detail", {
                url: "/detail/:id",
                templateUrl: "goods/publish/detail/detail.html"
            })
            // 发布商品
            .state("goods.publish", {
                url: "/publish/:id",
                templateUrl: "goods/publish/publish.html"
            })
            //未发布商品
            .state("goods.unreleased", {
                url: "/unreleased",
                templateUrl: "goods/unreleased/unreleased.html"
            })
            //未上架新品
            .state("goods.unshelves", {
                url: "/unshelves",
                templateUrl: "goods/unshelves/unshelves.html"
            })
            //已上架新品
            .state("goods.shelves", {
                url: "/shelves",
                templateUrl: "goods/shelves/shelves.html"
            })
            //自定义商品分类
            .state("goods.classification", {
                url: "/classification",
                templateUrl: "goods/classification/classification.html"
            })
            // 自定义商品分类增加
            .state("goods.classification-add", {
                url: "/classification-add",
                templateUrl: "goods/classification-add/classification-add.html"
            })
            // 自定义商品分类修改
            .state("goods.classification-edit", {
                url: "/classification-edit/:id",
                templateUrl: "goods/classification-edit/classification-edit.html"
            })
            //订单管理
            .state("orders", {
                url: "/orders",
                templateUrl: "orders/orders.html"
            })
            //已完成订单
            .state("orders.completed", {
                url: "/completed",
                templateUrl: "orders/all/all.html"
            })
            //待发货订单
            .state("orders.undelivered", {
                url: "/undelivered",
                templateUrl: "orders/all/all.html"
            })
            //待签收订单
            .state("orders.unsigned", {
                url: "/unsigned",
                templateUrl: "orders/all/all.html"
            })
            //全部订单
            .state("orders.all", {
                url: "/all",
                templateUrl: "orders/all/all.html"
            })
            //订单详细/发货
            .state("orders.detail", {
                url: "/detail/:id",
                templateUrl: "orders/detail/detail.html"
            })
            //财务管理
            .state("financia", {
                url: "/financia",
                templateUrl: "financia/financia.html"
            })
            //销售结算
            .state("financia.settlement", {
                url: "/settlement",
                templateUrl: "financia/settlement/settlement.html"
            })
            //颜值分结算
            .state("financia.integral", {
                url: "/integral",
                templateUrl: "financia/settlement/settlement.html"
            })
            //代言币结算
            .state("financia.gold", {
                url: "/gold",
                templateUrl: "financia/settlement/settlement.html"
            })
            //售后管理
            .state("customer", {
                url: "/customer",
                templateUrl: "customer/customer.html"
            })
            //退货订单
            .state("customer.return", {
                url: "/return",
                templateUrl: "customer/return/return.html"
            })
            //仓储管理
            .state("warehouse", {
                url: "/warehouse",
                templateUrl: "warehouse/warehouse.html"
            })
            //补货管理
            .state("warehouse.replenish", {
                url: "/replenish",
                templateUrl: "warehouse/replenish/replenish.html"
            })
            //补货申请详情
            .state("warehouse.detail", {
                url: "/detail/:id",
                templateUrl: "warehouse/replenish/detail/detail.html"
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
        $httpProvider.interceptors.push("httpInterceptor")



    }
]);

//价格格式转换
appModule.directive('dyCurrency',function(){
    return {
        require: 'ngModel',
        link: function(elem, $scope, attrs, ngModel){
            ngModel.$formatters.push(function(val){
                return val/100;
            });
            ngModel.$parsers.push(function(val){
                return val*100;
            });
        }
    }
});
//价格格式转换
appModule.filter('dyCurrency',function(){
    return function(input){
        var result;
        result=input/100 || 0;
        return "￥"+result.toFixed(2);
    }
    
});
//价格格式转换
appModule.filter('dyStatus',function(){
    return function (input) {
        return (input == "1") ? "禁用" : "启用"
    }
    
});
