angular.module("App.Mine.Show", []).controller("App.Mine.Show.Controller", [
	"$scope",
	"$state",
	"$timeout",
    "$ionicScrollDelegate",
	"Mine",
	"PickService",
	function(
		$scope,
		$state,
		$timeout,
		$ionicScrollDelegate,
		Mine,
		PickService
	) {
		console.log(PickService.get("status"));
		$scope.myActiveSlide = 0;	// 点击切换／滑动切换对应
		$scope.ind = 0;				// 滑动切换tab
		// 切换时是否重新加载该选项下的数据
		$scope.isLoadMine = false;
		$scope.isLoadManage = false;
		$scope.isLoadApply = false;
		$scope.isLoadHistory = false;
		$scope.isLoadMore = false;
		// 本页是否加载更多
		$scope.isLoadMoreMine = false;
		$scope.isLoadMoreManage = false;
		$scope.isLoadMoreApply = false;
		$scope.isLoadMoreHistory = false;
		// 切换时恢复位置
		$scope.minePlace = 0;
		$scope.managePlace = 0;
		$scope.applyPlace = 0;
		$scope.historyPlace = 0;
		
		$scope.isActive = function(num){
			return num == $scope.ind;
		}
		$scope.slideHasChanged = function(index){
			//console.log($ionicScrollDelegate.getScrollPosition().top);
			$scope.ind = index;
			$scope.myActiveSlide = index;
			$ionicScrollDelegate.scrollTo(0, 0, false);
			switch( index ){
				case 0:
					$scope.isLoadMore = $scope.isLoadMoreMine;
					if(!$scope.isLoadMine){
						getMine();
					}
					break;
				case 1:
					$scope.isLoadMore = $scope.isLoadMoreManage;
					if(!$scope.isLoadManage){
						getManage();
					}
					break;
				case 2:
					$scope.isLoadMore = $scope.isLoadMoreApply;
					if(!$scope.isLoadApply){
						getApply();
					}
					break;
				case 3:
					$scope.isLoadMore = $scope.isLoadMoreHistory
					if(!$scope.isLoadHistory){
						getHistory();
					}
					break;
			}
		}

		$scope.changeTab = function(index){
			$scope.ind = index;
			$scope.myActiveSlide = index;
			$ionicScrollDelegate.scrollTo(0, 0, false);
		}

		//导航栏
		$scope.tabs = [
			"我参加的",
			"我管理的",
			"申请记录",
			"往期选秀"
		];

		$scope.mineShow = [];		//我参加的选秀
		$scope.manageShow = [];		//管理的选秀
		$scope.applyList = [];		//申请记录
		$scope.historyShow = [];	//往期选秀
		$scope.pageMine = 1;
		$scope.pageManage = 1;
		$scope.pageApply = 1;
		$scope.pageHistory = 1;
		$scope.limit = 10;
		// 申请记录审核状态
		$scope.isPass = function(status){
			if( status == 2 ){
				return true;
			}else {
				return false;
			}
		};
		$scope.isWait = function(status){
			if( status == 0 || status == 1 ){
				return true;
			}else {
				return false;
			}
		};
		$scope.isNotPass = function(status){
			if( status == 3 || status == 4 || status == 5 ){
				return true;
			}else {
				return false;
			}
		};

		getMine();
		getManage();
		getApply();
		getHistory();

		// 获取我参加的选秀列表
		function getMine(){

			Mine.getMineShow({

				page: $scope.pageMine,
				limit: $scope.limit

			}).$promise.then(function(data){

				angular.forEach(data.shows, function(show){
					$scope.mineShow.push(show);
				});
				$scope.isLoadMoreMine = data.shows.length >= $scope.limit ? true : false;
				$scope.isLoadMine = true;
				console.log($scope.isLoadMoreMine);
				$scope.$broadcast('scroll.refreshComplete');
				$scope.$broadcast('scroll.infiniteScrollComplete');

			}, function(err){

				console.log(err);

			});
		}

		// 获取管理的选秀列表
		function getManage(){

			Mine.getManageShow({

				page: $scope.pageManage,
				limit: $scope.limit

			}).$promise.then(function(data){

				angular.forEach(data.shows, function(show){
					$scope.manageShow.push(show);
				});
				$scope.isLoadMoreManage = data.shows.length >= $scope.limit ? true : false;
				$scope.isLoadManage = true;
				console.log($scope.isLoadMoreManage);
				$scope.$broadcast('scroll.refreshComplete');
				$scope.$broadcast('scroll.infiniteScrollComplete');

			}, function(err){

				console.log(err);

			});
		}

		// 获取申请纪录列表
		function getApply(){

			Mine.getApplyList({

				page: $scope.pageApply,
				limit: $scope.limit

			}).$promise.then(function(data){

				angular.forEach(data.shows, function(show){
					$scope.applyList.push(show);
				});
				$scope.isLoadMoreApply = data.shows.length >= $scope.limit ? true : false;
				$scope.isLoadApply = true;
				console.log($scope.isLoadMoreApply);
				$scope.$broadcast('scroll.refreshComplete');
				$scope.$broadcast('scroll.infiniteScrollComplete');

			}, function(err){

				console.log(err);

			});
		}

		// 获取往期选秀列表
		function getHistory(){

			Mine.getHistoryList({

				page: $scope.pageHistory,
				limit: $scope.limit

			}).$promise.then(function(data){

				angular.forEach(data.shows, function(show){
					$scope.historyShow.push(show);
				});
				$scope.isLoadMoreHistory = data.shows.length >= $scope.limit ? true : false;
				$scope.isLoadHistory = true;
				console.log($scope.isLoadMoreHistory);
				$scope.$broadcast('scroll.refreshComplete');
				$scope.$broadcast('scroll.infiniteScrollComplete');

			}, function(err){
				
				console.log(err);

			});
		}

		// 返回时保持tab状态
		if( PickService.get("status") && PickService.get("status") != "" ){
			$scope.isLoadMine = true;
			$scope.isLoadManage = true;
			$scope.isLoadApply = true;
			$scope.isLoadHistory = true;
			$scope.ind = PickService.get("status");
			$scope.slideHasChanged(PickService.get("status"));
		}

		// 下拉刷新
		$scope.doRefresh = function(){
			switch($scope.ind){
				case 0:
					console.log("mine");
					$scope.pageMine = 1;
					$scope.mineShow = [];
					getMine();
					break;
				case 1:
					console.log("manage");
					$scope.pageManage = 1;
					$scope.manageShow = [];
					getManage();
					break;
				case 2:
					console.log("apply");
					$scope.pageApply = 1;
					$scope.applyList = [];
					getApply();
					break;
				case 3:
					console.log("history");
					$scope.pageHistory = 1;
					$scope.historyShow = [];
					getHistory();
					break;
			}
		}

		// 上拉加载更多
		$scope.loadMore = function(){
			console.log("loadMore");
			switch($scope.ind){
				case 0:
					$scope.pageMine ++;
					getMine();
					break;
				case 1:
					$scope.pageManage ++;
					getManage();
					break;
				case 2:
					$scope.pageApply ++;
					getApply();
					break;
				case 3:
					$scope.pageHistory ++;
					getHistory();
					break;
			}
			return false;
		}

		// 进入选秀详情
		$scope.toDetail = function(id){
			PickService.set("status", $scope.ind);
			$state.go("selected.detail", {
				id: id
			});
		}
		

	}
]);