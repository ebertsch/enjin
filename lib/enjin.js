#! /usr/bin/env node
var program = require('commander');
var pjson = require('../package.json');
var configurationFile = require('./configurationFile');
var angularModule = require('./angularModule');
var modelCreation = require('./modelCreation');
var moduleCreation = require('./moduleCreation');


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
    .description('create Enjin configuration file.')
    .option('-a, --apps-dir [Applications Directory]', 'Applications directory for AngularJS.', '.')
    .option('-p, --web-public-dir [Web Public Directory]', 'Public web directory for AngularJS.', '/public/js/')
    .action(configurationFile.create);

program
    .command('create-model')
    .description('create a model for enjin for use in AngularJS.')
    .option('-u, --url [url]', 'Create model from url result')
    .option('-n, --modelName [model name]', 'Set the model name.')
    .action(modelCreation.create);

program
    .command('create-module')
    .description('create a module definition for enjin for use in AngularJs')
    .option('-n, --module-name', 'Sets a module name')
    .option('-m, --parent-module-name', 'Sets the parent module. if not supplied then the module name will be used.')
    .action(moduleCreation.create);

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


//enjin init SampleApp
//enjin init SampleApp -s //stub mode populate with sample tasks model and sample tasks module and run generate.

//enjin create-mode/ //prompt for values
//enjin create-model -n tasks -u /tasks/:id

//enjin create-module -m issues -n issues
//-n will use -m if not supplied. but will be prompted first

//enjin combust -a  -tfsd
//-a all modules
//-m module name