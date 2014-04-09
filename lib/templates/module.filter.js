angular.module('{{appName}}.{{pluralize moduleName}}.filters.{{pluralize moduleName}}Type', [])
    .filter(function () {
        return function (input) {
            if (!angular.isNumber(input)) {
                return input;
            }

            switch(input) {
                case 1:
                    return "value 1";
                case 2:
                    return "value 2";
                case 3:
                    return "value 3";
            }

        };
    });