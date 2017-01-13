angular.module("App.Order.AnotherPayInfo", []).controller("App.Order.AnotherPayInfo.Controller", [
    "$scope",
    "$state",
    "Order",
    function ($scope,
              $state,
              Order) {

        var order_id = $state.params.order_id
        $scope.order_id = order_id
        //资格商品类型
        var goods_type = $state.params.goods_type;

        Order.payHelpInfo({order_id: order_id}).$promise.then(function (order_detail) {
            console.log(order_detail)
            $scope.order_detail = order_detail
            //status 状态(0:已申请,1:已支付,2:已拒绝,3:已取消)
            if (order_detail.status == "0") {
                $scope.img = "image/daifu-dengdai.png"
            } else if (order_detail.status == "1") {
                $scope.img = "image/daifu-success.png"
            } else if (order_detail.status == "2") {
                $scope.img = "image/daifu-fail.png"
            }
        }, function (error) {
            console.log(error)
        });

        $scope.goOrderPay = function (order_id) {
            Order.updateHelp({order_id: order_id}).$promise.then(function (update_help) {
                console.log(update_help)
                $state.go("order.pay", {order_id: order_id});
            }, function (error) {
                console.log(error)
            })
        }
        $scope.goOrderDetail = function () {
            $state.go("user.order-detail", {id: $scope.order_id });
        }

    }
]);
