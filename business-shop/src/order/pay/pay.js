angular.module("App.Order.Pay", []).controller("App.Order.Pay.Controller", [
    "$scope",
    "$state",
    "$ionicHistory",
    "Order",
    "Member",
    "$ionicPopup",
    "$http",
    "Loading",
    "Spokes",
    function ($scope,
              $state,
              $ionicHistory,
              Order,
              Member,
              $ionicPopup,
              $http,
              Loading,
              Spokes) {

        $scope.form = {
            pay_type: 1,//支付方式：1, 自付 2，代付
            pay_uid: "",
            pay_img: "http://img.520dyw.cn/default/avatar.jpg",
            pay_mum: "",
            pay_name: ""
        }

        $scope.changePayType = function (pay_type) {
            $scope.form.pay_type = pay_type
        }

        $scope.changePayPeople = function () {
            $scope.myform = {
                people_num: ""
            };

            var myPopup = $ionicPopup.show({
                template: '<input type="text" ng-model="myform.people_num">',
                title: '请输入代言号',
                scope: $scope,
                buttons: [{
                    text: '取消'
                }, {
                    text: '<b>确定</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        if (!$scope.myform.people_num) {
                            //don't allow the user to close unless he enters wifi password
                            $ionicPopup.alert({
                                title: '代言号不能为空',
                                okText: "确定"
                            });
                            e.preventDefault();
                        } else {
                            return $scope.myform.people_num;
                        }
                    }
                }]
            });

            myPopup.then(function (share_mum) {
                if (!share_mum) {
                    return
                }
                Member.getHelpUserInfo({
                    number: share_mum,
                }).$promise.then(function (res) {
                    $scope.form.pay_uid = res.uid
                    $scope.form.pay_img = res.avatar
                    $scope.form.pay_mum = share_mum
                    $scope.form.pay_name = res.realname
                }, function (error) {
                    $ionicPopup.alert({
                        title: error.data.message,
                        okText: "确定"
                    });
                });
            });
        }

        //申请代付
        $scope.payHelp = function () {
            Order.payHelp({
                order_id: $state.params.order_id,
                uid: $scope.form.pay_uid
            }).$promise.then(function (pay_detail) {
                $state.go("order.anotherPayInfo", {order_id: $state.params.order_id});
            }, function (error) {
                $ionicPopup.alert({
                    title: error.data.message,
                    okText: "确定"
                });
            })
        }

        var goods_type = "0"
        //确定取消按钮
        $scope.back = function () {
            $ionicHistory.goBack();
        };
        //获取订单号和金额
        Order.payInfo({order_id: $state.params.order_id}).$promise.then(function (pay_detail) {
            $scope.pay_detail = pay_detail;
            $scope.form.pay_uid = pay_detail.helpbuy.uid
            $scope.form.pay_img = pay_detail.helpbuy.avatar
            $scope.form.pay_mum = pay_detail.helpbuy.number
            $scope.form.pay_name = pay_detail.helpbuy.realname
        }, function (error) {
            console.log(error);
        })
        //获取余额
        Member.getMemberAmountInfo().$promise.then(function (money) {
            $scope.money = money;
        }, function (error) {
            console.log(error);
        })
        //订单详情
        Order.getDetail({order_id: $state.params.order_id}).$promise.then(function (response) {
            if (response.pay_status == 2) {
                $ionicPopup.alert({
                    title: '订单已支付',
                    okText: "确定"
                }).then(function () {
                    $state.go("user.info");
                })

            }

            if (response.helpbuyInfo) {
                if (response.helpbuyInfo.status == "0" || response.helpbuyInfo.status == "2") {
                    $state.go("order.anotherPayInfo", {order_id: $state.params.order_id});
                }
            }

            goods_type = response.goods[0].goods_type;
        }, function (response) {
            Loading.hide();
            console.log("error");
        });
        //余额支付
        $scope.balancePay = function (orderid) {
            $state.go('user.balance-pay', {order_id: $state.params.order_id});
        }
        //微信支付
        $scope.weixinPay = function () {
            var params = null;
            if (typeof WeixinJSBridge === "undefined") {
                $ionicPopup.alert({
                    title: "错误",
                    template: "请在微信中访问该页面"
                });
                return false;
            }
            ;
            Loading.show('请求支付');
            Order.getWechatOrderInfo({order_id: $state.params.order_id}).$promise.then(function (data) {
                params = data.parameters;
                if (!angular.isObject(params)) {
                    params = angular.fromJson(params);
                }
                ;
                Loading.hide();
                WeixinJSBridge.invoke(
                    'getBrandWCPayRequest',
                    params,
                    function (res) {
                        WeixinJSBridge.log(res.err_msg);
                        console.log(res.err_code, res.err_msg)
                        if (res.err_msg == "get_brand_wcpay_request:ok") {
                            $ionicPopup.alert({
                                title: '支付成功!',
                                okText: "确定"
                            }).then(function () {
                                Member.checkAptitude().$promise.then(function (check_aptitude) {
                                    $scope.check_aptitude = check_aptitude
                                    if (check_aptitude.code == "1" || check_aptitude.code == "2") {
                                        $state.go("user.buy-success", {
                                            goods_type: goods_type
                                        });
                                    } else {
                                        $state.go("user.info");
                                    }
                                }, function (error) {
                                    $scope.check_aptitude.code = 0
                                });
                            });
                        } else {
                            $ionicPopup.alert({
                                title: "错误",
                                template: "支付失败！"
                            });
                        }
                    }
                );

            }, function (response) {
                Loading.hide();
                $ionicPopup.alert({
                    title: "错误",
                    template: response.message || "服务器错误！"
                });
            });

        };

        //支付宝支付
        $scope.aliPay = function () {
            var return_url = ""
            if (goods_type == "0") {
                return_url = "http://mall.cellmyth.cn/#/user/info"
            } else {//资格类商品
                Member.checkAptitude().$promise.then(function (check_aptitude) {
                    $scope.check_aptitude = check_aptitude
                    if (check_aptitude.code == "1" || check_aptitude.code == "2") {
                        return_url = "http://mall.cellmyth.cn/#/user/buy-success/" + goods_type
                    } else {
                        return_url = "http://mall.cellmyth.cn/#/user/info"
                    }
                }, function (error) {
                    $scope.check_aptitude.code = 0
                });
            }
            Loading.show('请求支付');
            $http.post(config.API_ROOT + '/mall/order/alipay', {
                order_id: $state.params.order_id,
                show_url: "http://mall.cellmyth.cn/#/user/orderList",//临时地址
                return_url: return_url
            }).success(function (data) {
                var form;
                if (data.error) {
                    Loading.hide();
                    $ionicPopup.alert({
                        title: "错误",
                        template: data.message || "服务器错误！"
                    });
                    return false;
                }
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
            }).error(function (data) {
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