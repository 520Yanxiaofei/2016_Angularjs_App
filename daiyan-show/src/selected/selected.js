angular.module("App.Selected", ["App.Selected.Draft","App.Selected.Competition","App.Selected.add", "App.Selected.Detail"]).controller("App.Selected.Controller", [
    "$scope",
    "$state",
    function(
        $scope,
        $state
    ) {
        $scope.onTouch = function() {
            $state.go("user");
        }
    }
])

//时间格式转换
.filter('Datediff', function() {
    return function(dates) {
        var d_Seconds, d_minutes, d_hours, d_days;
        var timeNow = parseInt(new Date().getTime() / 1000);
        var d;
        d = timeNow - dates;
        d_days = parseInt(d / 86400);
        d_hours = parseInt(d / 3600) ;
        d_minutes = parseInt(d / 60) ;
        d_Seconds = parseInt(d);
        if (d_days > 0 && d_days < 4) {
            return d_days + "天前";
        } else if (d_days <= 0 && d_hours > 0) {
            return d_hours + "小时前";
        } else if (d_hours <= 0 && d_minutes > 0) {
            return d_minutes + "分钟前";
        } else if (d_minutes <= 0 && d_Seconds > 0) {
            return "刚刚";
        } else {
            var s = new Date(dates * 1000);
            return s.getFullYear() + "-" + (s.getMonth() + 1) + "-" + s.getDate() + " " + s.getHours() + ":" + s.getMinutes();
        }

    }
});
