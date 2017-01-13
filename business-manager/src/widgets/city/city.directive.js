angular.module("App.Widgets").directive("dyCity", [
    "$http",
    "$timeout",
    function($http,$timeout){
        function resolveTemplate(tElement, tAttrs){
            var tepmlates,result,col=3,default_item;
            templates=[
                '<div class="{{ctrl.itemclass}}">\
                    <select size="1" ng-model="ctrl.province" class="form-control">\
                        <option value="000000" > {{ctrl.itemdefault[0]}} </option>\
                        <option value="{{province.value}}" ng-repeat="province in ctrl.provinces" ng-selected="ctrl.province==province.value">{{province.text}}</option>\
                    </select>\
                </div>',
                '<div class="{{ctrl.itemclass}}">\
                    <select size="1" ng-model="ctrl.city" class="form-control">\
                        <option value="000000" > {{ctrl.itemdefault[1]}} </option>\
                        <option value="{{city.value}}" ng-repeat="city in ctrl.cities" ng-selected="ctrl.city==city.value">{{city.text}}</option>\
                    </select>\
                </div>',
                '<div class="{{ctrl.itemclass}}">\
                    <select size="1" ng-model="ctrl.county" class="form-control">\
                        <option value="000000" > {{ctrl.itemdefault[2]}} </option>\
                        <option value="{{county.value}}" ng-repeat="county in ctrl.counties" value="county.value" ng-selected="ctrl.county==county.value">{{county.text}}</option>\
                    </select>\
                </div>'
            ];
            result="";
            col=parseInt(tAttrs.col);
            if (col){
               for(var i=0;i<col;i++){
                    result+=templates[i];
               }     
            }else{
                result=templates.join('');
            }
            
            return result;
        };
        return {
          restrict: 'EA',
          scope: {

          },
          bindToController:{
            areaid:'=',
            position:'=',
            itemclass:'@',
            col:'@',
            itemdefault:'=?',
            setdefault:'=?',
            isinit:'='
          },
          
          template: resolveTemplate,
                    
          controller: ["$scope",function($scope){
                var self;
                this.data=[];
                this.provinces=[];
                this.cities=[];
                this.counties=[];
                this.province="";
                this.city="";
                this.county="";
                this.position=[];
                this.initFlag=true;
                this.itemdefault=this.itemdefault || ['省份','城市','地区'];
                this.setdefault=!this.setdefault? false : true ;//自动选取第一个区域
                self=this;

                //获取某个省或某个市的县/市
                function getChildren(data,id){
                    for (var i=0;i<data.length;i++){
                        if (data[i].value==id){
                            return data[i].children||[];
                        }
                    }
                    return [];  
                }

                //设置物理地址
                function setAddress(){
                    // console.log(self.province)
                    // if (self.col=="1"){
                    //     self.areaid=self.province;
                    // }else if(self.col=="2"){
                    //     self.areaid=self.city;
                    // }else{
                    //     self.areaid=self.county;
                    // }
                    self.areaid = Number(self.county) || Number(self.city) || Number(self.province);
                    
                    self.position=getAddress(self.data,self.areaid);
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

                //初始化省市区信息
                function setForm(id){
                    if (!id){
                        id="000000";
                    };
                    id +="";
                    self.province=id.substring(0,2)+"0000";
                    self.city=id.substring(0,4)+"00";
                    self.county=id;
                    self.provinces=self.data;
                }

                //获取某个省的所有市
                function getCities(val){
                    if (parseInt(val,10)){
                        self.cities=getChildren(self.data,val);
                        if (!self.initFlag||!parseInt(self.city,10)){
                            self.city=self.setdefault?self.cities[0].value:"000000";
                        }
                    }else{
                        self.city="000000";
                        self.county="000000";
                        self.cities=[];
                        self.counties=[];
                    }
                }

                //获取某个市的所有县区
                function getCounties(val){
                    if (parseInt(val,10)){
                        self.counties=getChildren(self.cities,val);
                        if (self.initFlag){
                            self.initFlag=!self.initFlag;
                            if (!parseInt(self.county,10)){
                                self.county=self.setdefault?self.counties[0].value:"000000";
                            }
                        }else{
                            self.county=self.setdefault?self.counties[0].value:"000000";
                        }
                        
                    }else{
                        self.county="000000";
                        self.counties=[];
                    }
                }

                //省市区联动
                function setRelation(){
                    $scope.$watch('ctrl.province',function(val){
                        console.log(val)
                        getCities(val);
                        setAddress();
                    });

                    $scope.$watch('ctrl.city',function(val){
                        getCounties(val);
                        setAddress();
                    });

                    $scope.$watch('ctrl.county',function(val){
                        if(parseInt(val,10)){
                            setAddress();
                        }else {
                            self.areaid=self.city;
                        }
                    });
                }

                //初始化
                var init = function(){
                    var idwatch=$scope.$watch('ctrl.areaid',function(val){
                        if (val){
                            idwatch();//注销watch
                            setRelation();
                            setForm(val);
                        }
                    })
                }

                this.setForm=setForm;
                this.init=init;
          }],
          controllerAs: 'ctrl',
          link: function(scope,element,attrs,ctrl){        
            //加载城市数据
            $http.get(config.API_ROOT + '/mall/shop/get_city').success(function(data){
                ctrl.data=data.data;
                ctrl.init();
                
            }).error(function(data){

            });
            
            scope.$watch('ctrl.areaid',function(val){
                console.log(val)
                if(val && scope.ctrl.isinit){
                    ctrl.setForm(val);
                }
            })

          }
        }
    }
]);