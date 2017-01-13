angular.module("App.Models").factory("Choice", [
    "$resource",
    function(
        $resource
    ) {
        return $resource(config.API_ROOT + "/show/choice/:action", {}, {
            // 获取搜索结果列表
            getBannerInfo: {
                method: "GET",
                params: {
                    action: "banner"
                },
                isArray: true
            },
            // 获取推荐选秀
            getShowReconmmend: {
                method: "GET",
                params: {
                    action: "recommend"
                }
            },
            // 获取热门选秀
            getShowHot: {
                method: "GET",
                params: {
                    action: "hot"
                }
            }
        })
    }
])
