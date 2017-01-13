angular.module("App.Create", ["App.Create.Caption","App.Create.Declaration","App.Create.Info","App.Create.Restrictions","App.Create.Sign"]).controller("App.Create.Controller", [
	"$scope", 
	"$state",
    "$ionicPopup",
    "$http",
    "Loading",
	function( $scope, $state ,$ionicPopup ,$http ,Loading){
        var steps = {
            0 : {
                template : "create/declaration/declaration.html"
            },
            1 : {
                template : "create/info/info.html",
                form: {
                    name: {
                        required: true,
                        max: 20,
                        min: 1,
                        title: "活动名称"
                    },
                    prize: {
                        required: true,
                        min: 1,
                        title: "活动奖品"
                    },
                    image: {
                        //required: true,
                        title: "宣传图"
                    }
                }
            },
            2 : {
                template : "create/caption/caption.html",
                form: {
                    description: {
                        required: true,
                        min: 1,
                        title: "活动说明"
                    },
                    summary: {
                        required: true,
                        min: 1,
                        title: "活动描述"
                    }
                }
            },
            3 : {
                template : "create/restrictions/restrictions.html",
                form: {
                    type: {
                        required: true,
                        title: "选秀分类"
                    },
                    starttime: {
                        required: true,
                        type: "[object Date]",
                        title: "开始时间"
                    },
                    endtime: {
                        required: true,
                        type: "[object Date]",
                        title: "结束时间"
                    },
                    limit: {
                        required: true,
                        title: "人数上限",
                        type: "[object Number]",
                        min:1
                    },
                }
            },
            4 : {
                template : "create/sign/sign.html",
                form: {
                    applicant: {
                        required: true,
                        max: 20,
                        min: 1,
                        title: "申请人姓名"
                    },
                    mobile: {
                        required: true,
                        title: "申请人电话"
                    }
                }
            },

        };

        var current_step = 0;

        //空值判断
        function isEmpty(val){
            //null , undefined
            if(val === null || val === undefined){
                return true;
            }

            //字符串，数组，对象(有length属性)
            if (val.length === 0){
                return true;
            }

            //空对象字面量
        };

        function validate(form,scheme){
            for(var i in scheme){

                //空值判断
                if (scheme[i].required && isEmpty(form[i])){
                    return scheme[i].title + "不能为空！";
                }

                if (scheme[i].type === "[object Number]"){
                    form[i] = +form[i];
                    //NaN判断
                    if(form[i]!==form[i]){
                        return scheme[i].title + "输入格式不正确！";
                    }
                }

                //类型判断
                if (scheme[i].type && scheme[i].type !== Object.prototype.toString.call(form[i]) ){
                    return scheme[i].title + "类型不正确！";
                }

                //取值范围判断
                if ($scope.form[i].length){
                    //字符串，数组
                    if (scheme[i].max && scheme[i].max < form[i].length ){
                        return scheme[i].title + "长度不能超过"+scheme[i].max;
                        
                    }
                    if (scheme[i].min && scheme[i].min > form[i].length ){
                        return scheme[i].title + "长度不能小于"+scheme[i].max;
                        
                    }
                }else{
                    //数字等
                    if (scheme[i].max && scheme[i].max < +form[i]){
                        return scheme[i].title + "不能超过"+scheme[i].max;
                        
                    }
                    if (scheme[i].min && scheme[i].min > +form[i] ){
                        return scheme[i].title + "不能小于"+scheme[i].min; 
                    }
                }
                
            }
            return true;
        };

        $scope.helper = {
            template : "",
            image: "image/default.png",
            template: steps[current_step].template || "create/declaration/declaration.html",
            type: null,
            apply_time: (new Date()).getTime()
        };

        $scope.form = {
            name : "",
            image: "",
            prize: "",
            description: "",
            summary: "",
            type: "",
            starttime: "",
            endtime: "",
            limit: NaN,
            public: true,
            applicant: "",
            mobile: "",
            is_charity: false
        };

        //选秀分类 类型转换
        // $scope.$watchCollection('helper.types',function (newVal,oldVal){
        //     var list=[];
            
        //     angular.forEach($scope.helper.types,function (v,k){
        //         v && list.push(k);
        //     })
        //     $scope.form.type = list.join(',');
            
        // })

        //跳到
        $scope.goto = function (step){
            // $scope.current_step = step;
            // $scope.helper.template = (steps[current_step] || {}).template;
        }

        //下一步
        $scope.next = function next (){
            var model,scheme,valid;
            
            model=steps[current_step];
            scheme =model.form;

            if (!model){
                return false;
            }

            //显示错误信息
            function error(msg){
                $ionicPopup.alert({
                    title: "错误",
                    template: msg || "输入错误！"
                });
            }

            /*
             *验证表单
             */

            valid = validate($scope.form,scheme);
            if (valid !== true){
                return error(valid);
            }

            current_step++;
            $scope.helper.template = (steps[current_step] || {}).template;
            
        };

        //上一步
        $scope.cancel= function cancel(){
            current_step = current_step-1;
            $scope.helper.template = (steps[current_step] || {}).template;
            //$state.go('show');
        }

        //提交表单
        $scope.submit = function submit(){
            var form = angular.copy($scope.form);
            
            form.starttime = angular.isDate(form.starttime) ? Math.ceil(form.starttime.getTime()/1000) : form.starttime;
            form.endtime = angular.isDate(form.endtime) ? Math.ceil(form.endtime.getTime()/1000) : form.endtime;
            form.public = +form.public;
            form.is_charity = +form.is_charity;
            
            Loading.show('正在提交');
            $http({
                method: 'POST',
                url: config.API_ROOT+'/show/launch/apply',
                data:form
            })
            .then(function(data){
                var id = data.data.apply_id;
                $state.go('pay.type', {id : id});
                Loading.hide();
            },function(error){
                Loading.hide();
                $ionicPopup.alert({
                    title: "错误",
                    template: (error && error.data && error.data.message) || "服务器错误！"
                });
            })
        }
	}
]);