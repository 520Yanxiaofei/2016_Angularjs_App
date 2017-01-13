angular.module("App.Header", []).controller("App.Header.Controller", [
    "$scope",
    "$state",
    "$rootScope",
    function(
        $scope,
        $state,
        $rootScope
    ) {
        $scope.title = "";
        $scope.$state = $state;

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            event.preventDefault();
            switch (toState.name) {
                case "home":
                    $scope.title = "主页";
                    break;
                case "edit":
                    $scope.title = "店铺信息修改";
                    break;
                case "goods":
                    $scope.title = "商品管理";
                    break;
                case "goods.add":
                    $scope.title = "商品管理 > 新品发布";
                    break;
                case "goods.edit":
                    $scope.title = "商品管理 > 商品分类修改";
                    break;
                case "goods.detail":
                    $scope.title = "商品管理 > 商品详情";
                    break;
                case "goods.publish":
                    $scope.title = "商品管理 > 商品发布";
                    break;
                case "goods.unreleased":
                    $scope.title = "商品管理 > 未发布商品";
                    break;
                case "goods.unshelves":
                    $scope.title = "商品管理 > 未上架商品";
                    break;
                case "goods.shelves":
                    $scope.title = "商品管理 > 已上架商品";
                    break;
                case "goods.classification":
                    $scope.title = "商品管理 > 自定义商品分类";
                    break;
                case "goods.goods.classification-add":
                    $scope.title = "商品管理 > 自定义商品分类添加";
                    break;
                case "goods.goods.classification-edit":
                    $scope.title = "商品管理 > 自定义商品分类修改";
                    break;
                case "goods.shelves":
                    $scope.title = "商品管理 > 已上架商品";
                    break;
                case "orders":
                    $scope.title = "订单管理";
                    break;
                case "orders.completed":
                    $scope.title = "订单管理 > 已完成订单";
                    break;
                case "orders.undelivered":
                    $scope.title = "订单管理 > 待发货订单";
                    break;
                case "orders.unsigned":
                    $scope.title = "订单管理 > 待签收订单";
                    break;
                case "orders.all":
                    $scope.title = "订单管理 > 全部订单";
                    break;
                case "orders.detail":
                    $scope.title = "订单管理 > 订单详情/发货";
                    break;
                case "financia":
                    $scope.title = "财务管理";
                    break;
                case "financia.settlement":
                    $scope.title = "财务管理 > 销售结算";
                    break;
                case "financia.integral":
                    $scope.title = "财务管理 > 颜值分结算";
                    break;
                case "financia.gold":
                    $scope.title = "财务管理 > 代言币结算";
                    break;
                case "customer":
                    $scope.title = "售后管理";
                    break;
                case "customer.return":
                    $scope.title = "退货订单";
                    break;
                case "warehouse":
                    $scope.title = "仓储管理";
                    break;
                case "warehouse.replenish":
                    $scope.title = "补货管理";
                    break;
            }
        });
    }
]);
