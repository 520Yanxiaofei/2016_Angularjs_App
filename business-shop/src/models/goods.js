angular.module("App.Models").factory("Goods", [
    "$resource",
    function(
        $resource
    ) {
        return $resource(config.API_ROOT + "/mall/goods/:action", {}, {
            // 获取搜索结果列表
            getSearchList: {
                method: "GET",
                params: {
                    action: "search"
                }
            },
            // 获取品牌列表
            getBrandList: {
                method: "GET",
                params: {
                    action: "brand_list"
                }
            },
            // 根据id获取商品详情
            getDetailById: {
                method: "GET",
                params: {
                    action: "info"
                }
            },
            // 获取商品分类列表
            getCategoryList: {
                method: "GET",
                params: {
                    action: "category_select"
                },
                isArray: true
            },
            //商品收藏删除
            getproremove: {
                method: "POST",
                params: {
                    action: "collect_delete"
                }
            },
            //商品添加收藏
            addCollect: {
                method: "POST",
                params: {
                    action: "collect_add"
                }
            },
            //获取店铺商品列表
            getGoodslist: {
                method: "GET",
                params: {
                    action: "lists"
                }
            },
            //红包商品列表
            getVoucherlist: {
                method: "GET",
                params: {
                    action: "voucher_goods_list"
                }
            },
            //颜值币商品列表
            getGlodlist: {
                method: "GET",
                params: {
                    action: "gold_goods_list"
                }
            },
            //颜值分商品列表
            getIntegrallist: {
                method: "GET",
                params: {
                    action: "integral_goods_list"
                }
            },
            //代言人商品列表
            getPSeniorityList: {
                method: "GET",
                params: {
                    action: "position_goods_list/position_id/1"
                },
                isArray: true
            },
            //代言商商品列表
            getMSeniorityList: {
                method: "GET",
                params: {
                    action: "position_goods_list/position_id/2"
                },
                isArray: true
            },
            //代言商商品列表
            getSeniority: {
                method: "GET",
                params: {
                    action: "qualifi_home"
                }
            },
            //获取商品奖金设置信息
            getReward:{
                 method: "GET",
                params: {
                    action: "get_reward"
                }

            }

            
        })
    }
])
