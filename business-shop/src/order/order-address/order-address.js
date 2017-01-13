angular.module("App.Order.OrderAddress", []).controller("App.Order.OrderAddress.Controller", [
    "$scope",
    "$state",
    "$ionicScrollDelegate",
    "Order",
    "Loading",
    "Shop",
    "PickService",
    "dyLocation",
    function(
        $scope,
        $state,
        $ionicScrollDelegate,
        Order,
        Loading,
        Shop,
        PickService,
        dyLocation
    ) {
        //点击选中自提点
        var scroll = angular.element(document.getElementsByClassName("scroll")[0]);
        $scope.nowAddress = "";
        $scope.shopId = 0;      //自提点商家id
        $scope.ind = null;
        $scope.indNew = null;
        $scope.addStyle = false;
        $scope.autoCho = true;
        $scope.selfCho = false;
        //自动定位获取自提点列表
        $scope.nowAdd = [];
        $scope.nowAutoAdd = [];
        $scope.nowSelfAdd = [];
        $scope.nowSearchAdd = [];
        $scope.isLoadMore = true;  //上拉是否加载更多
        $scope.isAutoLoadMore = true;
        $scope.isSelfLoadMore = true;
        $scope.page = 0;
        $scope.pageSelf = 0;
        $scope.allPage = 0;
        $scope.allPageSelf = 0;
        $scope.limit = 8;
        $scope.limitSelf = 8;
        $scope.lat = 0;
        $scope.lng = 0;
        //是否切入搜索框
        $scope.isFocus = false;
        $scope.isBlur = true;
        $scope.searchWord = "";
        //记录切换自提模式时各自的位置
        $scope.autoPlace = 0;
        $scope.selfPlace = 0;

        $scope.isActive = function(num, address){
            //$scope.nowAddress = address;  
            if( $scope.autoCho ){
                return num == $scope.ind; 
            }else {
                return num == $scope.indNew; 
            }
        }

        $scope.chooseAddAuto = function(index, address, id){
            $scope.ind = index;
            $scope.indNew = null;
            $scope.shopId = id;
            //$scope.nowAddress = address;
        }
        $scope.chooseAddSelf = function(index, address, id){
            $scope.indNew = index;
            $scope.ind = null;
            $scope.shopId = id;
            //$scope.nowAddress = address;
        }

        //自动定位
        $scope.autoAdd = function(type){
            
            console.log($ionicScrollDelegate.getScrollPosition().top);

            $scope.nowAdd = $scope.nowAutoAdd;
            if( !$scope.autoCho ){
                $scope.selfPlace = $ionicScrollDelegate.getScrollPosition().top;
            }
            //scroll.css("top",$scope.autoPlace);
            $ionicScrollDelegate.scrollTo(0, $scope.autoPlace, false);
            $scope.autoCho = true;
            $scope.selfCho = false;
            $scope.isLoadMore = $scope.isAutoLoadMore;
            //$scope.doRefresh();
        }
        //手动选择
        $scope.selfAdd = function(type){
            console.log($ionicScrollDelegate.getScrollPosition().top);

            $scope.nowAdd = $scope.nowSelfAdd;
            if( !$scope.selfCho ){
                $scope.autoPlace = $ionicScrollDelegate.getScrollPosition().top;
            }
            $ionicScrollDelegate.scrollTo(0, $scope.selfPlace, false);
            $scope.autoCho = false;
            $scope.selfCho = true;
            $scope.isLoadMore = $scope.isSelfLoadMore;
            //selfChooseAddress();
        }

        //Loading.show();

        //获取经纬度
        var getLocation = function() {


            // if (window.navigator.geolocation) {
            //     window.navigator.geolocation.getCurrentPosition(showPosition, function() {
            //         console.log("位置信息获取失败，请前往地图设置！");
            //         //$scope.doRefresh();
            //         $scope.$broadcast("scroll.infiniteScrollComplete");
            //     }, {
            //         timeout: 4000 //设置超时时间
            //     });
            // } else {
            //     console.log("浏览器不支持地理定位！");
            //     // 初始化页面数据
            // }
            dyLocation.get().then(function(data){
                $scope.$broadcast("scroll.infiniteScrollComplete");
                showPosition(data);
            },function(error){
                console.log(error);
            });

        }
        var showPosition = function(position) {

            // $scope.lat = position.coords.latitude;
            // $scope.lng = position.coords.longitude;
            $scope.lat = position[1];
            $scope.lng = position[0];

            Shop.getAutoAddPick({

                lat: $scope.lat,
                lng: $scope.lng,
                page: $scope.page,
                limit: $scope.limit

            }).$promise.then(function(data){

                $scope.address = data;
                $scope.allPage = Math.ceil($scope.address.total / $scope.limit);
                angular.forEach(data.list, function( data ){
                    $scope.nowAutoAdd.push(data);
                });
                $scope.nowAdd = $scope.nowAutoAdd;
                $scope.nowAddress = $scope.nowAdd[0].address;
                $scope.shopId = $scope.nowAdd[0].id;
                //当当前页的条数大于等于总条数或者页数大于等于总页数的时候禁止上拉加载
                $scope.isAutoLoadMore = data.list.length >= $scope.address.total ? false : true;
                $scope.isAutoLoadMore = $scope.page >= $scope.allPage ? false : true;
                $scope.$broadcast("scroll.infiniteScrollComplete");

            }, function(err){

                console.log(err);

            });

            console.log('纬度:' + $scope.lat + ',' + '经度:' + $scope.lng);
        }

        //getLocation();
        //$scope.doRefresh();

        //下拉刷新
        $scope.doRefresh = function(){
            $scope.nowAdd = [];
            if( $scope.autoCho ){
                $scope.nowAutoAdd = [];
                $scope.page = 1;
                $scope.nowAdd = $scope.nowAutoAdd;
                getLocation();
            }
            if( $scope.selfCho && $scope.searchWord == "" ){
                $scope.nowSelfAdd = [];
                $scope.pageSelf = 1;
                $scope.nowAdd = $scope.nowSelfAdd;
                $scope.getSelf();
            }
            if( $scope.isFocus && $scope.searchWord != "" && !$scope.autoCho ){
                $scope.nowSearchAdd = [];
                $scope.nowAdd = $scope.nowSearchAdd;
                $scope.searchAdd($scope.searchWord);
            }
            //刷新完成
            $scope.$broadcast('scroll.refreshComplete');

        }

        //上拉加载更多(进入页面初始化会自动执行一次)
        $scope.loadMore = function(){

            if( $scope.autoCho ){
                $scope.nowAdd = $scope.nowAutoAdd;
                $scope.page ++;
                getLocation();
            }
            if( $scope.selfCho ){
                $scope.nowAdd = $scope.nowSelfAdd;
                $scope.pageSelf ++;
                $scope.getSelf();
            }
            
        }


        //根据地区筛选
        $scope.area_id = "000000";
        $scope.position = [];

        $scope.getSelf = function(){

            Shop.getOwnSearchPick({

                lat: $scope.lat,
                lng: $scope.lng,
                page: $scope.pageSelf,
                limit: $scope.limitSelf,
                address: $scope.position[2]

            }).$promise.then(function(data){
                
                console.log(data);
                if(data.length == 0){
                    return;
                }
                $scope.allPageSelf = Math.ceil(data.total / $scope.limitSelf);
                angular.forEach(data.list, function( data ){
                    $scope.nowSelfAdd.push(data);
                });
                $scope.nowAdd = $scope.nowSelfAdd;
                $scope.isSelfLoadMore = data.list.length < $scope.limitSelf ? false : true;
                $scope.isSelfLoadMore = $scope.pageSelf >= $scope.allPageSelf ? false : true;
                $scope.isLoadMore = $scope.isSelfLoadMore;
                $scope.$broadcast("scroll.infiniteScrollComplete");
                console.log($ionicScrollDelegate.getScrollPosition());

            }, function(err){

                console.log(err);

            });
        }

        $scope.$watch("area_id", function(newValue, oldValue){

            //console.log(newValue + ":" + oldValue);
            //console.log($scope.position);
            $scope.indNew = null;
            if( newValue != oldValue ){
                $scope.doRefresh();
            }
            
        });  

        //提交自提点
        $scope.confirmAdd = function(){
            PickService.set("shopId", $scope.shopId);
            history.back();
        }

        //搜索自提点
        $scope.searchFocus = function(){
            $scope.isFocus = true;
            $scope.isBlur = false;
            console.log($scope.isBlur);
        }
        $scope.searchBlur = function(){
            //$scope.isFocus = false;
            $scope.isBlur = true;
            console.log($scope.isBlur);
        }

        $scope.searchAdd = function(address){
            $scope.nowSearchAdd = [];
            Shop.getOwnSearchPick({

                lat: $scope.lat,
                lng: $scope.lng,
                limit: 100,
                title: address

            }).$promise.then(function(data){

                if(data.length == 0){
                    return;
                }
                angular.forEach(data.list, function( data ){
                    $scope.nowSearchAdd.push(data);
                });
                $scope.nowAdd = $scope.nowSearchAdd;
                $scope.$broadcast("scroll.infiniteScrollComplete");

            })
        }

    }
]);