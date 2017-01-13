angular.module("App.Models").factory("System", [
    "$resource",
    function(
        $resource
    ) {
        return $resource(config.API_ROOT + "/mall/system/:action", {}, {
            // 获取首页顶部广告图
            getAdverts: {
                method: "GET",
                params: {
                    action: "advert"
                },
                isArray: true
            }
        })
    }
])
