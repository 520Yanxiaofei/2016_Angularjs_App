angular.module("App.Models").factory("Goods", [
    "$resource",
    function(
        $resource
    ) {
        return $resource(config.API_ROOT + "/seller/goods/:action", {}, {
            createGood: {
                method: "post",
                params: {
                    action: "create"
                }
            },
            //未上架商品列表
            getGoodsListed: {
                method: "get",
                params: {
                    action: "goods_listed"

                }
            },
            //未发布商品列表
            getGoodsList: {
                method: "get",
                params: {
                    action: "goods_list"

                }
            },
            //已上架的商品列表
            getSellList: {
                method: "get",
                params: {
                    action: "sell_list"
                }
            },
            //商品详情
            getDetial: {
                method: "GET",
                params: {
                    action: "detial"
                }
            },
            //修改分类
            edit: {
                method: "POST",
                params: {
                    action: "edit"
                }
            },
            //上架
            goodOnline: {
                method: "POST",
                params: {
                    action: "goods_online"
                }
            },
            //删除商品
            goodDel: {
                method: "POST",
                params: {
                    action: "goods_del"
                }
            },
            //下架
            goodOffline: {
                method: "POST",
                params: {
                    action: "goods_offline"
                }
            },
            //商品介绍
            setDescription: {
                method: "POST",
                params: {
                    action: "set_description"
                }
            },
            //上传图片
            setAblum: {
                method: "POST",
                params: {
                    action: "set_ablum"
                }
            },
            //修改商品基本信息
            editDetial: {
                method: "POST",
                params: {
                    action: "set_goods"
                }
            },
            //删除图片
            deleteImg: {
                method: "POST",
                params: {
                    action: "images_del"
                }
            },
            //商品提交审核
            applyGoods: {
                method: "POST",
                params: {
                    action: "submit_verify"
                }
            },
            //设置颜值分，代言币兑换比例
            ruleEdit: {
                method: "POST",
                params: {
                    action: "rule_edit"
                }
            },
            //分销比例查询
            distributionInfo: {
                method: "POST",
                params: {
                    action: "distribution_info"
                }
            },
            //分销比例修改
            goodsDistribution: {
                method: "POST",
                params: {
                    action: "goods_distribution",
                    transformRequest: []
                }
            },
            //属性分组添加
            goodsGroupAdd: {
                method: "POST",
                params: {
                    action: "attr_group_add"
                }
            },
            //属性分组列表
            goodsGroupList: {
                method: "POST",
                params: {
                    action: "attr_group_list"
                }
            },
            // 分类属性列表
            goodsAttrsList: {
                method: "POST",
                params: {
                    action: "attr_list"
                }
            },
            // 属性值添加
            goodsAttrsAdd: {
                method: "POST",
                params: {
                    action: "attr_val_add"
                }
            },
            // 属性值修改
            goodsAttrsValUpdate: {
                method: "POST",
                params: {
                    action: "attr_val_update"
                }
            },
            // 商品属性值修改设置
            goodsAttrsSet: {
                method: "POST",
                params: {
                    action: "goods_attr_set"
                }
            },
            // 商品属性分组修改设置
            goodsAttrsGroupSet: {
                method: "POST",
                params: {
                    action: "goods_attrgroup_set"
                }
            }
        })
    }
])
