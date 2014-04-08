angular.module('{{appName}}.{{pluralize moduleName}}.config', [
])
    .constant('{{singularize moduleName}}EndPoints', {
        "{{pluralize moduleName}}": "/api/{{pluralize moduleName}}/:{{singularize moduleName}}Id"
    });