angular.module("App.Models").factory("Overview", [
    "$resource",
    function(
        $resource
    ) {
        return $resource(config.API_ROOT + "/show/overview/:action", {}, {
            //选秀个人信息
            getrankUser:{
                method:'GET',
                params:{
                    action:"info"
                }
            },
            //选秀支持者人数
            getrankSupporter:{
               method: "GET",
                params: {
                    action: "supporter"
                } 
            },
            //投票记录
            getrankRecord:{
                method:"GET",
                params:{
                    action:"vote_record"
                }
            },
            //选秀个人信息(公益)
            getcomUser:{
                method:'GET',
                params:{
                    action:"charity_info"
                }
            },
            

            
        })
    }
])
