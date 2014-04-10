Enjin (In Development not 100% stable)
=====

A quick cli angular module generator.

use the following command to generate a basic angularjs scaffolding.

```enjin [appName] [moduleName]```

This will generate angular modules using the `appName` and `moduleName`

```
enjin SampleApp Issues
```

will generate files in the following fashion

```js
angular.module('SampleApp.Issues', []) ;
angular.module('SampleApp.Issues.resources', []) ;
angular.module('SampleApp.Issues.controllers.IssuesListController', [])
    .controller("IssuesListController", ['$scope', 'Issues', function($scope, Issues) {
    }]);
angular.module('SampleApp.Issues.controllers.IssuesListController', [])
    .controller("IssuesEditController", ['$scope', 'issue', function($scope, issue) {
    }]);
```