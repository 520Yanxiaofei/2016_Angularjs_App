angular.module("App.Pay.BalancePay", []).controller("App.Pay.BalancePay.Controller", [
    "$scope",
    "$state",
    "$ionicHistory",
    "Loading",
    "$ionicPopup",
    "Loading",
    "Launch",
    function(
        $scope,
        $state,
        $ionicHistory,
        Loading,
        $ionicPopup,
        Loading,
        Launch
    ) {
        var payParams = {
            order_id: $state.params.id,
            password: '',
            pay_type: 1
        }

        $scope.num1 = '';
        $scope.nums = {
            num1: '',
            num2: '',
            num3: '',
            num4: '',
            num5: '',
            num6: ''
        };
        var index = 0;

        $scope.keydown = function(number) {
            if (index < 6 && number != 'back') {
                index++;
            }
            if (index == 1) {
                $scope.nums.num1 = number;
            }
            if (index == 2) {
                $scope.nums.num2 = number;
            }
            if (index == 3) {
                $scope.nums.num3 = number;
            }
            if (index == 4) {
                $scope.nums.num4 = number;
            }
            if (index == 5) {
                $scope.nums.num5 = number;
            }
            if (index == 6) {
                Loading.show();
                $scope.nums.num6 = number;
                var pwd = $scope.nums.num1 + '' + $scope.nums.num2 + $scope.nums.num3 + $scope.nums.num4 + $scope.nums.num5 + $scope.nums.num6;
                payParams.password = pwd;
                //余额支付
                Launch.moneyPay(payParams).$promise.then(function(response) {
                    Loading.hide();
                    $ionicPopup.alert({
                        title: "支付成功！",
                        okText: "确定"
                    }).then(function() {
                        $state.go('show');
                    });

                }, function(response) {
                    Loading.hide();
                    $ionicPopup.alert({
                        title: response.data.message,
                        okText: "确定"
                    }).then(function() {
                        index = 0;
                        $scope.nums = {
                            num1: '',
                            num2: '',
                            num3: '',
                            num4: '',
                            num5: '',
                            num6: ''
                        };
                    });
                })
            }

            //删除输入
            if (number == 'back') {
                var string = 'num' + index;
                $scope.nums[string] = '';
                index--;

            }
        }

    }
]);
