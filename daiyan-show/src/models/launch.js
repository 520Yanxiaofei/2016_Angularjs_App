angular.module("App.Models").factory("Launch", [
    "$resource",
    function(
        $resource
    ) {
        return $resource(config.API_ROOT + "/show/launch/:action", {}, {
            // 余额支付
            moneyPay: {
                method: "GET",
                params: {
                    action: "money_pay"
                },
                isArray: true
            },
            // 获取支付参数
            getApplyParams: {
                method: "GET",
                params: {
                    action: "apply_pay"
                }
            }
        })
    }
])
