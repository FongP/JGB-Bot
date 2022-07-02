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

const originaldata = {}
export default function () { 
if (fs.existsSync("./data.json")) {
    int('Data File Exists!');
    try{
        var rt = JSON.parse(stripBom(fs.readFileSync(path.join("./data.json"), {encoding: "utf8"})));
        return rt;
    } catch (err){
        er(err);
        er("[ERROR] Cannot Read Data File! Please check your system and try again...");
        process.exit(100);
    }
} else if (!fs.existsSync("./data.json")) {
    er('[ERROR] Data File Not Found!');
    warn('Creating Data File...');
    try{
        fs.writeFileSync(path.join( "./data.json"), JSON.stringify(originaldata, null, 4)); 
        int('Created Data File Successfully!');
    } catch (_) {
        er("[ERROR] Cannot create data file!");
    }
    try{
        var rt = JSON.parse(stripBom(fs.readFileSync(path.join( "./data.json"), {encoding: "utf8"})));
        return rt;
    } catch (err){
        er(err);
        er("[ERROR] Cannot Read Data File! Please check your system and try again...");
        process.exit(100);
    }
}
}