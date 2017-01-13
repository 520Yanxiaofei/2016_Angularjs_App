angular.module("App.Models").factory("Album", [
    "$resource",
    function(
        $resource
    ) {
        return $resource(config.API_ROOT + "/seller/album/:action", {}, {
            //相册图片列表
            getImgList: {
                method: "post",
                params: {
                    action: "image_lists"
                }
            },
            //删除图片
            deleteImg: {
                method: "POST",
                params: {
                    action: "del_photo"
                }
            }

        })
    }
])