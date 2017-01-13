angular.module("App.Models").factory("Setting", [
	"$resource",
	function( $resource ){

		return $resource(config.API_ROOT + "/mall/setting/:action", {}, {
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