angular.module("App.Models").factory("Home", [
    "$resource",
    function(
        $resource
    ) {
        return $resource(config.API_ROOT + "/mall/home/:action", {}, {
            //推荐店铺
            getShopList: {
                method: "GET",
                params: {
                    action: "shop_list"
                },
                isArray: true
            },
            // 推荐商品
            getGoodsList: {
                method: "GET",
                params: {
                    action: "goods_list"
                }

            }
        })
    }
])
