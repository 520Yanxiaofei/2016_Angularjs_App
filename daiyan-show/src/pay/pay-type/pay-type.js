angular.module("App.PayType", []).controller("App.PayType.Controller", [
    "$scope",
    "$state",
    "$ionicPopup",
    "Launch",
    "Loading",
    function($scope, $state, $ionicPopup, Launch, Loading) {

        // 订单号
        $scope.order_id = $state.params.id;

        //余额支付
        $scope.balancePay = function(orderid) {
            $state.go('pay.balance', { id: $state.params.id });
        }
        var params = null;
        Loading.show('请求支付');
        // 获取支付参数
        Launch.getApplyParams({ apply_id: $state.params.id }).$promise.then(function(response) {
            Loading.hide();
            $scope.payParams = response;
            params = response.parameters;
        }, function(response) {
            Loading.hide();
            $ionicPopup.alert({
                title: "错误",
                template: response.data.message
            });
        });

        //微信支付
        $scope.weixinPay = function() {
            if (typeof WeixinJSBridge === "undefined") {
                $ionicPopup.alert({
                    title: "错误",
                    template: "请在微信中访问该页面"
                });
                return false;
            };
            
            if (!angular.isObject(params)){
                params=angular.fromJson(params);
            }

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
                            $state.go('show');
                        });
                    } else {
                        $ionicPopup.alert({
                            title: "错误",
                            template: "支付失败！"
                        });
                    }
                }
            );
        };
    }
]);
