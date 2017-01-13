angular.module("App.Models").factory("Shop", [
    "$resource",
    function(
        $resource
    ) {
        return $resource(config.API_ROOT + "/mall/shop/:action", {}, {
            // 获取商家列表
            getSearchList: {
                method: "GET",
                params: {
                    action: "search"
                }
            },
            // 获取以及行业
            getTopIndustry: {
                method: "GET",
                params: {
                    action: "top_industry"
                },
                isArray: true
            },
            //店铺收藏删除
            getgoodsremove: {
                method: "POST",
                params: {
                    action: "collect_delete"
                }
            },
            //获取店铺基础信息
            getShopinfo: {
                method: "GET",
                params: {
                    action: "info"
                }
            },
            //收藏店铺
            collectAdd: {
                method: "POST",
                params: {
                    action: "collect_add"
                }
            },
            //取消收藏店铺
            collectDelete: {
                method: "POST",
                params: {
                    action: "collect_delete"
                }
            },
            //获取店铺距离信息
            infoLocal: {
                method: "POST",
                params: {
                    action: "info_local"
                }
            },
            getUserzilocal: {
                method: "GET",
                params: {
                    action: "dealer_shop"
                }
            },
            //自动定位订单自提点列表
            getAutoAddPick: {
                method: "POST",
                params: {
                    action: "nearby_list"
                }
            },
            //手动选择订单自提点列表
            getOwnSearchPick: {
                method: "POST",
                params: {
                    action: "own_search"
                }
            },
            //自提点详情
            getDealerShop: {
                method: "POST",
                params: {
                    action: "dealer_shop"
                }
            },
            //预约服务详情
            getDetaiShop: {
                method: "POST",
                params: {
                    action: "service_address_info"
                }
            },
            // 店铺相册
            getAlbum: {
                method: "GET",
                params: {
                    action: "album"
                }
            },
            // 获取预约服务列表
            getServerList: {
                method: "POST",
                params: {
                    action: "service_address_list"
                }
            },
            // 获取店铺列表
            getShopList: {
                method: "POST",
                params: {
                    action: "get_list"
                },
                isArray: true
            }
        })
    }
])
