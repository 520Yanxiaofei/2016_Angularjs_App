angular.module('App.Models').factory('Member', [
    '$resource',
    function(
        $resource
    ) {
        return $resource(config.API_ROOT + "/show/member/:action", {}, {
            // 管理选秀成员列表
            getMemberList:{
                method: "GET",
                params: {
                    action: "people_list"
                }
            },
            // 设置成为管理员
            setManager:{
                method: "POST",
                params: {
                    action: "admin_set"
                },
                isArray: true
            },
            // 取消管理员
            removeManager:{
                method: "POST",
                params: {
                    action: "admin_cancel"
                },
                isArray: true
            },
            // 退出选秀
            quitApply:{
                method: "POST",
                params: {
                    action: "quit_apply"
                },
                isArray: true
            }

        })
    }
])
.factory('MemberInfo', [
    '$resource',
    function(
        $resource
    ) {
        return $resource(config.API_ROOT + "/mall/member/:action", {}, {
            // 获取用户基本信息
            getUserInfo: {
                method: "GET",
                params: {
                    action: "info"
                }
            }

        })
    }
])
