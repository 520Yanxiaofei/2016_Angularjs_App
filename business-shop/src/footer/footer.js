angular.module("App.Footer", []).controller("App.Footer.Controller", [
    "$scope",
    "$state",
    function(
        $scope,
        $state
    ) {
        // 设置微信title
        var update_wx_title = function(title) {
            // var body = document.getElementsByTagName('body')[0];
            // document.title = title;
            // var iframe = document.createElement("iframe");
            // iframe.setAttribute("src", "/favicon.ico");
            // var handle = function() {
            //     setTimeout(function() {
            //         iframe.removeEventListener('load', handle, false);
            //         document.body.removeChild(iframe);
            //     }, 0);
            // }
            // iframe.addEventListener('load', handle, false);
            // document.body.appendChild(iframe);
        }

        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            // debugger;
            // console.log(toState.name);
            event.preventDefault();
            switch (toState.name) {
                case "home":
                    $scope.tab = 'home';
                    update_wx_title("首页");
                    break;
                case "user":
                    $scope.tab = 'none';
                    update_wx_title("用户中心");
                    break;
                case "user.info":
                    $scope.tab = 'me';
                    update_wx_title("用户信息");
                    break;
                case "user.address":
                case "user.address-edit":
                    $scope.tab = 'none';
                    update_wx_title("收货地址");
                    break;
                case "user.information-check":
                    $scope.tab = 'none';
                    update_wx_title("入驻信息审核");
                    break;
                case "user.merchant-information":
                    $scope.tab = 'none';
                    update_wx_title("填写入驻信息");
                    break;
                case "user.merchant-notes":
                    $scope.tab = 'none';
                    update_wx_title("入驻状态信息");
                    break;
                case "user.order-detail":
                    $scope.tab = 'none';
                    update_wx_title("订单详情");
                    break;
                case "user.mycollection":
                    $scope.tab = 'none';
                    update_wx_title("我的收藏");
                    break;
                case "user.orderList":
                    $scope.tab = 'none';
                    update_wx_title("订单列表");
                    break;
                case "user.orderList.unpaid":
                    $scope.tab = 'none';
                    update_wx_title("待付款订单列表");
                    break;
                case "user.orderList.unsined":
                    update_wx_title("待收货订单列表");
                    break;
                case "user.orderList.done":
                    $scope.tab = 'none';
                    update_wx_title("已完成订单列表");
                    break;
                case "user.pay":
                    $scope.tab = 'none';
                    update_wx_title("支付");
                    break;
                case "user.balance-pay":
                    update_wx_title("支付密码");
                    break;
                case "user.balance-pay":
                    $scope.tab = 'none';
                    update_wx_title("支付密码");
                    break;
                case "goods":
                    $scope.tab = 'none';
                    update_wx_title("商品");
                    break;
                case "goods.detail":
                    $scope.tab = 'none';
                    update_wx_title("商品详情");
                    break;
                case "goods.seller":
                    $scope.tab = 'shop';
                    update_wx_title("全部商家");
                    break;
                case "goods.search-goods":
                    $scope.tab = 'find';
                    update_wx_title("商品");
                    break;
                case "goods.search-result":
                    $scope.tab = 'shop';
                    update_wx_title("商家搜索列表");
                    break;
                case "order":
                    $scope.tab = 'none';
                    update_wx_title("订单");
                    break;
                case "order.order-address":
                    $scope.tab = 'none';
                    update_wx_title("订单地址");
                    break;
                case "order.order-fill":
                    $scope.tab = 'none';
                    update_wx_title("订单填写");
                    break;
                case "shop":
                    $scope.tab = 'none';
                    update_wx_title("店铺");
                    break;
                case "shop.seller-home":
                    $scope.tab = 'shop';
                    update_wx_title("商家店铺首页");
                    break;
                case "shop.album":
                    $scope.tab = 'none';
                    update_wx_title("店铺相册");
                    break;
                case "back":
                    $scope.tab = 'none';
                    update_wx_title("退款");
                    break;
                case "back.back-tip":
                    $scope.tab = 'none';
                    update_wx_title("退款进度提示");
                    break;
                case "back.return-progress":
                    $scope.tab = 'none';
                    update_wx_title("退款进度");
                    break;
                case "back.application-services":
                    $scope.tab = 'none';
                    update_wx_title("申请售后");
                    break;
                case "back.orderReturned":
                    $scope.tab = 'none';
                    update_wx_title("待退货订单");
                    break;
                default:
                    $scope.tab = 'none';
                    break;
            }
        })
    }
]);
