var configurationFile = require('./configurationFile');
var request = require('request');
var _ = require('underscore');
var inquirer = require("inquirer");

var events = require('events');
var util = require('util');

function ModelCreationCli(name, url) {
    this.name = name;
    this.url = url;
    this.fields = {};
    this.keys = [];

    events.EventEmitter.call(this);

    this.getModelName = function () {
        var parent = this;
        if (parent.name) {
            return parent.emit('Model name populated');
        }
        inquirer.prompt([
            {type: 'input', name: 'name', message: 'What is the name of this model?'}
        ], function (answers) {
            if (answers.name === '') {
                return self.emit('exit');
            }

            parent.name = answers.name;
            return parent.emit('Model name populated');
        });
    };
    this.getModelUrl = function () {
        var parent = this;
        if (parent.url) {
            return parent.emit('Url name populated');
        }

        inquirer.prompt([
            {type: 'input', name: 'url', message: 'What is the url of this model?'}
        ], function (answers) {
            if (answers.url === '') {
                return parent.emit('exit');
            }

            parent.url = answers.url;
            return parent.emit('Url name populated');
        });
    };
    this.getProcessingMode = function () {
        var parent = this;
        inquirer.prompt([
            {type: 'confirm', name: 'processUrl', message: 'Would you like to build the model from this url?'}
        ], function (answers) {
            if (answers.processUrl) {
                return parent.emit('url mode set');
            }

            return parent.emit('cli mode set');
        });
    };
    this.getSchemaFromUrl = function () {
        var parent = this;
        request(parent.url, function (error, response, body) {
            if (error) {
                return parent.emit('error', error);
            }

            var model = JSON.parse(body);

            if (model instanceof Array) {
                model = model[0];
            }

            var props = _.keys(model);

            _.each(_.keys(model), function (prop) {
                var isNumber = _.isNumber(model[prop]);
                var isDate = _.isDate(model[prop]);
                var isString = _.isString(model[prop]);

                if (isNumber) {
                    parent.fields[prop] = "Number";
                }
                if (isDate) {
                    parent.fields[prop] = "Date";
                }
                if (isString) {
                    parent.fields[prop] = "String";
                }
            });

            parent.emit('schema populated');
        });
    };
    this.getSchemaFromCli = function () {
        var parent = this;
        var types = ["String", "Number", "Date"];
        var populated = false;

        var getField = function () {
            inquirer.prompt([{type: "input", name: "name", message: 'What is the name of this field? (blank value to continue)'}], function (nameAnswer) {
                if (nameAnswer.name === "") {
                    if (!populated) {
                        return parent.emit('exit');
                    }

                    return parent.emit('schema populated');
                }
                inquirer.prompt([{type: "list", name: 'type', message: 'What type of field is this?', choices: types}], function (typeAnswer) {
                    populated = true;
                    parent.fields[nameAnswer.name] = typeAnswer.type;

                    getField();
                });
            });
        };

        getField();
    };
    this.getKeys = function() {
        var parent = this;
        var fieldChoices = _.keys(parent.fields, "name");
            fieldChoices.push('[End]');

        var getKeys = function() {
            inquirer.prompt([{type:"list", name:'name', message: 'What fields are unique identifiers?', choices:fieldChoices}], function(answers) {
                if(answers.name === "[End]") {
                    return parent.emit('ready to save');
                }

                parent.keys.push(answers.name);
                getKeys();
            });
        };
        getKeys();
    };

    this.on('Model name populated', function () {
        this.getModelUrl();
    });
    this.on('Url name populated', function () {
        this.getProcessingMode();
    });
    this.on('url mode set', function () {
        this.getSchemaFromUrl();
    });
    this.on('cli mode set', function () {
        this.getSchemaFromCli();
    });
    this.on('schema populated', function () {
        this.getKeys();
    });

    //run
    this.getModelName();
}

util.inherits(ModelCreationCli, events.EventEmitter);


exports.create = function (options) {
    var modelCli = new ModelCreationCli(options.modelName, options.url);
    var config = configurationFile.getConf(__dirname, options);

    modelCli.on('ready to save', function () {
        var cleanModel = _.pick(modelCli, 'url', 'keys', 'fields');
        config["models"][modelCli.name] = cleanModel;
        configurationFile.saveConf(config);
    });
    modelCli.on('error', function (error) {
        console.log('error: ' + error);
        process.exit(0);
    });
    modelCli.on('exit', function () {
        console.log('exiting...');
        process.exit(1);
    });
};

