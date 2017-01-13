angular.module("App.User.MyseniorityMegagame", []).controller("App.User.MyseniorityMegagame.Controller", [
    "$scope",
    "$state",
    "$ionicTabsDelegate",
    "$ionicHistory",
    "Member",
    "Shop",
    "Goods",
    "$ionicLoading",
    "$ionicPopup",
    "$timeout",
    "Loading",
    "$ionicPopup",
    "$ionicListDelegate",
    function(
        $scope,
        $state,
        $ionicTabsDelegate,
        $ionicHistory,
        Member,
        Shop,
        Goods,
        $ionicLoading,
        $ionicPopup,
        $timeout,
        Loading,
        $ionicPopup,
        $ionicListDelegate
    ) {
        $scope.back = function() {
            $ionicHistory.goBack();
        };
        //加载
        Loading.show();

        //---------------------------------------------------------------------
        //商品收藏
        //初始化数据6条
        $scope.pages = 1;
        $scope.limits = 6;
        $scope.AllPage = 0;
        $scope.moreDataCanBeLoaded = true;
        $scope.moreDatared = true;
        $scope.proList_length = true;
        $scope.localmore = true;
        $scope.Nulldatase = false;
        $scope.proList = [];
        //下拉刷新
        $scope.doRefresh = function() {
            Member.getMemberUserProct({
                page: $scope.pages,
                limit: $scope.limits
            }).$promise.then(function(response) {
                pageData(response)
            }).finally(function() {
                $scope.$broadcast('scroll.refreshComplete');
            });
        };
        //上拉加载
        $scope.loadMore = function() {
            Member.getMemberUserProct({
                page: $scope.pages,
                limit: $scope.limits
            }).$promise.then(function(response) {
                pageData(response);
            }, function(error) {})
        };

        function pageData(response) {
            if (response.total == 0) {
                $scope.moreDataCanBeLoaded = false;
                $scope.proList_length = false;
                $scope.moreDatared = true;
                $scope.localmore = true;
                $scope.Nulldatase = true;
                Loading.hide();
            } else {
                $scope.AllPage = Math.ceil(response.total / $scope.limits);
                if ($scope.pages === 1) {
                    Loading.hide();
                    $scope.moreDataCanBeLoaded = true;
                    $scope.localmore = false;
                };
                angular.forEach(response.list, function(response) {
                    $scope.proList.push(response);
                });
                $scope.$broadcast('scroll.infiniteScrollComplete');
                if ($scope.pages === $scope.AllPage) {
                    $scope.moreDataCanBeLoaded = false;
                    $scope.moreDatared = false;
                    $scope.localmore = true;
                }
                $scope.pages = $scope.pages + 1;
                if ($scope.select_alled == true) {
                    $scope.shouldShowDelete = true;
                    for (var i = 0; i < $scope.proList.length; i++) {
                        $scope.proList[i].checked = $scope.select_alled;
                    }
                }
            }
        }
        

    }
])
