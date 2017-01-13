angular.module("App.Create.Restrictions", []).controller("App.Create.Restrictions.Controller", [
	"$scope", 
	"$state",
    "Ordinary",
	function( $scope, $state ,Ordinary){
        
        // 获取选秀类型列表
        Ordinary.getCategoryList().$promise.then(function(response) {
            $scope.showTypes = response.list;
            //上一步或者下一步保存表单
            angular.forEach($scope.showTypes, function(type){
                if($scope.form.type == type.id){
                   type.checked = true 
                }
            })
        }, function(response) {
            
        })

        //点击单选
        $scope.changeType = function(item){
            angular.forEach($scope.showTypes, function(type){
                if(type.id != item.id){
                   type.checked = false 
                }
            })
            $scope.helper.type = item.id
            $scope.form.type = item.id
        }
	}
]);