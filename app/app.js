var app= angular.module('service-desk', ['ui.router','main','admin','employee']);

app.constant('API_URL', 'http://localhost:8080/');

app.config(($httpProvider, $stateProvider, $urlRouterProvider) => {
    $urlRouterProvider.otherwise('/main');

    $stateProvider
        .state('main', {
            url: '/main',
            templateUrl: "app/components/main/main.html"
        })

        .state('admin', {
            url: '/admin',
            templateUrl: "app/components/admin/admin.html",
            redirectTo: 'admin.employees'
        })
        .state('admin.employees', {
            url: '/employees',
            templateUrl: "app/components/admin/employees.html"
        })
        .state('admin.report', {
            url: '/report',
            templateUrl: "app/components/admin/report.html"
        })

        .state('employee', {
            url: '/employee',
            templateUrl: "app/components/employee/employee.html",
            redirectTo: "employee.clients"

        })
        .state('employee.clients', {
            url: '/clients',
            templateUrl: "app/components/employee/clients.html"
        })
        .state('employee.accounts', {
            url: '/accounts',
            templateUrl: "app/components/employee/accounts.html"
        })
        .state('employee.transfers', {
            url: '/transfers',
            templateUrl: "app/components/employee/transfers.html"
        })
});
