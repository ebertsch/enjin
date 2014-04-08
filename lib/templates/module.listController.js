angular.module('{{appName}}.{{pluralize moduleName}}.controllers.{{pluralize moduleName}}ListController', [

])
    .controller('{{pluralize moduleName}}ListController', ['$scope', '{{pluralize moduleName}}', function($scope, {{pluralize moduleName}}) {
        $scope.{{pluralize moduleName}} = {{pluralize moduleName}};

        $scope.remove = function ({{singularize moduleName}}) {
            var itemIndex = $scope.{{pluralize moduleName}}.indexOf({{singularize moduleName}});
            {{singularize moduleName}}.deleting = true;

            var {{singularize moduleName}}ToDelete = angular.copy({{singularize moduleName}});

            {{singularize moduleName}}Delete.$delete(function () {
                $scope.{{pluralize moduleName}}.splice(itemIndex, 1);
            }, function (error) {
                {{singularize moduleName}}.deleting = false;
            });
        };
    }]);