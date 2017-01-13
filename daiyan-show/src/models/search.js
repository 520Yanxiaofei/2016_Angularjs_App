angular.module("App.Models").factory("Search", [
    "$resource",
    function(
        $resource
    ){
        return $resource(config.API_ROOT + "/show/ordinary/:action", {}, {
            // 全局搜索/精选
            getSearch: {
                method: "POST",
                params: {
                    action: "search"
                }
            },
            // 公益搜索
            getSearchACharity: {
                method: "POST",
                params: {
                    action: "charity_search"
                }
            },
            // 分类活动搜索
            getSearchCategory: {
                method: "POST",
                params: {
                    action: "category_search"
                }
            },
            // 活动用户搜索
            getSearchUser: {
                method: "POST",
                params: {
                    action: "search_user"
                }
            }
        });


    }
])
