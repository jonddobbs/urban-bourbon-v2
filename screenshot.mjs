import puppeteer from 'puppeteer'
const BASE = 'http://localhost:5175'
const OUT  = 'C:/Users/jondd/OneDrive/Desktop'
const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
const page    = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
await page.goto(BASE, { waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 1500))

// Hero
await page.screenshot({ path: `${OUT}/v2-hero.png` })

// Drop section
await page.evaluate(() => document.querySelectorAll('section')[2]?.scrollIntoView({ behavior: 'instant' }))
await new Promise(r => setTimeout(r, 500))
await page.screenshot({ path: `${OUT}/v2-drop.png` })

// Full page
await page.evaluate(() => window.scrollTo(0, 0))
await new Promise(r => setTimeout(r, 400))
await page.screenshot({ path: `${OUT}/v2-fullpage.png`, fullPage: true })

await browser.close()
console.log('done')
