angular.module("App.Models").factory("Setting", [
	"$resource",
	function( $resource ){

		return $resource(config.API_ROOT + "/show/setting/:action", {}, {
            // 设置管理员参加活动
            setPart: {
                method: "POST",
                params: {
                    action: "take_part"
                },
                isArray: true
            },
            // 设置加入人身份
            setIdentity: {
                method: "POST",
                params: {
                    action: "allow_identity"
                },
                isArray: true
            },
            // 设置活动报名截止时间
            setEndTime: {
                method: "POST",
                params: {
                    action: "sign_time"
                },
                isArray: true
            },
            // 取消管理员参加活动
            cancelPart: {
                method: "POST",
                params: {
                    action: "cancel_part"
                },
                isArray: true
            },
            // 设置申请加入选秀是否需要审核
            setVerify: {
                method: "POST",
                params: {
                    action: "is_verify"
                },
                isArray: true
            },
            // 获取微信jssdk参数
            wxconfigParam: {
                method: "POST",
                params: {
                    action: "wxconfig_param"
                }
            }
        });

	}
]);