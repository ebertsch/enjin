var fs = require('fs');
var path = require('path');
var EnjinConfPath = "./EnjinConf.json";

exports.getConf = function() {
    var wd = path.join(process.cwd(), EnjinConfPath);

    return require(wd);
};

exports.saveConf = function(conf) {
    fs.writeFile(EnjinConfPath, JSON.stringify(conf, null, 4), function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Enjin config create at %s", EnjinConfPath);
        }
    });
};

exports.create = function (applicationName, options) {
    applicationName = applicationName || 'app';

//    if (options.parent.verbose) {
//        console.log('   creating configuration file.', applicationName);
//        console.log('   public dir: %s', options.publicDir);
//    }

    var config = {
        appName: applicationName,
        appsDir: options.appsDir,
        publicDir: options.publicDir,
        models: [],
        modules: []
    };

    exports.saveConf(config, options);
};