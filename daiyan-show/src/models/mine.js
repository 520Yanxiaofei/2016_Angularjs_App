angular.module("App.Models").factory("Mine", [
	"$resource",
	function( $resource ){

		return $resource(config.API_ROOT + "/show/mine/:action", {}, {
           
            // 我参加的选秀
            getMineShow: {
                method: "POST",
                params: {
                    action: "partake"
                }
            },
            // 管理的选秀
            getManageShow: {
                method: "POST",
                params: {
                    action: "manage_list"
                }
            },
            // 申请记录
            getApplyList: {
                method: "POST",
                params: {
                    action: "apply"
                }
            },
            // 往期选秀
            getHistoryList: {
                method: "POST",
                params: {
                    action: "history"
                }
            },
            //限制身份加入
            getrankLimit:{
                method:"GET",
                params:{
                    action:"manage"
                }
            },        
            // 选秀详细
            getShowInfo: {
                method: "POST",
                params: {
                    action: "manage"

                }
            }

        });

	}
]);