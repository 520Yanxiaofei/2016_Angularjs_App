angular.module("App.Widgets").factory("Loading", [
    "$ionicLoading",
    "$timeout",
    function(
        $ionicLoading,
        $timeout
    ) {
        var start_time,end_time,interval;
        interval=500;
        return {
            show: function(content) {
                start_time=(new Date()).getTime();
                $ionicLoading.show({
                    //templateUrl: 'widgets/loading/loading.html',
                    template: 
                    '<div class="weui_toast">'+
                        '<div class="weui_loading">'+
                            '<div class="weui_loading_leaf weui_loading_leaf_0"></div>'+
                            '<div class="weui_loading_leaf weui_loading_leaf_1"></div>'+
                            '<div class="weui_loading_leaf weui_loading_leaf_2"></div>'+
                            '<div class="weui_loading_leaf weui_loading_leaf_3"></div>'+
                            '<div class="weui_loading_leaf weui_loading_leaf_4"></div>'+
                            '<div class="weui_loading_leaf weui_loading_leaf_5"></div>'+
                            '<div class="weui_loading_leaf weui_loading_leaf_6"></div>'+
                            '<div class="weui_loading_leaf weui_loading_leaf_7"></div>'+
                            '<div class="weui_loading_leaf weui_loading_leaf_8"></div>'+
                            '<div class="weui_loading_leaf weui_loading_leaf_9"></div>'+
                            '<div class="weui_loading_leaf weui_loading_leaf_10"></div>'+
                            '<div class="weui_loading_leaf weui_loading_leaf_11"></div>'+
                        '</div>'+
                        '<p class="weui_toast_content">'+(content||"数据加载中")+'</p>'+
                    '</div>'
                });
            },
            hide: function(){
                var sleep;
                end_time=(new Date()).getTime();
                sleep=Math.abs(end_time - start_time);
                if ( sleep < interval){
                    $timeout(function(){
                        $ionicLoading.hide(); 
                    },interval-sleep);
                }else{
                    $ionicLoading.hide();
                }
                
            }
        }

    }
])