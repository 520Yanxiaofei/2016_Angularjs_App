angular.module("App.Models").factory("Orders", [
    "$resource",
    function(
        $resource
    ) {
        return $resource(config.API_ROOT + "/seller/order/:action", {}, {
            //订单详情
            getDetail: {
                method: "POST",
                params: {
                    action: "detail"
                }
            },
            getList: {
                method: "POST",
                params: {
                    action: "order_list"
                }
            },
            //发货
            getShip: {
                method: "POST",
                params:{
                    action: "ship"
                }
            },
            //自提
            selfShip: {
                method: "POST",
                params:{
                    action: "since"
                }
            },
            //修改订单备注
            setRemark: {
                method: "POST",
                params:{
                    action: "remark"
                }
            },
            getReplenishList: {
                method: "POST",
                params: {
                    action: "replenish_list"
                }
            },
            replenishSend: {
                method: "POST",
                params: {
                    action: "replenish_send"
                }
            },
            getReplenishDetail: {
                method: "POST",
                params: {
                    action: "replenish_detail"
                }
            },
            changePrice: {
                method: "POST",
                params: {
                    action: "change_price"
                }
            }

        })
    }
])