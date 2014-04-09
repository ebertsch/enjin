#! /usr/bin/env node
var fs = require('fs');
var hb = require('handlebars');
var mkdirp = require('mkdirp');
var async = require('async');
var inflection = require('inflection');
var rimraf = require('rimraf');

var userArgs = process.argv.slice(2); //trim node arguments

hb.registerHelper('upperpluralize', function (str) {
    return inflection.capitalize(inflection.pluralize(str));
});
hb.registerHelper('pluralize', function (str) {
    return inflection.pluralize(str);
});
hb.registerHelper('singularize', function (str) {
    return inflection.singularize(str);
});
hb.registerHelper('uppersingularize', function (str) {
    return inflection.capitalize(inflection.singularize(str));
});
hb.registerHelper('capitalize', function (str) {
    return inflection.capitalize(str);
});
hb.registerHelper('camelize', function (str, lower) {
    return inflection.camelize(str, lower);
});


var options = {
    appsDir: 'apps',
    appName: userArgs.length == 2 ? userArgs[0] : 'app',
    moduleName: userArgs[1] || userArgs[0] || 'items'
};

var writeCreateFile = function (template, location, name, data) {
    fs.readFile(__dirname + '/templates/' + template, 'utf8', function (error, fileContent) {
        if (error) {
            return console.log(error);
        }

        var moduleTemplate = hb.compile(fileContent);
        var moduleJs = moduleTemplate(data);

        fs.writeFile(location + '/' + name, moduleJs);
    });
};

var basePath = options.appsDir + '/' + options.appName + '/' + options.moduleName;

//clean working directory first
rimraf(basePath, function () {

    async.parallel([
        function (cb) {
            mkdirp(basePath + '/controllers', function () {
                cb();
            });
        },
        function (cb) {
            mkdirp(basePath + '/services', function () {
                cb();
            });
        },
        function (cb) {
            mkdirp(basePath + '/directives', function () {
                cb();
            });
        },
        function (cb) {
            mkdirp(basePath + '/views', function () {
                cb();
            });
        },
        function (cb) {
            mkdirp(basePath + '/filters', function () {
                cb();
            });
        },
        function (cb) {
            mkdirp(basePath + '/tests', function () {
                cb();
            });
        }
    ], function () {
        //create files
        writeCreateFile('module.js', basePath, options.moduleName + ".js", options);
        writeCreateFile('module.config.js', basePath, options.moduleName + '.config.js', options);
        writeCreateFile('module.routes.js', basePath, options.moduleName + '.routes.js', options);
        writeCreateFile('module.resolvers.js', basePath, options.moduleName + '.resolvers.js', options);
        writeCreateFile('module.resources.js', basePath, options.moduleName + '.resources.js', options);

        //Generator Controllers container
        writeCreateFile('module.controllers.js', basePath + '/controllers', '_module.js', options);

        //Generate Controllers
        writeCreateFile('module.listController.js', basePath + '/controllers', options.moduleName + 'ListController.js', options);
        writeCreateFile('module.editController.js', basePath + '/controllers', options.moduleName + 'EditController.js', options);

        //Generate Views
        writeCreateFile('module.list.html', basePath + '/views', 'list.html', options);
        writeCreateFile('module.edit.html', basePath + '/views', 'edit.html', options);

        //Generate Filters
        writeCreateFile('module.filters.js', basePath + '/filters', '_module.js', options);
        writeCreateFile('module.filter.js', basePath + '/filters', options.moduleName + 'Type.js', options);

        //Generate Services
        writeCreateFile('module.services.js', basePath + '/services', '_module.js', options);
        writeCreateFile('module.service.js', basePath + '/services', options.moduleName + 'Manager.js', options);

        //Generate Directives
        writeCreateFile('module.directives.js', basePath + '/directives', '_module.js', options);
        writeCreateFile('module.directive.js', basePath + '/directives', options.moduleName + '.js', options);
        writeCreateFile('module.directive.html', basePath + '/views', options.moduleName + '_directive.html', options);
    });

});

//TODO: Implement Sample Filter
//TODO: Implement Sample Service
//TODO: Implement Sample Directive
//TODO: Implement Tests
//TODO: Implement cli
//TODO: Implement Config Files
