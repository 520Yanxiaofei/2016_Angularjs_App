angular.module("App.Models").factory("Dealer", [
    "$resource",
    function(
        $resource
    ) {
        return $resource(config.API_ROOT + "/mall/dealer/:action", {}, {
            // 查询代言商信息
            getDealerinfo: {
                method: "GET",
                params: {
                    action: "get_dealerinfo"
                }

            },
            // 提交代言人资料
            submit: {
                method: "GET",
                params: {
                    action: "submit"
                }

            }
        })
    }
])
