angular.module('{{appName}}.{{pluralize moduleName}}.routes', [
    'ngRoute',
    '{{appName}}.{{pluralize moduleName}}.resolvers'
])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.
            when('/{{pluralize moduleName}}/create', {
                "templateUrl": '/{{pluralize moduleName}}/Views/edit',
                "controller": "{{pluralize moduleName}}EditController",
                "resolve": {
                    "{{singularize moduleName}}": ['resolve{{uppersingularize moduleName}}', function (resolve{{uppersingularize moduleName}}) {
                        return resolve{{uppersingularize moduleName}}(true);
                    }]
                }
            }).
            when('/{{pluralize moduleName}}/edit/:{{singularize moduleName}}Id', {
                "templateUrl": '/{{pluralize moduleName}}/Views/edit',
                "controller": "{{pluralize moduleName}}EditController",
                "resolve": {
                    "{{singularize moduleName}}": ['$route', 'resolve{{uppersingularize moduleName}}', function ($route, resolve{{uppersingularize moduleName}}) {
                        var {{singularize moduleName}}Id = $route.current.params.{{singularize moduleName}}Id;
                        return resolve{{uppersingularize moduleName}}(false, {{singularize moduleName}}Id);
                    }]
                }
            }).
            when('/{{pluralize moduleName}}', {
                "templateUrl": '/{{pluralize moduleName}}/Views/list',
                "controller": "{{pluralize moduleName}}ListController",
                "resolve": {
                    "{{pluralize moduleName}}": ['resolve{{upperpluralize moduleName}}', function (resolve{{upperpluralize moduleName}}) {
                        return resolve{{upperpluralize moduleName}}();
                    }]
                }
            });
    }]);
