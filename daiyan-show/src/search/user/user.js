angular.module("App.Search.User", []).controller("App.Search.User.Controller", [
	"$scope",
	"$state", 
	"Search",
	"PickService",
	function( $scope, $state, Search, PickService ){

		//取消输入
		$scope.isFocus = false;
		$scope.getfocus = false;
		$scope.searchVal = "";
		$scope.is_search = true;
		$scope.focus = function(){
			$scope.isFocus = true;
		}
		$scope.blur = function(){
			//$scope.isFocus = false;
			$scope.getfocus = false;
		}
		$scope.isCancel = function(){
			$scope.isFocus = false;
			$scope.searchVal = "";
			history.back();
		}
		$scope.clearVal = function(){
			$scope.searchVal = "";
			$scope.isFocus = true;
			$scope.getfocus = true;		//清除value之后焦点仍在
		}
		$scope.ishaveVal = function(){
			return $scope.searchVal != "";
		}
		
		//$scope.isRecord = false;				// 搜索记录是否显示
		$scope.users = [];						// 搜索结果列表
		$scope.searchVal = "";					// 搜索关键字
		$scope.ids = $state.params.ids;			// 活动标识
		$scope.isEmpty = false;
		$scope.type = $state.params.type;
		$scope.isLoadMore = true;
		$scope.page = 1;
		$scope.limit = 10;
		if( PickService.get("search_users").length > 0 ){
			$scope.users = PickService.get("search_users");
			$scope.searchVal = PickService.get("search_text");
			$scope.isFocus = true;
			$scope.getfocus = true;
			$scope.is_search = false;
		}
		$scope.getfocus = true;

		function searchUsers(){

			if( $scope.searchVal == "" ){
				return;
			}
			if( !$scope.is_search ){
				$scope.is_search = true;
				return;
			}

			Search.getSearchUser({

				id: $scope.ids,
				name: $scope.searchVal,
				page: $scope.page,
				limit: $scope.limit

			}).$promise.then(function(data){

				console.log(data);
				angular.forEach(data.users, function(show){
					$scope.users.push(show);
				});
				$scope.isEmpty = data.users.length == 0 ? true : false;
				$scope.isLoadMore = data.users.length >= $scope.limit ? true : false;
				$scope.$broadcast('scroll.refreshComplete');
				$scope.$broadcast('scroll.infiniteScrollComplete');

			}, function(err){

				console.log(err);
				alert(err.data.message);

			});
		}
		// 回车键或者输入法搜索键触发搜索
		$scope.toSearch = function($event){
			if( $event.keyCode == 13 ){	
				if( $scope.searchVal == "" ){
					alert("搜索内容不能为空！");
					return;
				}		
				$scope.page = 1;
				$scope.users = [];
				searchUsers();
			}
		}
		// 下拉刷新
		$scope.doRefresh = function(){
			if( $scope.searchVal == "" ){
				$scope.$broadcast('scroll.refreshComplete');
				return;
			}
			$scope.page = 1;
			$scope.users = [];
			searchUsers();
		}
		// 上拉加载更多
		$scope.loadMore = function(){
			console.log("loadMore");
			$scope.page ++;
			searchUsers($scope.is_search);
		}

		// 进入选秀详情
		$scope.toUser = function(uid){
			PickService.set("search_text", $scope.searchVal);
			PickService.set("search_users", $scope.users);
			if( $scope.type == 1 ){
				$state.go("commonweal.competition", {
					id: uid,
					ids: $scope.ids
				});
			}else {
				$state.go("selected.competition", {
					id: uid,
					ids: $scope.ids
				});
			}
		}

	}
]);