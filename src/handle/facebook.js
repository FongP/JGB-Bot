import {
    int,
    er,
    warn,
    fb
} from "../logger.js";
export default function (api){
    global.api = api
    api.listenMqtt((err, event) => {
        if(err) return er(err);
        api.setOptions({
            forceLogin: true,
            listenEvents: true,
            selfListen: true
            });
            async function handle(event, api) {
                switch (event.type) {
                    case "message_reply":
                    case "message":
                        if(event.attachments.length != 0){
                            fb(JSON.stringify(event, null, 4));
                        }
                        else{
                            fb(`[${event.senderID} đến ${event.threadID}] : ${event.body}`);
                        }
                        break;
                    case "event": 
                        break;
                    default:
                }
                if(event.body != undefined && event.body.slice(0,global.config.prefix.length) == global.config.prefix){
                    global.arg = event.body.slice(global.config.prefix.length).trim().split(/ +/);
                    var cm = event.body.slice(global.config.prefix.length, event.body.length);
                    var ms = cm.split(" ");
                    var ccm = false;
                    global.datam = {};
                    if(cm == "help"){
            
                    }
                    if(global.plugins.command[ms[0]] != undefined){
                        try{
                            var requireCM = import(global.plugins.command[ms[0]].dir)
                            var func = global.plugins.command[ms[0]].func
                            global.langm = global.plugins.lang[ms[0]]
                            try {
                                var thread = await api.getThreadInfo(event.threadID);
                                var adminIDs = thread.adminIDs
                                var admin = []
                                for(let i of adminIDs) {
                                    admin.push(
                                        i.id
                                    )
                                }
                            } catch (error) {
                                er(error)
                            }
                            if(global.plugins.command[ms[0]].adminbot == true && global.plugins.command[ms[0]].adminthread == true) {
                                if (global.config.login.facebook.admin.indexOf(event.senderID) != -1 || admin.indexOf(event.senderID) != -1) {
                                    return (await requireCM)[func](event, api)
                                } else {
                                    api.sendMessage(global.lang.Donothavepermission, event.threadID, event.messageID);
                                }
                            } else if (global.plugins.command[ms[0]].adminbot == true) {
                                if (global.config.login.facebook.admin.indexOf(event.senderID) != -1) {
                                    return (await requireCM)[func](event, api)
                                } else {
                                    api.sendMessage(global.lang.Donothavepermission, event.threadID, event.messageID);
                                }
                            } else if (global.plugins.command[ms[0]].adminthread == true) {
                                if (admin.indexOf(event.senderID) != -1) {
                                    return (await requireCM)[func](event, api)
                                } else {
                                    api.sendMessage(global.lang.Donothavepermission, event.threadID, event.messageID);
                                }
                            } else {
                                return (await requireCM)[func](event, api)
                            }
                        }
                        
                        catch(err){
                            er("["+global.plugins.command[ms[0]].namePlugin+"] "+err)
                            api.sendMessage(err , event.threadID, event.messageID);
                        }
                        ccm = true
                    }
                    if (!ccm) {
                        api.sendMessage(global.lang.ErrHelp.replace("{0}", global.config.prefix) , event.threadID, event.messageID);
                }
                }
            }
            handle(event, api)
    })
};