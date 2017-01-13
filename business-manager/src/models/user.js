angular.module("App.Models").factory("User", [
    "$resource",
    function(
        $resource
    ) {
        return $resource(config.API_ROOT + "/seller/shop/account", {}, {
            getUserInfo: {
                method: "GET",
                params: {
                    
                }
            },
            editUserProfile: {
                method: "PATCH",
                params: {
                    action: "profile"
                }
            }

        })
    }
])