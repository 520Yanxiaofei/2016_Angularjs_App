angular.module("App.User.OrderReplenishDetail", []).controller("App.User.OrderReplenishDetail.Controller", [
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
            "1": "已支付",
            "2": "卖家已发货",
            "3": "交易完成",
            "4": "交易关闭"
        };
        //获取订单数据
        Loading.show();
        function getDetail() {
            Order.getRepenishDetail({
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
        $scope.replenishApply =function (pick_id) {
            var params = {
                pick_id: pick_id,
            }
            Order.replenishApply(params).$promise.then(function (data) {
                var alertPopup = $ionicPopup.alert({
                    title: '补货申请成功',
                    okText: "确定"
                });
                alertPopup.then(function () {
                    // item.replenish_status = 1;
                    getDetail();
                });
            },function (error) {
                $ionicPopup.alert({
                    title: error.data.message,
                    okText: "确定"
                });
            });
        }
        $scope.replenishReceipt =function (pick_id) {
            var params = {
                pick_id: pick_id,
            }
            var confirmPopup = $ionicPopup.confirm({
                cancelText: '取消',
                okText: '确定',
                title: '是否确认收货?',
            });
            confirmPopup.then(function (res) {
                if (res) {
                    Order.replenishReceipt(params).$promise.then(function (data) {
                        getDetail();
                    },function (error) {
                        $ionicPopup.alert({
                            title: error.data.message,
                            okText: "确定"
                        });
                    });
                } else {
                }
            });
        }
    }
]);
