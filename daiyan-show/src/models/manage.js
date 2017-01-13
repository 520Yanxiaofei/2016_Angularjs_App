angular.module("App.Models").factory("Manage", [
	"$resource", 
	function( $resource ){

		return $resource(config.API_ROOT + "/show/member/:action", {}, {
			// 主题选秀申请加入退出列表
			getApplyList: {
				method: "POST",
				params: {
					action: "apply_list"
				}
			},
			// 审核申请加入退出
			getVerifyApply: {
				method: "POST",
				params: {
					action: "verify_apply"
				},
                isArray: true
			},
			//加入选秀
            getrankAdd:{
                method:"GET",
                params:{
                    action:"join_apply"
                },
                isArray: true
            }

		});

	}
]);