let admin = angular.module('admin', ['ui.router']);

admin.service('employeeChannel', function () {
    let employee = null;

    let addEmployee = function (e) {
        employee = e;
    };

    let getEmployee = function () {
        return employee;
    };

    return {
        addEmployee: addEmployee,
        getEmployee: getEmployee
    };

});
admin.controller('adminController', $scope => {
    $scope.navElements = [
        {
            state: 'admin.employees',
            name: 'Employees'
        }, {
            state: 'admin.report',
            name: 'Report'
        }
    ];
    $scope.nav = 'app/customnav.html';
});

admin.controller('adminEmployeesController', ($http, $scope, employeeChannel) => {

    $http.get("http://localhost:8080/employees")
        .success(function (data) {
            $scope.employees = data;
        }).catch(function (error) {
        console.log(error)
    });

    $scope.deleteEmployee = index => {
        let employee = $scope.employees[index].username;
        $http.delete("http://localhost:8080/employees/" + employee)
            .then(function (response) {
                $scope.employees.splice(index, 1);
            })
            .catch(function (response) {
            })
    };

    $scope.insertEmployee = () => {
        let newEmployee = {
            username: $scope.newUsername,
            password: $scope.newPassword
        };
        $http.post("http://localhost:8080/employees", newEmployee)
            .then(function successCallback(response) {
                $scope.employees.push(newEmployee);
                $scope.insertSuccess = 2;
            }, function errorCallback(response) {
                $scope.insertSuccess = 1;
            });
    };

    $scope.updateEmployee = index => {
        let employee = $scope.employees[index];

        $http.put("http://localhost:8080/employees/" + employee.username, {password: employee.password})
            .then(function successCallback(response) {
                console.log('Success')
            }, function errorCallback(response) {
                $scope.updateDeleteSuccess = 1;
            });
    };

    $scope.logs = index => {
        let employee = $scope.employees[index];
        employeeChannel.addEmployee(employee);
    };
});


admin.controller('adminReportController', ($http, $scope, employeeChannel) => {

    $scope.logs = [];

    $scope.report = () => {
        let employee = employeeChannel.getEmployee().username;
        $http.get("http://localhost:8080/logs?employee=" + employee + "&from=" + $scope.from + '&to=' + $scope.to)
            .then(function success(response) {
                $scope.logs = response.users;
            }, function errorCallback(response) {
                console.log("Not found");
            });
    };

});