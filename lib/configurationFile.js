var fs = require('fs');
var path = require('path');
var EnjinConfPath = "./EnjinConf.json";
var inquirer = require("inquirer");
var _ = require('underscore');

exports.getConf = function () {
    var wd = path.join(process.cwd(), EnjinConfPath);

    return require(wd);
};

exports.saveConf = function (conf) {
    fs.writeFile(EnjinConfPath, JSON.stringify(conf, null, 4), function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Enjin config create at %s", EnjinConfPath);
        }
    });
};

exports.create = function (applicationName, options) {
    var config = {

        appsDir: options.appsDir,
        publicDir: options.publicDir,
        models: {},
        modules: {}
    };
    if (applicationName) {
        config.appName = applicationName;
        return exports.saveConf(config, options);
    }

    inquirer.prompt([
        {type: 'input', name: 'applicationName', message: 'What is the application name? (no spaces)'}
    ], function (answers) {
        if (!answers.applicationName) {
            return process.exit(0);
        }

        applicationName = answers.applicationName;
        config.appName = applicationName;

        return exports.saveConf(config, options);
    });

};

exports.getUndefinedModels = function () {
    var config = this.getConf();

    var models = _.keys(config.models);

    var definedModels = [];
    _.each(config.modules, function (module) {
        definedModels = _.union(definedModels, module.modelDefs);
    });

    return _.difference(models, definedModels);
};

exports.getAllModels = function () {
    var config = this.getConf();

    return _.keys(config.models);
};


exports.getModelsForModule = function (module) {
    var config = this.getConf();

    if (!config["modules"][module])
        return [];

    return config["modules"][module]["modelDefs"];
};