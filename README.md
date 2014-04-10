Enjin
=====

A quick cli angular module generator.

use the following command to generate a basic angularjs scaffolding.

```enjin [appname] [modulename]```

This will generate angular module using the `appname` and `moduleName`

```
enjin SampleApp Issues
```

will generate files in the following fashion

```js
angular.module('SampleApp.Issues.controllers.IssuesListController', []) {

}
```