angular.module('{{appName}}.{{pluralize moduleName}}.controllers.{{pluralize moduleName}}EditController', [

])
    .controller('{{pluralize moduleName}}EditController', ['$scope', '$location', '{{singularize moduleName}}', function($scope, $location, {{singularize moduleName}}) {
        $scope.{{singularize moduleName}} = {{singularize moduleName}};

        $scope.save = function ({{singularize moduleName}}) {
            $scope.processingRequest = true;

            var itemToSave = angular.copy($scope.{{singularize moduleName}});

            itemToSave.$save(function (result) {
                $scope.processingRequest = false;
                $location.path('/{{pluralize moduleName}}');
            }, function (error) {
                $scope.processingRequest = false;
            });


        };
    }]);



