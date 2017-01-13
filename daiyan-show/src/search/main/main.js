angular.module("App.Search.Main", []).controller("App.Search.Main.Controller", [
	"$scope",
	"$state", 
	"Search",
	"PickService",
	function( $scope, $state, Search, PickService ){

		//取消输入
		$scope.isFocus = false;
		$scope.getfocus = false;
		$scope.searchVal = "";
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
		}
		$scope.clearVal = function(){
			$scope.searchVal = "";
			$scope.isFocus = true;
			$scope.getfocus = true;		//清除value之后焦点仍在
		}
		$scope.ishaveVal = function(){
			return $scope.searchVal != "";
		}
		
		$scope.isRecord = false;	// 搜索记录是否显示
		$scope.lists = [];			// 搜索结果列表
		$scope.searchVal = "";		// 搜索关键字
		$scope.isEmpty = false;
		$scope.isLoadMore = true;
		$scope.page = 1;
		$scope.limit = 10;
		$scope.lists = PickService.get("search_list").length > 0 ? PickService.get("search_list") : [];
		
		function searchList(){

			if( $scope.searchVal == "" ){
				return;
			}

			Search.getSearch({

				keyword: $scope.searchVal,
				page: $scope.page,
				limit: $scope.limit

			}).$promise.then(function(data){

				console.log(data);
				angular.forEach(data.shows, function(show){
					$scope.lists.push(show);
				});
				$scope.isEmpty = data.shows.length == 0 ? true : false;
				$scope.isLoadMore = data.shows.length >= $scope.limit ? true : false;
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
				$scope.lists = [];
				searchList();
			}
		}
		// 下拉刷新
		$scope.doRefresh = function(){
			if( $scope.searchVal == "" ){
				$scope.$broadcast('scroll.refreshComplete');
				return;
			}
			$scope.page = 1;
			$scope.lists = [];
			searchList();
		}
		// 上拉加载更多
		$scope.loadMore = function(){
			console.log("loadMore");
			$scope.page ++;
			searchList();
		}
		// 取消
		$scope.isCancel = function(){
			PickService.set("search_list", []);
			$state.go("show");
		}

		// 进入选秀详情
		$scope.toDetail = function(id,type){
			PickService.set("search_list", $scope.lists);
			if( type == "0" ){	// 跳转到非公益选秀详情页面
				$state.go("selected.detail", {
					id: id
				});
			}else {				// 跳转到公益选秀详情页面
				$state.go("commonweal.detail", {
					id: id
				});
			}
		}

	}
]);