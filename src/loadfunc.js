import fs from "fs";
import path from "path";
import childProcess from "child_process";
import {
    int,
    er,
    warn,
    fb,
    load
} from "./logger.js"
//Scan Dir
function scanDir(type, link){
    var dirfile = fs.readdirSync(link);
    var arr = [];
    for (var i=0; i<dirfile.length; i++ ){
            if(dirfile[i].lastIndexOf(type) == dirfile[i].length-type.length){
                if(fs.lstatSync(path.join(link, dirfile[i])).isFile()){
                    arr.push(dirfile[i]);
                }
            }
    }
    return arr;
}
//Load Func
async function loadfunc(){
    !global.plugins ? global.plugins = {}:"";
    !global.plugins.command ? global.plugins.command = {}:"";
    !global.plugins.lang ? global.plugins.lang = {}:"";
    !global.noPrefix ? global.noPrefix = {}:"";
    var list = scanDir(".js", (import.meta.url, "..", "..", "func"));
    var listFile = [];
    for(var i=0; i<list.length; i++){
        var check = path.join(".", "func", list[i]);
        if (!fs.lstatSync(check).isDirectory()) {
            listFile.push(list[i]);
        }
    }
    var check = false;
    for(var i=0; i<listFile.length; i++){
        try{
            var pluginInfo = (await (import(`../func/${listFile[i]}`))).config()
            var t = loadpackage(listFile[i], pluginInfo);
            if(t != undefined){
                check = true;
            }
        }
        catch(err){
            //console.error(err);
        }
    }
    for(var i=0; i<listFile.length; i++){
        try{
            var pluginInfo = (await (import(`../func/${listFile[i]}`))).config()
            var t = loadpackage(listFile[i], pluginInfo);
            if(t != undefined){
                check = true;
            }
        }
        catch(err){
            //console.error(err);
        }
    }
    
    for(var i=0; i<listFile.length; i++){
        try{
            var pluginInfo = (await (import(`../func/${listFile[i]}`))).config()
            loadingfunc(listFile[i], pluginInfo);
        }
        catch(err){
            er("Không thể load \""+listFile[i]+"\" với lỗi: "+err)
            int(JSON.stringify(global.plugin))
            int(pluginInfo)
        }
    }
}

function loadingfunc(file, pluginInfo){
    //try{
        for(var i in pluginInfo.commandMap){
            !global.plugins.command[i] ? global.plugins.command[i] = {}:"";
            !global.plugins.command[i].help ? global.plugins.command[i].name = pluginInfo.name:"";
            !global.plugins.command[i].help ? global.plugins.command[i].more = pluginInfo.commandMap[i].more:"";
            !global.plugins.command[i].tag ? global.plugins.command[i].des = pluginInfo.commandMap[i].des:"";
            !global.plugins.command[i].author ? global.plugins.command[i].author = pluginInfo.author:"";
            !global.plugins.command[i].main ? global.plugins.command[i].dir = path.join(import.meta.url, "..", "..", "func", file):"";
            !global.plugins.command[i].mainFunc ? global.plugins.command[i].func = pluginInfo.commandMap[i].func:"";
            
        }
        for(var i in pluginInfo.langMap){
            !global.plugins.lang[i] ? global.plugins.lang[i] = pluginInfo.langMap[i]:"";
        }
            if(typeof pluginInfo.noPrefix == "string"){
                !global.noPrefix[pluginInfo.name] ? global.noPrefix[pluginInfo.name] = {
                    dir: path.join(import.meta.url, "..", "..", "func"+ file),
                    func: pluginInfo.noPrefix
                }:"";
            }
        load("Đã Load Thành Công Func : "+pluginInfo.name+" "+pluginInfo.version+" bởi "+pluginInfo.author)
    //}
    /*catch(err){
        console.error("Không thể load command \""+file+"\" với lỗi: "+err)
    }*/
}

//Load Package For Command
function loadpackage(file, pluginInfo){
    if(typeof pluginInfo.nodeDepends == "object"){
        for (var i in pluginInfo.nodeDepends){
            if (!fs.existsSync(".", "node_modules", i, "package.json")) {
                
                warn("Tiến hành cài đặt Module \""+i+"\" cho Func \""+pluginInfo.name+"\":\n");
                if(pluginInfo.nodeDepends[i] != ""){
                    childProcess.execSync(`npm install ${i}@${pluginInfo.nodeDepends[i]}`,{
                        stdio: "inherit"
                    })
                }
                else{
                    childProcess.execSync(`npm install ${i}`,{
                        stdio: "inherit"
                    })
                }
                return true;
            }
        }
    }
}
export default loadfunc;
