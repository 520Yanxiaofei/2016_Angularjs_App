angular.module("App.Models").factory("Welfare", [
    "$resource",
    function(
        $resource
    ) {
        return $resource(config.API_ROOT + "/show/welfare/:action", {}, {
            // 获取搜索结果列表
            getRecommendList: {
                method: "GET",
                params: {
                    action: "recommend"
                }
            },
            // 公益项目（选秀排行）
            getWelfareList: {
                method: "GET",
                params: {
                    action: "lists"
                }
            },
            // 获取爱心统计
            getLoveCount: {
                method: "GET",
                params: {
                    action: "love_count"
                }
            },
            // 公益排行
            getrankDraft: {
                method: "POST",
                params: {
                    action: "people"
                }
            }
        })
    }
])
