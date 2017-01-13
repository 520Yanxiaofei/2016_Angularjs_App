angular.module("App.Models").factory("Financia", [
    "$resource",
    function(
        $resource
    ) {
        return $resource(config.API_ROOT + "/seller/balance/:action", {}, {
            //销售结算
            lists: {
                method: "POST",
                params: {
                    action: "lists"
                }
            },
            //人民币提现
            extract: {
                method: "POST",
                params: {
                    action: "extract"
                }
            },
            //颜值分提现
            integralExtract: { 
                method: "POST",
                params: {
                    action: "integral_extract"
                }
            },
            //代言币提现
            goldExtract: { 
                method: "POST",
                params: {
                    action: "gold_extract"
                }
            },
            //代言币列表
            goldList: { 
                method: "POST",
                params: {
                    action: "gold_balance_lists"
                }
            },
            //颜值分列表
            integralList: { 
                method: "POST",
                params: {
                    action: "integral_balance_lists"
                }
            },
        })
    }
])