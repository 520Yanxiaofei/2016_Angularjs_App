angular.module("App.Manage.Home", []).controller("App.Manage.Home.Controller", [
	"$scope", 
	"$state",
    "Mine",
    "Setting",
    "$ionicPopup",
    "Loading",
    "$q",
    "dyActionSheet",
    "$timeout",
	function( $scope, $state ,Mine , Setting, $ionicPopup ,Loading ,$q ,dyActionSheet, $timeout){
        var model;
        
        model={
            info: null,
            lock:{
                participate_lock : false,//是否参与活动 ui锁
                verify_lock : false
            },
            //获取选秀信息
            getInfo: function getInfo(id){
                Loading.show();
                model.info = model.action({
                    resource: Mine,
                    action: "getShowInfo",
                    params :{
                        showId:id
                    },
                    resolve: function (data){
                        model.info.id = id;
                        model.info.is_verify = model.info.is_verify == 1 ? true :false;
                        model.info.isParticipated = model.info.isParticipated == 1 ? true :false;
                        model.info.datetime = new Date(model.info.datetime * 1000);
                        Loading.hide();
                        return data;
                    },
                    reject: function (error){
                        Loading.hide();
                        return $q.reject(error);
                    }
                });
            },
            showMsg: function showMsg(){
                $state.go('manage.message',{id:model.info.id});
            },
            addMember: function addMember(){

            },
            delMember: function delMember(){

            },
            setEndTime: function setEndTime(){
                model.action({
                    resource: Setting,
                    action: "setEndTime",
                    params :{
                        id: model.info.id,
                        sign_end_time: angular.isDate(model.info.datetime)? model.info.datetime.getTime()/1000 : 0
                    },
                    reject: function (error){
                        return $q.reject(error);
                    }
                });
            },
            //编辑加入人身份
            editRoles: function editRoles(){
                var temp = model.info.allowedRoles;
                model.action({
                    resource: Setting,
                    action: "setIdentity",
                    params :{
                        showId: model.info.id,
                        roles: (function (){
                            var roles=0;
                            for(var i=0;i<model.info.allowedRoles.length;i++){
                                if (model.info.allowedRoles[i].selected == true){
                                    roles+=+model.info.allowedRoles[i].role;
                                }
                            }
                            return roles;
                        })()
                    },
                    reject: function (error){
                        model.info.allowedRoles = temp;
                        return $q.reject(error);
                    }
                });
            },
            //身份格式化
            formatRoles: function formatRoles(){
                var roles=[];
                if (!model.info.allowedRoles) return false;
                for(var i=0;i<model.info.allowedRoles.length;i++){
                    if (model.info.allowedRoles[i].selected == true){
                        roles.push(model.info.allowedRoles[i].name);
                    }
                }
                return roles.join(' ');
            },
            //设置是否需要审核
            setVerify: function setVerify(){
                model.lock.verify_lock = true;
                model.action({
                    resource: Setting,
                    action: "setVerify",
                    params :{
                        showId:model.info.id,
                        is_verify:+model.info.is_verify
                    },
                    resolve:function(data){
                        model.lock.verify_lock = false;
                    },
                    reject: function (error){
                        $timeout(function (){
                            model.info.is_verify = !model.info.is_verify;
                            model.lock.verify_lock = false;
                        },200);
                        return $q.reject(error);
                    }
                });
            },

            // 设置自己是否参与选秀
            setParticipate: function setParticipate(){
                model.lock.participate_lock = true;
                return model.action({
                    resource: Setting,
                    action: !model.info.isParticipated ? "cancelPart" : "setPart",
                    params :{
                        id: model.info.id
                    },
                    resolve: function(data){
                        model.lock.participate_lock = false;
                    },
                    reject: function (error){
                        $timeout(function (){
                            model.info.isParticipated = !model.info.isParticipated;
                            model.lock.participate_lock = false;
                        },200);
                        return $q.reject(error);
                    }
                });
                
            },
            // crud事件代理
            action: function (def){
                var resource_action,promise;
                def = def || {};
                if (!def.resource && !def.action ){
                    return false;
                }
                resource_action = def.resource[def.action];
                if (!resource_action){
                    return false;
                }
                promise = resource_action(def.params || {});
                promise.$promise.then(def.resolve,def.reject)
                .then(function (data){

                },function (error){
                    $ionicPopup.alert({
                        title: "错误",
                        template: error.data && error.data.message || "服务器错误！"
                    });
                });
                return promise;
            }

        };

        //初始化数据
        model.getInfo($state.params.id);

        //弹出加入人身份框
        $scope.showRoles = function showRoles(){
            
           var hideSheet = dyActionSheet.show({
             templateUrl : 'manage/identity/identity.html',
             scope: $scope,
             ok:function (){
                model.editRoles();
             }
             
           });

        };

        $scope.helper = {
            inviteQrcode : false,
            qrcode : false
        };

        
        $scope.toggleModal = function closeModal(code){
            $scope.helper[code] = !$scope.helper[code];
        };

        $scope.showMember = function showMember(){
            $state.go('manage.member',{id:$state.params.id});
        };

        $scope = angular.extend($scope,model);
	}
])
.factory('dyActionSheet', [
  '$rootScope',
  '$compile',
  '$animate',
  '$timeout',
  '$templateCache',
  '$ionicBody',
function($rootScope, $compile, $animate, $timeout, $templateCache,$ionicBody) {

  return {
    show: actionSheet
  };

  
  function actionSheet(opts) {
    var scope = opts.scope || $rootScope.$new(true);
    angular.extend(scope,opts || {});
    var template = $templateCache.get(scope.templateUrl) || ""; 
    var removed = false;
    var element = scope.element = $compile(template)(scope);
    var sheetEl = angular.element(element[0].querySelector('.action-sheet-wrapper'));
    var stateChangeListenDone = scope.cancelOnStateChange ? $rootScope.$on('$stateChangeSuccess', function() { scope.cancel(); }) :angular.noop;
    var backdropClick = function(e) {
        if (e.target == element[0]) {
          scope.cancel();
          scope.$apply();
        }
      };
    element.bind('click', backdropClick);
    scope.removeSheet = function(done) {
      if (removed) return;

      removed = true;
      sheetEl.removeClass('action-sheet-up');
      $timeout(function() {
        
        $ionicBody.removeClass('action-sheet-open');
      }, 400);
      stateChangeListenDone();
      $animate.removeClass(element, 'active').then(function() {
        element.remove();
        scope.cancel.$scope = sheetEl = null;
        (done || angular.noop)(opts.buttons);
      });
    };

    scope.showSheet = function(done) {
      if (removed) return;

      $ionicBody.append(element)
                .addClass('action-sheet-open');

      $animate.addClass(element, 'active').then(function() {
        if (removed) return;
        (done || angular.noop)();
      });
      $timeout(function() {
        if (removed) return;
        sheetEl.addClass('action-sheet-up');
      }, 20, false);
    };


    scope.cancel = function() { 
      scope.removeSheet(opts.cancel);
    };
    scope.ok = function() { 
      scope.removeSheet(opts.ok);
    };
    scope.showSheet();
    scope.cancel.$scope = scope;
    return scope.cancel;
  }
}]);