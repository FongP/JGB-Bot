export function config() {
    return{
        "name": "t",
        "main": "t.js",
        "commandMap": {
            "t": {
                "adminbot" : true,
                "adminthread" : true,
                "more": "",
                "des": "t",
                "func": "t"
            }
        },
        "langMap" : {
            "t": {
                "en_US": {
                    "text": "english"
                },
                "vi_VN": {
                    "text": "tiếng việt"
                }
            }
        },
        "nodeDepends":{
            "axios": ""
        },
        "author": "JustGon",
        "version": "0.0.1"
    }
}

export async function t(event, api) {
    api.sendMessage("hi",event.threadID)
    console.log(global.langm[global.config.lang].text)
}