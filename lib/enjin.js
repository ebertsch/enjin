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

        fs.writeFile(location + '/' + name + '.js', moduleJs);
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
            mkdirp(basePath + '/tests', function () {
                cb();
            });
        }
    ], function () {
        //create files
        writeCreateFile('module.js', basePath, options.moduleName, options);
        writeCreateFile('module.config.js', basePath, options.moduleName + '.config', options);
        writeCreateFile('module.routes.js', basePath, options.moduleName + '.routes', options);
        writeCreateFile('module.resolvers.js', basePath, options.moduleName + '.resolvers', options);
        writeCreateFile('module.resources.js', basePath, options.moduleName + '.resources', options);

        //Generator Controllers container
        writeCreateFile('module.controllers.js', basePath + '/controllers', '_module.js', options);

        //Generator Controllers
        writeCreateFile('module.listController.js', basePath + '/controllers', options.moduleName + 'ListController', options);
        writeCreateFile('module.editController.js', basePath + '/controllers', options.moduleName + 'EditController', options);
    });

});

//TODO: Implement Sample Filter
//TODO: Implement Views
//TODO: Implement Sample Service
//TODO: Implement Sample Directive
//TODO: Implement Tests
//TODO: Implement cli
//TODO: Implement Config Files
