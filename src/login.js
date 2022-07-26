import login from "fca-unofficial-force"
import fs from "fs"
import path from "path"
import npmlog from "npmlog"
import {
	int,
	er,
	warn,
	fb
} from "./logger.js"

export async function facebook() {
	if (global.config.login.facebook.enablefb == true) {
		const filelogin = fs.readdirSync(path.join( "loginfile"))
		if(filelogin.length == 0){
			er(('{"error":"Error retrieving userID. This can be caused by a lot of things, including getting blocked by Facebook for logging in from an unknown location. Try logging in with a browser to verify."}'))			
			er("Login file not found"),
			er("Please use J2Team or C3C login .json file..."),
			er("Shutting down bot...")
			process.exit()
		} else {
			for (var i = 0; i < filelogin.length; i++) {
					if (filelogin[i].endsWith(".json")) {
						var file = filelogin[i]
						var json = JSON.parse(fs.readFileSync(path.join("loginfile", file), 'utf8'));
						if (json.url && json.cookies) {
							warn("Found J2TEAM Login File...")
							let appstate = [];
							for ( const i of json.cookies) {
								appstate.push({
									key: i.name,
									value: i.value,
									expires: i.expirationDate || "",
									domain: i.domain.replace(".", ""),
									path: i.path
								})
							}
							npmlog.emitLog = () => {};
							return login({appState: JSON.parse(fs.readFileSync(appstate))}, async (err, api) => {
								if(err){
									er(JSON.stringify(err))
									er('Not logged in');
									return process.exit()
								}
								int('[FACEBOOK] Logged in with J2Team-Cookies! OwO');
								(await import("./handle/facebook.js")).default(api);
								return (await import("../globalserver.js")).default(api);
								})
						} else {
							warn("Found C3C Login File...")
							npmlog.emitLog = () => {};
							return login({appState: json}, async (err, api) => {
								if(err){
									er(err)
									er('Not logged in');
									return process.exit()
								}
								int('[FACEBOOK] Logged in with C3C-FBSTATE! OwO');
								(await import("./handle/facebook.js")).default(api);
								return (await import("../globalserver.js")).default(api);
							})
						}
					} else if (filelogin[i].endsWith(".txt")) {
						var atp = fs.readFileSync(path.join("loginfile", filelogin[i]), 'utf8');
						warn("Found ATP Login File...")
						const unofficialAppState = []
						const items = atp.split(";|")[0].split(";")
						if (items.length < 2) {
							er("[ERROR] Not a atp cookie")
							process.exit()
						}
						const validItems = ["sb", "datr", "c_user", "xs"]
						let validCount = 0
						for (const item of items) {
							const key = item.split("=")[0]
							const value = item.split("=")[1]
							if (validItems.includes(key)) validCount++
							unofficialAppState.push({
								key,
								value,
								domain: "facebook.com",
								path: "/"
							})
						}
						if (validCount >= validItems.length) {
							npmlog.emitLog = () => {};
							return login({appState: JSON.parse(fs.readFileSync(unofficialAppState))}, async (err, api) => {
								if(err){
									er(JSON.stringify(err))
									er('Not logged in');
									return process.exit()
								}
								int('[FACEBOOK] Logged in with ATP-Cookies! OwO');
								(await import("./handle/facebook.js")).default(api);
								return (await import("../globalserver.js")).default(api);
							})
						} else {
							er("[ERROR] Not a ATP cookie")
						}
					} else {
						setTimeout(function () {
							er((' {"error":"Error retrieving userID. This can be caused by a lot of things, including getting blocked by Facebook for logging in from an unknown location. Try logging in with a browser to verify."}'))
							er("Login file not found!"),
							er("Please use J2Team or C3C login .json file..."),
							er("Shutting down bot...")}, 3000)
							process.exit()
					}
				}
			}
	} else {
		int('Everything is fine, bot is running but not logged in! UwU');
	}
}
