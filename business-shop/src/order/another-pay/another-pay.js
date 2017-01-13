angular.module("App.Order.Anotherpay", []).controller("App.Order.Anotherpay.Controller", [
    "$scope",
    "$state",
    "$ionicHistory",
    "Order",
    "Member",
    "$ionicPopup",
    "$http",
    "Loading",
    "Spokes",
    "Helpbuy",
    function(
        $scope,
        $state,
        $ionicHistory,
        Order,
        Member,
        $ionicPopup,
        $http,
        Loading,
        Spokes,
        Helpbuy
    ) {


        //确定取消按钮
        $scope.back = function() {
            $ionicHistory.goBack();
        };
        //获取订单号和金额
        Helpbuy.getHelpInfo({
                id: $state.params.order_id
            }).$promise.then(function(helpInfo) {
                $scope.helpInfo = helpInfo
            }, function(error) {
                console.log(error);
            })
            //获取余额
        Member.getMemberAmountInfo().$promise.then(function(money) {
            $scope.money = money;
        }, function(error) {
            console.log(error);
        })

        //余额支付
        $scope.balancePay = function(orderid) {
                $state.go('user.another-balance-pay', {
                    order_id: $state.params.order_id
                });
            }
            //微信支付
        $scope.weixinPay = function() {
            var params = null;
            if (typeof WeixinJSBridge === "undefined") {
                $ionicPopup.alert({
                    title: "错误",
                    template: "请在微信中访问该页面"
                });
                return false;
            };
            Loading.show('请求支付');
            Helpbuy.payWeixin({
                order_id: $state.params.order_id
            }).$promise.then(function(data) {
                params = data.parameters;
                if (!angular.isObject(params)) {
                    params = angular.fromJson(params);
                };
                Loading.hide();
                WeixinJSBridge.invoke(
                    'getBrandWCPayRequest',
                    params,
                    function(res) {
                        WeixinJSBridge.log(res.err_msg);
                        console.log(res.err_code, res.err_msg)
                        if (res.err_msg == "get_brand_wcpay_request:ok") {
                            $ionicPopup.alert({
                                title: '支付成功!',
                                okText: "确定"
                            }).then(function() {
                                $state.go("user.anotherPay");
                            });
                        } else {
                            $ionicPopup.alert({
                                title: "错误",
                                template: "支付失败！"
                            });
                        }
                    }
                );

            }, function(response) {
                Loading.hide();
                $ionicPopup.alert({
                    title: "错误",
                    template: response.message || "服务器错误！"
                });
            });

        };

        //支付宝支付
        $scope.aliPay = function() {
            var return_url = "http://mall.cellmyth.cn/#/user/anotherPay"
            Loading.show('请求支付');
            $http.post(config.API_ROOT + '/mall/Helpbuy/alipay', {
                order_id: $state.params.order_id,
                show_url: return_url, //临时地址
                return_url: return_url
            }).success(function(data) {
                var form;
                if (data.error) {
                    Loading.hide();
                    $ionicPopup.alert({
                        title: "错误",
                        template: data.message || "服务器错误！"
                    });
                    return false;
                };
                form = angular.element(data)[0];
                if (form.submit) {
                    form.submit();
                } else {
                    Loading.hide();
                    $ionicPopup.alert({
                        title: "错误",
                        template: data.message || "服务器错误！"
                    });
                }
            }).error(function(data) {
                Loading.hide();
                $ionicPopup.alert({
                    title: "错误",
                    template: data.message || "服务器错误！"
                });
            })



        };

        //判断是否在微信环境
        function isWechat() {
            var ua = navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
                return true;
            } else {
                return false;
            }
        };
        $scope.isWechat = isWechat;
    }
]);