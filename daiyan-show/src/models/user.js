angular.module("App.Models").factory("User", [
    "$resource",
    function(
        $resource
    ) {
        return $resource(config.API_ROOT + "/mall/:action", {}, {
            // 用户信息
             getUser: {
                method: "GET",
                params: {
                    action: "member/info"
                }
            }

            
        })
    }
])
