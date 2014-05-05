angular.module('{{appName}}.{{pluralize moduleName}}.directives.{{pluralize moduleName}}', [
])
    .constant("{{singularize moduleName}}Defaults", {
        "value1": 1
    })
    .controller("{{pluralize moduleName}}DirectiveController", ["$scope", function($scope) {
        //this is where you directive logic should live
        //not in the link function
        $scope.doStuff = function() {
            alert('do stuff');
        };
    }])
    .directive('{{pluralize moduleName}}', ["{{singularize moduleName}}Defaults", function({{singularize moduleName}}Defaults) {
       return {
           "restrict": "E",
           "controller": "{{pluralize moduleName}}DirectiveController",
           "templateUrl": "/{{singularize moduleName}}/views/{{pluralize moduleName}}_directive.html",
           "scope": {
               "SpecialProperty": "=attributeName"
           },
           "link": function(scope, ele, atts) {
               //Special Setup stuff here
               //Like running jquery methods
               // $(ele).jqueryPlugin Maybe
           }
       };
    }]);