angular.module('{{appName}}.{{pluralize moduleName}}.resources', [
    'ngResource',
    '{{appName}}.{{pluralize moduleName}}.config'
])
    .factory('{{singularize moduleName}}Resources', ['$resource', '{{singularize moduleName}}EndPoints',
        function ($resource, {{singularize moduleName}}EndPoints) {
            return {
                "{{upperpluralize moduleName}}": $resource({{singularize moduleName}}EndPoints.{{moduleName}}, {"{{singularize moduleName}}Id": "@{{singularize moduleName}}Id"})
            };
        }]);