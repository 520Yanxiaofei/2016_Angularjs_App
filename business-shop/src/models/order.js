angular.module("App.Models").factory("Order", [
    "$resource",
    function ($resource) {
        return $resource(config.API_ROOT + "/mall/order/:action", {}, {
            //订单列表
            getOrderList: {
                method: "GET",
                params: {
                    action: "order_list"
                }
            },
            //订单详细
            getDetail: {
                method: "GET",
                params: {
                    action: "order_info"
                }
            },
            // 创建订单
            createOrder: {
                method: "POST",
                params: {
                    action: "create"
                }
            },
            // 快递确认收货
            receiptConfirm: {
                method: "POST",
                params: {
                    action: "receipt_confirm"
                }
            },
            //获取支付订单信息
            payInfo: {
                method: "POST",
                params: {
                    action: "pay_info"
                }
            },
            //代付请求
            payHelp: {
                method: "POST",
                params: {
                    action: "pay_help"
                }
            },
            //代付信息
            payHelpInfo: {
                method: "POST",
                params: {
                    action: "pay_help_info"
                }
            },
            //余额支付
            payAmount: {
                method: "POST",
                params: {
                    action: "pay_amount"
                }
            },
            //取消订单
            cancel: {
                method: "POST",
                params: {
                    action: "cancel"
                }
            },
            //微信支付信息
            getWechatOrderInfo: {
                method: "POST",
                params: {
                    action: "pay_weixin"
                }
            },
            //跟新代付状态
            updateHelp: {
                method: "POST",
                params: {
                    action: "update_help"
                }
            },
            //获取自提订单列表
            getPickList: {
                method: "POST",
                params: {
                    action: "pick_list"
                }
            },
            //获取自提订单详情
            getPickDetail: {
                method: "POST",
                params: {
                    action: "pick_detail"
                }
            },
            //获取自提订单列表
            orderSince: {
                method: "POST",
                params: {
                    action: "since"
                }
            },
            //获取自提订单列表
            getReplenishList: {
                method: "POST",
                params: {
                    action: "replenish_lists"
                }
            },
            //获取自提订单列表
            replenishApply: {
                method: "POST",
                params: {
                    action: "replenish_apply"
                }
            },
            //获取自提订单列表
            replenishReceipt: {
                method: "POST",
                params: {
                    action: "replenish_receipt"
                }
            },
            //获取自提订单列表
            getRepenishDetail: {
                method: "POST",
                    params: {
                    action: "replenish_detail"
                }
            },
        })
    }
])