angular.module("App.Models").factory("Helpbuy", [
    "$resource",
    function(
        $resource
    ) {
        return $resource(config.API_ROOT + "/mall/Helpbuy/:action", {}, {
            //推荐店铺
            getHelpInfo: {
                method: "GET",
                params: {
                    action: "info"
                }
            },
            // 推荐商品
            payAmount: {
                method: "GET",
                params: {
                    action: "pay_amount"
                }

            },
            // 代付微信支付
            payWeixin: {
                method: "GET",
                params: {
                    action: "pay_weixin"
                }

            }
        })
    }
])
