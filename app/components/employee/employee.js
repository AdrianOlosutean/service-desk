var employee = angular.module('employee', ['ui.router', 'ui.bootstrap']);

employee.controller('employeeController', $scope => {
    $scope.navElements = [
        {
            state: 'employee.clients',
            name: 'Clients'
        }/*/, {
         state: 'employee.accounts',
         name: 'Accounts'
         }, {
         state: 'employee.transfers',
         *!/name: 'Transfers'
         }*/
    ];
    $scope.nav = 'app/customnav.html';
});

employee.service('logService', function($rootScope, $http) {

    let loggFunc = function(activity,description){
        let logg = {
            activity: activity,
            description: description,
            employee: $rootScope.user.username
        };
        $http.post("http://localhost:8080/logs",logg)
            .then(function successCallback(response) {
                console.log('Logging');
            }, function errorCallback(response) {
                console.log('No log');
            });
    };

    return {
        activityLog: loggFunc
    };
});


employee.service('accountsChannel', function () {
    let client = null;

    let addAccounts = function (cl) {
        client = cl;
    };

    let getClient = function () {
        return client;
    };

    return {
        addClient: addAccounts,
        getClient: getClient
    };

});

employee.controller('employeeClientsController', ($scope, $http, accountsChannel, logService) => {

    $http.get("http://localhost:8080/clients")
        .success(function (data) {
            $scope.clients = data;
        }).catch(function (error) {
        console.log(error)
    });

    $scope.removeClient = index => {
        let ssn = $scope.clients[index].ssn;
        $http.delete("http://localhost:8080/clients/" + ssn)
            .then(function (response) {
                logService.activityLog("REMOVE CLIENT", "");
                $scope.clients.splice(index, 1);
                $scope.updateDeleteSuccess = 2;
            })
            .catch(function (response) {
                $scope.updateDeleteSuccess = 1;
            })
    };

    $scope.insertClient = newClient => {
        $http.post("http://localhost:8080/clients", newClient)
            .then(function successCallback(response) {
                logService.activityLog("INSERT CLIENT", "");
                $scope.insertSuccess = 2;
                $scope.clients.push(newClient);
            }, function errorCallback(response) {
                $scope.insertSuccess = 1;
            });

    };

    $scope.updateClient = index => {
        let client = $scope.clients[index];
        if (!client.email)
            client.email = '';
        if (!client.address)
            client.address = '';
        $http.put("http://localhost:8080/clients/" + client.ssn, client)
            .then(function successCallback(response) {
                logService.activityLog("UPDATE CLIENT", "");
                $scope.updateDeleteSuccess = 2;
            }, function errorCallback(response) {
                $scope.updateDeleteSuccess = 1;
            });
    };

    $scope.gotoAccounts = index => {
        let client = $scope.clients[index];
        accountsChannel.addClient(client);
    }

});

employee.controller('employeeAccountsController', ($state, $scope, $http, accountsChannel,logService) => {

    $scope.accounts = accountsChannel.getClient().accounts;
    $scope.accountIds = $scope.accounts.map(r => r.accountId);

    $scope.deleteAccount = index => {
        let accountId = $scope.accounts[index].accountId;
        let ssn = accountsChannel.getClient().ssn;
        $http.delete("http://localhost:8080/accounts/" + accountId)
            .then(function (response) {
                logService.activityLog("DELETE ACCOUNT", "");
                $scope.accounts.splice(index, 1);
            })
            .catch(function (response) {
            })
    };

    $scope.addAccount = () => {
        let account = {
            type: $scope.type,
            moneyAmount: $scope.initialAmount
        };

        let ssn = accountsChannel.getClient().ssn;
        $http.post("http://localhost:8080/clients/" + ssn + "/accounts/", account)
            .then(function successCallback(response) {
                logService.activityLog("INSERT ACCOUNT", "");
                $scope.clients.push(response.users);
            }, function errorCallback(response) {
                $scope.accountError = true;
            });
    };

    $scope.transfer = () =>{
        let transf = {
            sender: parseInt($scope.sender),
            receiver: parseInt($scope.receiver),
            amount: parseFloat($scope.transferAmount)
        };
        $http.post("http://localhost:8080/transaction/", transf)
            .then(function successCallback(response) {
                logService.activityLog("TRANSFER", "");
                $scope.transferSuccess = 2;
            }, function errorCallback(response) {
                $scope.transferSuccess = 1;
            });
    };

    $scope.payBill = () =>{
        let bill = {
            accountId: $scope.payer,
            description: $scope.description,
            sum: parseFloat($scope.billSum)
        };
        $http.post("http://localhost:8080/bill/", bill)
            .then(function successCallback(response) {
                logService.activityLog("PAY BILL", "");
                $scope.paySuccess = 2;
                console.log("Payed");
            }, function errorCallback(response) {
                $scope.paySuccess = 1;
            });

    }

});
