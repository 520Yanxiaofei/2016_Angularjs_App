angular.module("App.Commonweal.Contribution", []).controller("App.Commonweal.Contribution.Controller", [
    "$scope",
    "$state",
    "Overview",
    "User",
    "$ionicPopup",
    "Loading",
    "Vote",
    function(
        $scope,
        $state,
        Overview,
        User,
        $ionicPopup,
        Loading,
        Vote
    ) {
        //表单
        $scope.moneyData = {
            "nid": $state.params.id,
            "show_id": $state.params.ids,
            "money": 1,
            "vote": 9,
            "pay_type": 3
        }

        //被投票人
        console.log($state.params.id)
        Overview.getcomUser({
            sid: $state.params.id, //用户ID
            showId: $state.params.ids //活动ID
        }).$promise.then(function(data) {
            $scope.userData = data;
        }, function(error) {
            console.log(error)
        })

        //当前投票人
        User.getUser().$promise.then(function(user) {
            $scope.logins = user;
        }, function(error) {
            console.log(error)
        })

        //选择金额
        $scope.moneyList = [{
            m: 1,
            isActive: true
        }, {
            m: 5,
            isActive: false
        }, {
            m: 10,
            isActive: false
        }, {
            m: 20,
            isActive: false
        }, {
            m: 50,
            isActive: false
        }, {
            m: 100,
            isActive: false
        }];
        $scope.moneyise = false;
        $scope.voteMoney = function(money, mvs) {
                for (var i = 0; i < $scope.moneyList.length; i++) {
                    $scope.moneyList[i].isActive = false;
                };
                money.isActive = true;
                $scope.moneyData.money = mvs;
                $scope.moneyData.vote = mvs + 8;
                $scope.moneyise = false;
                submit = true;
            }
        $scope.moneyText = function() {
            $scope.moneyData.vote = 8;
            $scope.moneyData.money = 0;
            $scope.moneyise = true;
        }
        $scope.datasd = {
            moneyValue: ''
        };

        $scope.numberText = function() {
                if ($scope.datasd.moneyValue > 2000) {
                    $scope.datasd.moneyValue = 2000;
                }
        }

        //微信支付
        var submit = true;
        $scope.weixinPay = function() {
            //自定义金额验证
            if ($scope.moneyise) {
                if (!$scope.datasd.moneyValue) {
                    $ionicPopup.alert({
                        title: '温馨提示',
                        template: '<div style="text-align:center">请输入要填写的金额！</div>',
                    });
                    submit = false;
                } else {
                    $scope.moneyData.vote = $scope.datasd.moneyValue + 8;
                    $scope.moneyData.money = $scope.datasd.moneyValue;
                    $scope.moneyise = false;
                    submit = true;
                };
            }
            if (submit){
                //console.log($scope.moneyData);//表单数据
                var params = null;
                if (typeof WeixinJSBridge === "undefined") {
                    $ionicPopup.alert({
                        title: "错误",
                        template: "请在微信中访问该页面"
                    });
                    return false;
                };
                Loading.show('请求支付');
                Vote.getcharitable($scope.moneyData).$promise.then(function(data) {
                    params = data.parameters;

                    if (!angular.isObject(params)){
                        params=angular.fromJson(params);
                    }
                    Loading.hide();
                    WeixinJSBridge.invoke(
                        'getBrandWCPayRequest',
                        params,
                        function(res) {
                            WeixinJSBridge.log(res.err_msg);
                            console.log(res.err_code, res.err_msg)
                            if (res.err_msg == "get_brand_wcpay_request:ok") {
                                $ionicPopup.confirm({
                                    title: '投票成功！',
                                    cancelText:'继续投票',
                                    cancelType: 'button-positive',
                                    okText: '前往摇奖',
                                    okType: 'button-positive'
                                }).then(function(e){
                                    if (e) {
                                        window.location.href = 'http://m.cellmyth.cn/wechat/ernie/shake/';
                                    }
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
            }

        };


    }
]);
