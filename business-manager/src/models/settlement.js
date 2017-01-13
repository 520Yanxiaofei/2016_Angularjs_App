angular.module("App.Models").factory("settlement", [
    "$resource",
    function(
        $resource
    ) {
        return $resource(config.API_ROOT + "/seller/shop/settlement", {}, {
            
            
        })
    }
])