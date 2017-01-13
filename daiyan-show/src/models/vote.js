angular.module("App.Models").factory("Vote", [
    "$resource",
    function(
        $resource
    ) {
        return $resource(config.API_ROOT + "/show/vote/:action", {}, {
            //免费投票
            getrankFree: {
                method: "GET",
                params: {
                    action: "free"
                }
            },
            //微信支付
            getcharpay: {
                method: "POST",
                params: {
                    action: "pay"
                }
            },
            //微信支付（公益自定义金额）
            getcharitable: {
                method: "POST",
                params: {
                    action: "charitable"
                }
            }
        })
    }
])
