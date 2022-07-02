import fs from 'fs'
import path from 'path'
import stripBom from 'strip-bom'
export default function () {
return JSON.parse(stripBom(fs.readFileSync(path.join(`./lang/${global.config.lang}.json`), {encoding: "utf8"})));
}