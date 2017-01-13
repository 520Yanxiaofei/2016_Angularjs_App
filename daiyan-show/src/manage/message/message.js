angular.module("App.Manage.Message", []).controller("App.Manage.Message.Controller", [
	"$scope",
	"$state",
	"$timeout",
	"Manage",
	function(
		$scope,
		$state,
		$timeout,
		Manage
	) {

		$scope.nid = $state.params.id;
		$scope.applyList = [];	// 申请列表
		$scope.page = 0;
		$scope.limit = 10;
		$scope.isProcess = 1;
		$scope.isJoin = 1;
		$scope.isLoadMore = true;
		// 申请加入/退出
		$scope.joinOrExit = function( id ){
			return id == $scope.isJoin;
		}
		// 处理状态
		$scope.processState = function( id ){
			return id == $scope.isProcess;
		}	

		$scope.getApply = function(){

			Manage.getApplyList({

				id: $scope.nid,
				page: $scope.page,
				limit: $scope.limit,

			}).$promise.then(function(data){
				console.log(data);
				angular.forEach(data.peopleList, function(data){
					$scope.applyList.push(data);
				});
				$scope.isLoadMore = data.peopleList.length >= $scope.limit ? true : false;
				$scope.$broadcast('scroll.refreshComplete');
				$scope.$broadcast('scroll.infiniteScrollComplete');

			}, function(err){
				console.log(err);

			});
		}

		// 下拉刷新
		$scope.doRefresh = function(){
			$scope.applyList = [];
			$scope.page = 1;
			$scope.getApply();
			$scope.$broadcast('scroll.refreshComplete');
		}

		// 上拉加载
		$scope.loadMore = function(){
			$scope.page ++;
			$scope.getApply();
		}

		// 处理加入/退出申请
		$scope.toProcess = function(obj){
			if(obj.status != 1){
				return;
			}
			$state.go("manage.examine", {
				uid: obj.uid,
				id: obj.id,
				type: obj.type,
				name: obj.name,
				title: obj.title,
				message: obj.message,
				avatar: obj.avatar,
				time: obj.time
			});

		}

	}

]);