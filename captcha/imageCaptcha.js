const puppeteer = require("puppeteer-extra");
const RecaptchaPlugin = require("puppeteer-extra-plugin-recaptcha");
const Apify = require("apify");

puppeteer.use(
  RecaptchaPlugin({
    provider: {
      id: "2captcha",
      token: "5b3b45a9664fd175329db611ade1c89c",
    },
    visualFeedback: true,
  })
);

const launchContext = {
  useChrome: true,
  launcher: puppeteer,
};

Apify.main(async () => {
  const browser = await Apify.launchPuppeteer(launchContext);
  const page = await browser.newPage();
  await page.goto(
    "https://www.jqueryscript.net/demo/image-puzzle-slider-captcha/"
  );

  await page.solveRecaptchas();
  await browser.waitForTarget(() => false);
});

// const puppeteer = require('puppeteer-extra')

// const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha')
// puppeteer.use(
//   RecaptchaPlugin({
//     provider: {
//       id: '2captcha',
//       // token: '5b3b45a9664fd175329db611ade1c89f',
//       token: '5b3b45a9664fd175329db611ade1c89c',

//     },
//     visualFeedback: true
//   })
// )

// // puppeteer usage as normal
// puppeteer.launch({ headless: false }).then(async browser => {
//   const page = await browser.newPage()
//   await page.goto('https://www.jqueryscript.net/demo/image-puzzle-slider-captcha/')

//   await page.solveRecaptchas()

//   await browser.waitForTarget(() => false)
//   await browser.close()
// })
