angular.module('{{appName}}.{{pluralize moduleName}}.resolvers', [
    'ngRoute',
    '{{appName}}.{{pluralize moduleName}}.resources'
])
    .factory('resolve{{upperpluralize moduleName}}', ['$q', '$timeout', '{{singularize moduleName}}Resources',
        function ($q, $timeout, {{singularize moduleName}}Resources) {
            var rest = {{singularize moduleName}}Resources;

            return function () {
                return rest.{{upperpluralize moduleName}}.query().$promise;
            };
        }])
    .factory('resolve{{uppersingularize moduleName}}', ['$q', '$timeout', '{{singularize moduleName}}Resources',
        function ($q, $timeout, {{singularize moduleName}}Resources) {
            var rest = {{singularize moduleName}}Resources;

            return function (createNew, {{singularize moduleName}}Id) {
                if (createNew) {
                    var defer = $q.defer();
                    $timeout(function () {
                        defer.resolve(new rest.{{upperpluralize moduleName}}({}));
                    }, 0);
                    return defer.promise;
                }

                return rest.{{upperpluralize moduleName}}.get({"{{singularize moduleName}}Id": {{singularize moduleName}}Id}).$promise;
            }
        }])