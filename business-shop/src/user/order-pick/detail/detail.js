angular.module("App.User.OrderPickDetail", []).controller("App.User.OrderPickDetail.Controller", [
    "$scope",
    "$state",
    "$ionicHistory",
    "Order",
    "$ionicPopup",
    "Loading",
    "$http",
    function ($scope,
              $state,
              $ionicHistory,
              Order,
              $ionicPopup,
              Loading,
              $http) {
        var id = $state.params.id;
        var shop_id = $state.params.shop_id;
        $scope.data = {};
        $scope.back = function () {
            $ionicHistory.goBack();
        }
        //交易状态
        $scope.orderStatus = {
            "0": "未支付",
            "1": "待发货",
            "2": "卖家已发货",
            "3": "交易完成",
            "4": "交易关闭"
        };
        //获取订单数据
        Loading.show();
        function getDetail() {
            Order.getPickDetail({
                id: id,
                shop_id: shop_id
            }).$promise.then(function (data) {
                Loading.hide();
                $scope.data = data;
                count = 0;
                angular.forEach($scope.data.goods, function (value, key) {
                    count += parseInt(value['quantity']);
                    var selectedTypeList = [];
                    angular.forEach(value.attrbute_value, function (attrItem) {
                        selectedTypeList.push(attrItem.value)
                    });
                    $scope.data.goods[key].selectedType = selectedTypeList.join("、");
                })
                $scope.data.quantity = count;
            }, function (response) {
                $ionicPopup.alert({
                    title: "错误",
                    template: response.message || "服务器错误！"
                });
                Loading.hide();
            });
        };
        getDetail();
        // Triggered on a button click, or some other target
        $scope.showPopup = function (data) {
            $scope.data = data;
            $scope.data.people_num = '';
            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                templateUrl: 'user/order-pick/popup.html',
                title: '自提信息',
                scope: $scope,
                buttons: [
                    {
                        text: '<b>确认</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            if (!$scope.data.people_num) {
                                //don't allow the user to close unless he enters wifi password
                                $ionicPopup.alert({
                                    title: '自提码不能为空',
                                    okText: "确定"
                                });
                                e.preventDefault();
                            } else {
                                return $scope.data;
                            }
                        }
                    },
                    {
                        text: '取消',
                        onTap: function () {
                            return false;
                        }
                    }
                ]
            });
            myPopup.then(function (res) {
                if(res === false){
                    return false;
                }
                Order.orderSince({id:res.id, number:res.people_num, ship_type:res.order.ship_type, shop_id:res.order.shop_id}).$promise.then(function (data) {
                    var alertPopup = $ionicPopup.alert({
                        title: '订单商品自提成功',
                        okText: "确定"
                    });
                    alertPopup.then(function () {
                        getDetail();
                    });
                }, function (error) {
                    $ionicPopup.alert({
                        title: error.data.message,
                        okText: "确定"
                    });
                });

            });
        };
    }
]);
