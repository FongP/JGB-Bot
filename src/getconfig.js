import fs from "fs"
import path from "path"
import stripBom from "strip-bom"
import {
    int,
    er,
    warn,
    fb,
    load
} from "./logger.js"
const originalconfig = {
    botname: "JABD",
    admin: "",
    prefix: "/",
    login: {
        facebook: {
            email: "",
            password: "",
            twofa: "",
            enablefb: false,
            enablefbstate: false,
            admin: [
                ""
            ]
        }
    },
    lang: "en_US"
}
export default function () {
    if (fs.existsSync("./config.json")) {
        int('Config File Exists!');
        try{
            var rt = JSON.parse(stripBom(fs.readFileSync(path.join( "config.json"), {encoding: "utf8"})));
            return rt;
        } catch (err){
            er(err);
            er("[ERROR] Cannot Read Config File! Please check your system and try again...");
            process.exit();
        }
    } else if (!fs.existsSync("./config.json")) {
        er('[ERROR] Config File Not Found!');
        warn('Creating Config File...');
        try{
            fs.writeFileSync(path.join( "config.json"), JSON.stringify(originalconfig, null, 4)); 
            int('Created Config File Successfully!');
        } catch (_) {
            er("[ERROR] Cannot create config file!");
        }
        try{
            var rt = JSON.parse(stripBom(fs.readFileSync(path.join( "config.json"), {encoding: "utf8"})));
            return rt;
        } catch (err){
            er(err);
            er("[ERROR] Cannot Read Config File! Please check your system and try again...");
            process.exit();
        }
    }
}
