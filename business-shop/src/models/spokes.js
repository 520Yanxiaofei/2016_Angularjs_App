angular.module("App.Models").factory("Spokes", [
    "$resource",
    function(
        $resource
    ) {
        return $resource(config.API_ROOT + "/mall/spokes/:action", {}, {
            //检查是否完善代言人资料
            spokesinfoIntegrityCheck: {
                method: "GET",
                params: {
                    action: "spokesinfo_integrity_check"
                }
            },
            // 查询代言人信息
            getSpokesinfo: {
                method: "GET",
                params: {
                    action: "get_spokesinfo"
                }

            },
            // 发送手机验证码
            sendSms: {
                method: "GET",
                params: {
                    action: "send_sms"
                }

            },
            // 提交代言人资料
            submit: {
                method: "GET",
                params: {
                    action: "submit"
                }

            }
        })
    }
])
