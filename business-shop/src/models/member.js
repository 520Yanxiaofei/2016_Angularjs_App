angular.module("App.Models").factory("Member", [
    "$resource",
    function(
        $resource
    ) {
        return $resource(config.API_ROOT + "/mall/member/:action", {}, {
            getMemberInfo: {
                method: "GET",
                params: {
                    action: "Info"
                }
            },
            getMemberAmountInfo: {
                method: "GET",
                params: {
                    action: "amount_info"
                }
            },
            getMemberApplyStatus: {
                method: "GET",
                params: {
                    action: "apply_info"
                }
            },
            // 重新编辑店铺信息的时候重新请求原始信息
            getMemberEditStatus: {
                method: "POST",
                params: {
                    action: "edit_apply_info"
                }
            },
            // 重新编辑店铺信息的时候重新提交
            getMemberEditApply: {
                method: "POST",
                params: {
                    action: "edit_apply"
                }
            },
            // 提交入驻信息
            postApply: {
                method: "POST",
                params: {
                    action: "apply"
                }
            },
            // 我已支付入驻费用
            havePay: {
                method: "POST",
                params: {
                    action: "apply_status_update"
                }
            },
            // 重新提交入驻信息
            postReApply: {
                method: "POST",
                params: {
                    action: "apply_update"
                }
            },
            // 获取地址列表
            getAddressList: {
                method: "GET",
                params: {
                    action: "address_list"
                },
                isArray: true
            },
            // 删除收货地址
            delAddress: {
                method: "POST",
                params: {
                    action: "address_delete"
                }
            },
            //添加收货地址
            addAddress: {
                method: "POST",
                params: {
                    action: "address_add"
                }
            },
            // 编辑收货地址
            editAddress: {
                method: "POST",
                params: {
                    action: "address_edit"
                }
            },
            // 根据ID获取收货地址信息
            getAddressById: {
                method: "GET",
                params: {
                    action: "address_info"
                }
            },
            // 设置默认地址
            setAddressDefault: {
                method: "POST",
                params: {
                    action: "address_default"
                }
            },
            //获取用户默认地址
            getOrdermoreId:{
                method:"GET",
                params:{
                    action:"address_get"
                }
            },
            //店铺收藏
            getMemberUsercollection: {
                method: "POST",
                params: {
                    action: "shop_collect_list"
                }
            },
            //商品收藏
            getMemberUserProct: {
                method: "POST",
                params: {
                    action: "goods_collect_list"
                }
            },
            //我的代言人商品
            getMyseniorityGoods: {
                method: "POST",
                params: {
                    action: "seniority_goods"
                }
            },
            //我的代言商商品
            getMyseniorityBusiGoods: {
                method: "POST",
                params: {
                    action: "seniority_shop"
                }
            },
            //商家入驻余额支付
            storeBalancePay: {
                method: "POST",
                params: {
                    action: "pay_amount"
                }
            },
            //商家入驻支付宝支付
            storeAliPay: {
                method: "POST",
                params: {
                    action: "alipay"
                }
            },
            //商家入驻支付宝支付
            storeAliPay: {
                method: "POST",
                params: {
                    action: "alipay"
                }
            },
            //获取完善资料的类型（代言人资料，代言商资料）
            checkAptitude: {
                method: "POST",
                params: {
                    action: "check_aptitude"
                }
            },
            //获取代付列表
            helpBuyList: {
                method: "POST",
                params: {
                    action: "helpbuy_list"
                }
            },
            //拒绝代付
            helpBuyDeny: {
                method: "POST",
                params: {
                    action: "helpbuy_deny"
                }
            },
            //获取代付人信息
            getHelpUserInfo:{
                method: "POST",
                params: {
                    action: "get_info"
                }
            },
            //检测自提点信息
            checkSub:{
                method: "POST",
                params: {
                    action: "check_sub"
                }
            },
            //设置分享人
            setShare:{
                method: "POST",
                params: {
                    action: "set_share_member"
                }
            }

        })
    }
])
