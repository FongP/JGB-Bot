import fs from "fs"
import path from "path"
import {
    int,
    er,
    warn,
    fb,
    load
} from "./src/logger.js"


int('Thanks for using this bot!');
int('This Bot Made By JustGonDev, Tnam0312 and HungVu. No Global-Ban!')
warn('Please report any bugs to https://www.facebook.com/JustGonDev/')
console.log('')

if(process.version.slice(1)[0] + process.version.slice(1)[1] < 16) {
    er('Node.js version must be greater than 16.x!');
    warn('Please update your Node.js version to 16.x by download on website https://nodejs.org/en/ or using command "npm run upgrade-node"!');
    process.exit(0);
}

if(process.arch != 'x64') {
    er('This bot only works on PC 64-bit');
    warn('Please Install 64-bit operating system')
    process.exit();
}
global.config = (await import("./src/getconfig.js")).default();
global.data = (await import("./src/getdata.js")).default();
global.lang = (await import("./src/getlang.js")).default();
global.package = JSON.parse(fs.readFileSync(path.join("package.json")));

(await import("./src/getlogin.js")).default();

import('./src/server.js')

setInterval(function(){
    try{
        fs.writeFileSync(path.join("data.json"), JSON.stringify(global.data, null, 4)); 
    } catch (err){
        console.error("Unable to sync Data with error: "+err);
    }
}, 5*1000);

(await import('./src/loadfunc.js')).default();
(await import('./src/login.js')).facebook()
