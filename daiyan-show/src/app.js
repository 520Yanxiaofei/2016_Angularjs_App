var appModule = angular.module("shopManagerApp", [
    // Libs
    "ionic",
    "ionicLazyLoad",
    "monospaced.qrcode",
    // models
    "App.Models",
    //widgets
    "App.Widgets",
    "App.Footer",
    "App.AppDownload",
    "App.Manage",
    "App.Show",
    "App.Mine",
    "App.Search",
    "App.Create",
    "App.Selected",
    "App.Commonweal",
    "App.Pay"

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
                // do something on success
                return config
            },
            response: function(response) {
                if (response.data.error == "2020101") { //未登录
                    //$cookies.remove('is_login', { path: '/' })
                    window.location.href = "http://m.cellmyth.cn/wechat/oauth/connect?callback=" + encodeURIComponent(window.location.href);
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
                console.log("asdasdsa")
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
        $urlRouterProvider.otherwise("/show");
        $stateProvider

        //show页面
        .state("show", {
            url: "/show",
            templateUrl: "show/show.html"
        })

        //更多 全部选秀show-all
        .state("show-all", {
            url: "/show-all",
            templateUrl: "show/all/all.html",
            cache: false
        })

        /*
         *发起选秀
         */
        .state("create", {
            url: "/create",
            templateUrl: "create/create.html"
        })

        // 搜索
        .state("search", {
            url: "/search",
            templateUrl: "search/search.html"
        })
        // 全局精选搜索
        .state("search.main", {
            url: "/main",
            templateUrl: "search/main/main.html"
        })
        // 分类活动/公益活动搜索
        .state("search.category", {
            url: "/category/:id",
            templateUrl: "search/category/category.html"
        })
        // 活动用户搜索
        .state("search.user", {
            url: "/user/:ids?type",
            templateUrl: "search/user/user.html",
            cache: false

        })

        //分类选秀-精选
        .state("selected", {
            url: "/selected",
            templateUrl: "selected/selected.html",
            cache: false
        })
        //选秀排行
        .state("selected.draft", {
            url: "/draft/:id?p&vp",
            templateUrl: "selected/draft/draft.html",
            cache: false
        })
        //选秀详情
        .state("selected.detail", {
            url: "/detail/:id?type",
            templateUrl: "selected/detail/detail.html",
            cache: false
        })
        //选秀个人参赛活动
        .state("selected.competition", {
            url: "/competition/:id?ids&type",
            templateUrl: "selected/competition/competition.html"
        })
        //加入选秀
        .state("selected.add", {
            url: "/add/?id",
            templateUrl: "selected/add/add.html"
        })

        //公益选秀-公益
        .state("commonweal", {
            url: "/commonweal",
            templateUrl: "commonweal/commonweal.html"
        })
        //公益选秀-活动详情
        .state("commonweal.detail", {
            url: "/detail/:id?type",
            templateUrl: "commonweal/detail/detail.html",
            cache: false
        })

        //公益排行
        .state("commonweal.draft", {
            url: "/draft/:id?p&vp",
            templateUrl: "commonweal/draft/draft.html",
            cache: false
        })
        //公益个人参赛活动
        .state("commonweal.competition", {
            url: "/competition/:id?ids&type",
            templateUrl: "commonweal/competition/competition.html"
        })
        //加入公益选秀
        .state("commonweal.add", {
            url: "/add",
            templateUrl: "commonweal/add/add.html"
        })
        //公益投票
        .state("commonweal.contribution", {
            url: "/contribution/:id?ids",
            templateUrl: "commonweal/contribution/contribution.html"
        })

        //管理选秀
        .state("manage", {
            url: "/manage",
            templateUrl: "manage/manage.html"
        })

        //管理选秀-首页
        .state("manage.home", {
            url: "/home/:id",
            templateUrl: "manage/home/home.html"
        })

        //管理选秀-选秀成员
        .state("manage.member", {
            url: "/member/:id",
            templateUrl: "manage/member/member.html"
        })

        //管理选秀-选秀身份
        .state("manage.identity", {
            url: "/identity",
            templateUrl: "manage/identity/identity.html"
        })

        //管理选秀-审核
        .state("manage.examine", {
            url: "/examine/:uid?:id?:type?:message?:title?:time?:name?:avatar?:status",
            templateUrl: "manage/examine/examine.html"
        })

        //管理选秀-消息
        .state("manage.message", {
            url: "/message/:id",
            templateUrl: "manage/message/message.html",
            cache: false
        })

        //我的选秀
        .state("mine", {
            url: "/mine",
            templateUrl: "mine/mine.html"
        })

        //我的选秀-我参加的/我管理的/申请记录/往期选秀
        .state("mine.show", {
            url: "/show",
            templateUrl: "mine/show/show.html",
            cache: false
        })

        // 支付
        .state("pay", {
            url: "/pay",
            templateUrl: "pay/pay.html",
            cache: false
        })

        // 支付 - 支付方式选择
        .state("pay.type", {
            url: "/type/:id",
            templateUrl: "pay/pay-type/pay-type.html",
            cache: false
        })

        // 支付 - 选择余额支付
        .state("pay.balance", {
            url: "/balance/:id",
            templateUrl: "pay/balance-pay/balance-pay.html",
            cache: false
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

//自动获取焦点
appModule.directive("getFocus", ["$timeout", function($timeout) {
    return {
        scope: { getFocus: "=" },
        link: function(scope, element) {
            scope.$watch("getFocus", function(value) {
                if (element[0].className.indexOf("focus") != -1) {
                    $timeout(function() {
                        element[0].focus();
                    });
                }
            });
        }
    }
}]);

appModule.service('PickService',[function(){
    var list={};
    function get(id){
        return list[id] || '';
    };
    function set(id,obj){
        list[id]=obj;
    };
    return {
        get:get,
        set:set
    };
}]);

// 图片尺寸处理
appModule.directive('onFinishRenderFilters', [
    "$timeout",
    function ($timeout) {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                    $timeout(function() {
                        // var h = element[0].clientWidth*350/750;
                        var h = $(element).find('.img-box').width()*350/750;
                        $(element).find('.img-box').height(h);
                        $(element).find('.img-box').find('img').height(h);

                        
                        // 首页banner图尺寸更改
                        if($(element).hasClass('face-banner-item-container')){
                            // debugger;
                            // 设置图片尺寸（比例：750/280）
                            var banner_h = $(element).width()*280/750;
                            $(element).find('img').height(banner_h);
                            $(element).parent().height(banner_h);

                            $(element).find('a').bind('click', function(event){
                                event.stopPropagation();
                                event.preventDefault();
                            })        

                            var start_position = 0,end_position = 0;    //touch前后水平位置
                            $(element).parent().bind('touchstart', function (event) {
                                event.stopPropagation();
                                event.preventDefault();
                                start_position = event.originalEvent.changedTouches[0].pageX;
                            })
                            // 解决touch与a问题
                            $(element).parent().bind('touchend', function (event) {
                                // console.log(start_position + ',' + end_position);
                                end_position = event.originalEvent.changedTouches[0].pageX;
                                if (start_position == end_position) {
                                    var ele_link = $($(element).find('a')[0]);
                                    ele_link.unbind('click').click(function(){
                                        if (ele_link.attr('href')) {
                                            location.href = ele_link.attr('href');
                                        }
                                    })
                                } 
                            })
                        }


                    });
                }
        }
}]);