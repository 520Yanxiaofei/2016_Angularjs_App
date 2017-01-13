angular.module("App.Manage.Examine", []).controller("App.Manage.Examine.Controller", [
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

		$scope.arg = $state.params;

		$scope.detail = {};

		$scope.detail.name = $scope.arg.name;
		$scope.detail.title = $scope.arg.title;
		$scope.detail.message = $scope.arg.message;
		$scope.detail.time = $scope.arg.time;
		$scope.detail.imgSrc = $scope.arg.avatar;
		$scope.detail.isJoin = $scope.arg.type;

		// 同意申请
		$scope.consent = function(){

			Manage.getVerifyApply({

				uid: $scope.arg.uid,
				requestId: $scope.arg.id,
				requestType: $scope.arg.type,
				actionType: 2

			}).$promise.then(function( data ){

				console.log( data );
				history.back();

			}, function( err ){

				console.log( err );
				alert(err.data.message);
				history.back();

			});

		}

		// 拒绝申请
		$scope.refuse = function(){

			Manage.getVerifyApply({

				uid: $scope.arg.uid,
				requestId: $scope.arg.id,
				requestType: $scope.arg.type,
				actionType: 3

			}).$promise.then(function( data ){

				console.log( data );
				history.back();

			}, function( err ){

				console.log( err );
				alert(err.data.message);
				history.back();

			});

		}

	}
]);