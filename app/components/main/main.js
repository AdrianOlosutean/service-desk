let main = angular.module('main', ['ui.router']);

main.controller('mainController', ($scope, $http, $rootScope, $state) => {

    $scope.invalidCredentials = false;
    $scope.nav = "app/customnav.html";

    $rootScope.logout = function () {
        $state.go('main');
        $rootScope.isLoggedIn = false;
        $rootScope.user = "";
    };

    $scope.login = function (user, pass) {

        $http.post("http://localhost:8080/authenticate", {username: user, password: pass})
            .then(function successCallback(response) {
                let user = response.users;
                let type = user.type;
                $rootScope.isLoggedIn = true;
                $rootScope.user = user;
                if (type === 'EMPLOYEE')
                    $state.go('employee.clients');
                else if (type === 'ADMIN')
                    $state.go('admin.employees')
            }, function errorCallback(response) {
                $scope.invalidCredentials = true;
            });
    }
});
