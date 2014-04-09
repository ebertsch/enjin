angular.module('{{appName}}.{{pluralize moduleName}}.services.{{pluralize moduleName}}Manager', [])
    .factory("{{pluralize moduleName}}Manager", [function() {
        var internalMethod = function() {};

        return {
            "publicMethod": internalMethod
        };
    }]);