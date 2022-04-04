const puppeteer = require('puppeteer-extra')
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha')

puppeteer.use(
  RecaptchaPlugin({
    provider: {
      id: '2captcha',
      // token: '5b3b45a9664fd175329db611ade1c89f',
      token: '5b3b45a9664fd175329db611ade1c89c',

    },
    visualFeedback: true
  })
)

// puppeteer usage as normal
puppeteer.launch({ headless: false }).then(async browser => {
  const page = await browser.newPage()
  await page.goto('https://www.google.com/recaptcha/api2/demo')

  await page.solveRecaptchas()

  await Promise.all([
    page.waitForNavigation(),
    page.click(`#recaptcha-demo-submit`)
  ])
  await page.screenshot({ path: 'response.png', fullPage: true })
  await browser.waitForTarget(() => false)
  await browser.close()
})