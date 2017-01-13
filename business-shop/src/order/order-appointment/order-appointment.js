angular.module("App.Order.OrderAppointment", []).controller("App.Order.OrderAppointment.Controller", [
	"$scope",
	"$state",
	"Shop",
	"PickService",
	"$http",
    "$ionicPopup",
	function( $scope, $state, Shop, PickService, $http ,$ionicPopup ){

		console.log($state.params);
		$scope.address = null;
		$scope.initRefresh = function(){
			$scope.$broadcast('scroll.infiniteScrollComplete');
		};
		$scope.initList = [];
		$scope.list = [];
        $scope.area_id = "000000";
		$scope.shop_id = $state.params.shop_id;
		$scope.goods_id = $state.params.goods_id;
		$scope.isLoadMore = true;
		$scope.limit = 10;
		$scope.page = 0;
		$scope.id = 0;	//预约服务id

		$scope.initRefresh = function(){
			Shop.getServerList({

				shop_id: $scope.shop_id,
				goods_id: $scope.goods_id,
				page: $scope.page,
				limit: $scope.limit

			}).$promise.then(function(data){

				console.log(data);
				$http.get('http://wap.cellmyth.cn/city.data-3.json').success(function(json){
					$scope.address = json;
					angular.forEach(data.list, function( data ){
	                	data.position = getAddress($scope.address, data.area_id) || [];
	                    data.position = data.position.join('');
	                    $scope.initList.push(data);
	                });
					$scope.list = $scope.initList;
					$scope.isLoadMore = data.total > $scope.initList.length ? true : false;
					$scope.$broadcast('scroll.infiniteScrollComplete');
				}).error(function(err){
					console.log(err);
				});

			}, function(err){

				console.log(err);

			});
		}

		//$scope.initRefresh();

		$scope.getRefresh = function(){
			Shop.getServerList({

				shop_id: $scope.shop_id,
				goods_id: $scope.goods_id,
				area_id: $scope.area_id,
				page: $scope.page,
				limit: $scope.limit

			}).$promise.then(function(data){

				console.log(data);
				$scope.isLoadMore = data.total > $scope.limit ? true : false;
				angular.forEach(data.list, function( data ){
					data.position = getAddress($scope.address, data.area_id) || [];
                    data.position = data.position.join('');
                    $scope.list.push(data);
                });
				//$scope.list = data.list;
				$scope.isLoadMore = data.total > $scope.list.length ? true : false;
				$scope.$broadcast('scroll.infiniteScrollComplete');

			}, function(err){

				console.log(err);

			});
		}

		$scope.index = null;
		//选择区域
		$scope.chooseAdd = function(index, id){
			$scope.index = index;
			$scope.id = id;
		}

		//是否选中
		$scope.isActive = function(num){
			return num == $scope.index;
		}

		//下拉刷新
		$scope.doRefresh = function(){

			$scope.page = 1;
			$scope.initList = [];
			$scope.list = [];
			if( $scope.area_id == "000000" ){
				$scope.initRefresh();
			}else{
				$scope.getRefresh();
			}
			$scope.$broadcast('scroll.refreshComplete');

		}

		//上拉加载更多
		$scope.loadMore = function(){
			$scope.page ++;
			if( $scope.area_id == "000000" ){
				console.log("0000");
				$scope.initRefresh();
			}else{
				$scope.getRefresh();
			}

		}

		//更改地区
		$scope.$watch("area_id", function(newValue, oldValue){

            if( newValue != oldValue ){
                console.log($scope.area_id);
                $scope.page = 1;
				$scope.initList = [];
				$scope.list = [];
                if( $scope.area_id == "000000" ){
					$scope.initRefresh();
				}else{
					$scope.getRefresh();
				}
            }

        });

		// 提交确认
		$scope.confirmAdd = function(){
            if (!$scope.id){
                $ionicPopup.alert({
                    title: "温馨提示",
                    template: "<div style='text-align:center'>请选择服务地址！</div>"
                });
                return false;
            }
			PickService.set("server_id", $scope.id);
			history.back();
		}

		//根据地址id取省市县
        function getAddress(data,value){
            var temId,result,parent;
            var id=parseInt(value,10);
            result=[];
            for(var i=0;i<data.length;i++){
                temId=parseInt(data[i].value,10);
                if (temId==id){
                    result=result.concat(data[i].text);
                    break;
                }else if(Math.abs(temId-id)<10000  && data[i].children){
                    parent=data[i].text;
                    result=getAddress(data[i].children,value);
                    if (result.length>0){

                        result.unshift(parent);
                        break;
                    }
                }
            }
            return result;
        }

	}
]);
