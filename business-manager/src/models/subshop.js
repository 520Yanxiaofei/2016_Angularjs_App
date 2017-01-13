angular.module("App.Models").factory("Subshop", [
    "$resource",
    function(
        $resource
    ) {
        return $resource(config.API_ROOT + "/seller/subshop/:action", {}, {
            //线下店列表
            getListShop: {
                method: "post",
                params: {
                    action: "list_shop"
                }
            },
            //增加线下店
            addShop: {
                method: "POST",
                params: {
                    action: "add"
                }
            },
            //修改线下店
            editShop: {
                method: "POST",
                params: {
                    action: "edit"
                }
            },
            //根据代言号获取信息
            getShopByNumber: {
                method: "get",
                params: {
                    action: "get_shop_by_number"
                }
            }

        })
    }
])