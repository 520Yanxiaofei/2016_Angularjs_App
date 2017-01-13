angular.module('App.Models').factory('Ordinary', [
    '$resource',
    function(
        $resource
    ) {
        return $resource(config.API_ROOT + "/show/ordinary/:action", {}, {
            // 获取分类选秀分类
            getCategoryList: {
                method: "GET",
                params: {
                    action: "category_list"
                }
            },
            // 获取分类选秀推荐
            getRecommendList: {
                method: "GET",
                params: {
                    action: "recommend"
                }
            },
            // 获取分类选秀列表
            getList: {
                method: "GET",
                params: {
                    action: "lists"
                }
            },
            // 获取历史选秀
            getHistory: {
                method: "GET",
                params: {
                    action: "history"
                }
            },
            // 获取活动详情
            getShowInfo: {
                method: "GET",
                params: {
                    action: "info"
                }
            },
            // 获取活动二维码
            getShowCode: {
                method: "GET",
                params: {
                    action: "show_code"
                }
            },
            // 获取选秀成员
            getShowUserList: {
                method: "GET",
                params: {
                    action: "user_list"
                }
            },
            // 获取全部选秀
            getShowALL: {
                method: "GET",
                params: {
                    action: "all"
                }
            }
            
        })
    }
])
