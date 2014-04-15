#! /usr/bin/env node
var program = require('commander');
var pjson = require('../package.json');
var configurationFile = require('./configurationFile');
var angularModule = require('./angularModule');
var models = require('./models');


var isVerbose = false;
function toggleVerbosity() {
    console.log('   enabling verbose mode');
    return isVerbose = true;
}

program
    .version(pjson.version)
    .option('-v, --verbose', 'enable verbose mode.', false);

program
    .command('init [Application Name]')
    .description('create Enjin configuration file with defaults')
    .option('-a, --apps-dir [Applications Directory]', 'Applications directory for AngularJS.', '.')
    .option('-p, --web-public-dir [Web Public Directory]', 'Public web directory for AngularJS.', '/public/js/')
    .action(configurationFile.create);

program
    .command('create-model')
    .description('create a model for enjin for use in AngularJS Views')
    .option('-u, --url [url]', 'Create model from url result')
    .option('-n, --modelName [model name]', 'Set the model name.')
    .action(models.create);

program
    .command('module [Module Name]')
    .description('create angularjs module. ')
    .option('-c, --module-container [moduleContainerName]', 'Name of the module container.')
    .option('-t, --create-tests [createTests]', 'Create AngularJs unit tests module.', false)
    .option('-f, --create-filters [createFilters]', 'Create AngularJs filters module.', false)
    .option('-s, --create-services [createServices]', 'Create AngularJs services module.', false)
    .option('-d, --create-directives [createDirectives]', 'Create AngularJs services module.', false)
    .action(angularModule.create);


program.parse(process.argv);

if (!program.args.length) {
    program.help();
}



//TODO: enable global verbose mode



//{
//    "appName": "appName",
//    "workingDir": ".",
//    "publicDir": "/public/js/",
//    "models": [{
//    "Name": "Issue",
//    "Module": "Issues",
//    "Schema": {}
//}],
//    "modules": [
//    {
//        "Container": "Issue",
//        "Issues": {
//            "primaryModel": "Issue",
//            "secondaryModels": ["IssueType"]
//        }
//    }]
//}

//Default
// { Id: string, value: string }


//enjin init SampleApp
//enjin model Issue -u http://localhost/issues
//enjin module Issues Issue
//Default Model is
// {id:int, name:string}