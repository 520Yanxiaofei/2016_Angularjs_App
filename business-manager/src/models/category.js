angular.module("App.Models").factory("Category", [
    "$resource",
    function(
        $resource
    ) {
        return $resource(config.API_ROOT + "/seller/shop/:action", {}, {
            getBrand: {
                method: "GET",
                params: {
                    action: "brand_list"
                }
            },
            getSysCategory: {
                method: "GET",
                params: {
                    action: "category_sys_list"
                }
            },
            getSysCategoryTree: {
                method: "GET",
                params: {
                    action: "category_sys_list_tree"
                }
            },
            getCategory: {
                method: "GET",
                params: {
                    action: "category_list"
                }
            }
        })
    }
])