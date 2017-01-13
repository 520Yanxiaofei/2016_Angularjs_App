angular.module("App.Commonweal.Draft", []).controller("App.Commonweal.Draft.Controller", [
    "$scope",
    "$state",
    "Welfare",
    "Loading",
    "PickService",
    function(
        $scope,
        $state,
        Welfare,
        Loading,
        PickService
    ) {
        $scope.person = {
            p: $state.params.p,
            votePerson: $state.params.vp
        };

        PickService.set("search_users", []);
        PickService.set("search_text", null);

        //加载
        Loading.show();
        //活动ID
        $scope.ids = $state.params.id;
        //初始化数据6条
        $scope.page = 1;
        $scope.limit = 20;
        $scope.AllPage = 0;
        $scope.moreData = true; //启用刷新
        $scope.moreDataed = true; //更多数据

        $scope.peopleList = [];

        //下拉刷新
        $scope.doRefreshse = function() {
            Welfare.getrankDraft({
                id: $state.params.id,
                page: $scope.page,
                limit: $scope.limit
            }).$promise.then(function(response) {
                pagelist(response)
            }).finally(function() {
                $scope.$broadcast('scroll.refreshComplete');
            });
        };
        
        //
        $scope.loadMorese = function() {
            Welfare.getrankDraft({
                id: $state.params.id,
                page: $scope.page,
                limit: $scope.limit
            }).$promise.then(function(response) {
                pagelist(response);
            }, function(error) {
                console.log(error)
            });
        };



        function pagelist(response) {
            $scope.Allpage = response.peopleList.length;
            if ($scope.page === 1) {
                $scope.moreData = true;
            };
            angular.forEach(response.peopleList, function(response) {
                $scope.peopleList.push(response);
            });
            $scope.$broadcast('scroll.infiniteScrollComplete');
            if ($scope.limit > $scope.Allpage) {
                $scope.moreData = false;
                $scope.moreDataed = false;
            }
            if ($scope.Allpage == 0){
                $scope.moreDataed = true;
            }
            $scope.page = $scope.page + 1;
            Loading.hide()
        };

    }
]);
