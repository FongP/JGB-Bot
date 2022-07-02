import login from "fca-unofficial-force"
import fs from "fs"
import path from "path"
import npmlog from "npmlog"
import puppeteer from "puppeteer"
import twofactor from "node-2fa"
import {
	int,
	er,
	warn,
	fb
} from "./logger.js"

export async function facebook() {
	if (global.config.login.facebook.enablefb == true) {
		if (global.config.login.facebook.enablefbstate == true) {
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
								return (await import("./handle/facebook.js")).default(api) 
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
								return (await import("./handle/facebook.js")).default(api) 
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
								return (await import("./handle/facebook.js")).default(api) 

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
			int('[FACEBOOK] Logging in with email pass');
			warn("Vui lòng tự điền mã 2FA...")
			;(async () => {
				const browser = await puppeteer.launch({
				headless: false,
				args: [
					'--disable-web-security',
					'--disable-features=IsolateOrigins,site-per-process',
					'--no-sandbox', 
					'--disable-setuid-sandbox',
					"--flag-switches-begin", 
					"--enable-webgl-draft-extensions",
					"--enable-features=SharedArrayBuffer", 
					"--disable-features=AsmJsToWebAssembly",
					"--flag-switches-end"
				]
			})
			const context = browser.defaultBrowserContext()

			context.overridePermissions('https://mbasic.facebook.com', [
				'geolocation',
				'notifications',
			])

			const page = await browser.newPage()

			await page.goto('https://mbasic.facebook.com', {
				waitUntil: ['load', 'networkidle2'],
			})

			await (await page.$('[name="email"]')).type(global.config.login.facebook.email)
			await (await page.$('[name="pass"]')).type(global.config.login.facebook.password)
			await (await page.$('[name="login"]')).click()

			const keypress = async () => {
				process.stdin.setRawMode(true)
				return new Promise(resolve => process.stdin.once('data', () => {
				process.stdin.setRawMode(false)
				resolve()
				}))
			}

			console.log("Login trên web xong thì nhấn enter trên console...")
			await keypress()

			await page.reload()

			var cookie = await page.cookies()

			fs.writeFileSync(path.join("loginfile", "fbstate.json"), JSON.stringify(cookie))
			var json = JSON.parse(fs.readFileSync(path.join("loginfile", "fbstate.json")))
			npmlog.emitLog = () => {};
			let appstate = [];
			for ( const i of json) {
				appstate.push({
					key: i.name,
					value: i.value,
					expires: i.expires || "",
					domain: i.domain.replace(".", ""),
					path: i.path
				})
			}
			return login({appState: appstate}, async (err, api) => {
				if(err){
					er(err)
					er('Not logged in');
					return process.exit()
				}
				int('[FACEBOOK] Logged in with email and pass! OwO');
				return (await import("./handle/facebook.js")).default(api) 
			})
			})();
		}
	} else {
		int('Everything is fine, bot is running but not logged in! UwU');
	}
}
