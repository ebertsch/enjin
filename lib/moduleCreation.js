var configurationFile = require('./configurationFile');
var request = require('request');
var _ = require('underscore');
var inquirer = require("inquirer");

var events = require('events');
var util = require('util');

function ModuleCreationCli(moduleName, parentModuleName) {
    this.moduleName = moduleName;
    this.parentModuleName = parentModuleName;
    this.modelDefs = [];
    this.primaryModel = null;
    this.modelRefs = [];

    events.EventEmitter.call(this);

    this.getModuleName = function () {
        var parent = this;
        if (parent.name) {
            return parent.emit('Module name populated');
        }
        inquirer.prompt([
            {type: 'input', name: 'name', message: 'What is the name of this module?'}
        ], function (answers) {
            if (answers.name === '') {
                return parent.emit('exit');
            }

            parent.moduleName = answers.name;
            return parent.emit('Module name populated');
        });
    };
    this.getParentModuleName = function () {
        var parent = this;
        if (parent.parentModuleName) {
            return parent.emit('Parent module name populated');
        }

        inquirer.prompt([
            {type: 'input', name: 'parentModuleName', message: 'What is the parent of this module?'}
        ], function (answers) {
            if (answers.parentModuleName === '') {
                parent.parentModuleName = parent.moduleName;
            } else {
                parent.parentModuleName = answers.parentModuleName;
            }

            return parent.emit('Parent module name populated');
        });
    };
    this.getModelDefs = function() {
        var ui = new inquirer.ui.BottomBar();
        var parent = this;
        var fieldChoices = configurationFile.getUndefinedModels();
        fieldChoices.push('[Next]');

        var getDefs = function() {
            if(parent.modelDefs.length > 0) {
                ui.log.write("referenced models: " + parent.modelDefs.join(", "));
            }
            inquirer.prompt([{type:"list", name:'name', message: 'What models are defined in this module?', choices:fieldChoices}], function(answers) {
                if(answers.name === "[Next]") {
                    return parent.emit('Model definitions set');
                }

                parent.modelDefs.push(answers.name);
                var position = fieldChoices.indexOf(answers.name);
                fieldChoices.splice(position, 1);
                getDefs();
            });
        };
        getDefs();
    };
    this.getPrimaryModel = function() {
        var parent = this;
        var fieldChoices = configurationFile.getAllModels();
        fieldChoices.push('[Next]');

        inquirer.prompt([{type:"list", name:'name', message: 'What is the primary model used in this module?', choices:fieldChoices}], function(answers) {
            if(answers.name !== "[Next]") {
                parent.primaryModel = answers.name;
                parent.modelRefs.push(answers.name); //Add the default primary model reference.
            }
            return parent.emit('Primary model set');
        });

    };
    this.getModelRefs = function() {
        var ui = new inquirer.ui.BottomBar();

        var parent = this;
        var fieldChoices = configurationFile.getAllModels();
        fieldChoices.push('[Next]');

        //remove Primary Model
        var primaryModelPosition = fieldChoices.indexOf(this.primaryModel);
        if(primaryModelPosition > -1) {
            fieldChoices.splice(primaryModelPosition,1);
        }

        var getModelRefs = function() {
            ui.log.write("referenced models: " + parent.modelRefs.join(", "));
            inquirer.prompt([{type:"list", name:'name', message: 'What models are referenced in this module?', choices:fieldChoices}], function(answers) {
                if(answers.name === "[Next]") {
                    return parent.emit('ready to save');
                }

                parent.modelRefs.push(answers.name);
                var position = fieldChoices.indexOf(answers.name);
                fieldChoices.splice(position, 1);

                getModelRefs();
            });
        };
        getModelRefs();
    };


    this.on('Module name populated', function () {
        this.getParentModuleName();
    });
    this.on('Parent module name populated', function () {
        this.getModelDefs();
    });
    this.on('Model definitions set', function () {
        this.getPrimaryModel();
    });
    this.on('Primary model set', function () {
        this.getModelRefs();
    });


    //run
    this.getModuleName();
}

util.inherits(ModuleCreationCli, events.EventEmitter);


exports.create = function (options) {
    var moduleCli = new ModuleCreationCli(options.moduleName, options.parentModuleName);
    var config = configurationFile.getConf(__dirname, options);


    moduleCli.on('ready to save', function () {
        if(!config["modules"][moduleCli.parentModuleName]) {
            config["modules"][moduleCli.parentModuleName] = {subModules:{}};
        }
        //Set the model Defs
        var cleanedModuleDefs = _.pick(moduleCli, 'modelDefs');
        cleanedModuleDefs.modelDefs = _.union(cleanedModuleDefs.modelDefs || [], configurationFile.getModelsForModule(moduleCli.parentModuleName) || []);
        config["modules"][moduleCli.parentModuleName]["modelDefs"] = cleanedModuleDefs.modelDefs;

        //Save the subModule
        var cleanedSubModule = _.pick(moduleCli, 'primaryModel', 'modelRefs');
        config["modules"][moduleCli.parentModuleName]["subModules"][moduleCli.moduleName] = cleanedSubModule;

        configurationFile.saveConf(config);
    });
//    moduleCli.on('error', function (error) {
//        console.log('error: ' + error);
//        process.exit(0);
//    });
//    moduleCli.on('exit', function () {
//        console.log('exiting...');
//        process.exit(1);
//    });
};

