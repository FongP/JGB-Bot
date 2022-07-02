import puppeteer from 'puppeteer';
import axios from 'axios';
import {
    int,
    er,
    warn,
    fb
} from './logger.js';
export default function () {
;(async () => {
  var username = "kjnfdskjfd@gmail.com"
  var password = "kjnfdskjfd@gmail.com"
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
context.overridePermissions('https://www.spotify.com', [
    'geolocation',
    'notifications',
])
const page = await browser.newPage()
await page.goto('https://accounts.spotify.com/en/login?continue=https%3A%2F%2Fwww.spotify.com%2Fin-en%2Fpurchase%2Foffer%2Freusable-ambassador-trial-3m%2F%3Fmarketing-campaign-id%3Dambassador-q1-2022%26country%3DUS', {
    waitUntil: ['load', 'networkidle2'],
})
await	page.type('#login-username',username);
await	page.type('#login-password',password);
await	page.click("button[id='login-button']", { hidden: false });
while (true) {
  const response = await page.waitForNavigation({
      timeout: 0,
      waitUntil: ['load', 'networkidle2'],
  })
  if (!response) continue
  if (response.url() === 'https://www.spotify.com/in-en/purchase/offer/reusable-ambassador-trial-3m/?marketing-campaign-id=ambassador-q1-2022&country=US') {
    await page.reload({
        timeout: 0,
        waitUntil: ['load']
    })
    await page.waitForTimeout(3000)
    await page.type('#address-street','Freedom');
    await page.type('#address-city','New York')
    const selectElem = await page.$('select[id="address-state"]')
    await selectElem.type('New York');
    await page.type('#address-postal_code_short','10080');
    await page.click("li[class='sc-bYoCmx iazfkw']", { hidden: false });
    const iframe = await page.$("iframe[src = 'https://pci.spotify.com/static/form_no_selects.html']");
    const frame = await iframe.contentFrame();
    await frame.type('#cardnumber', '4100390044704514');
    await frame.type('#expiry-date','1022');
    await frame.type('#security-code','356');
    await page.click("button[class='Button-oyfj48-0 ipsaWH sc-fFehDp kGvAFP']", { hidden: false })
  }
  }
})();
}