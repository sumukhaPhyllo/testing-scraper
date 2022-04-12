const puppeteer = require("puppeteer");
// const RecaptchaPlugin = require("puppeteer-extra-plugin-recaptcha");
const Apify = require("apify");
const input = require("./input");

// puppeteer.use(
//   RecaptchaPlugin({
//     provider: {
//       id: "2captcha",
//       token: "5b3b45a9664fd175329db611ade1c89c",
//     },
//     visualFeedback: true,
//   })
// );

const launchContext = {
  launcher: puppeteer,
  launchOptions: { product: "firefox" },
};

Apify.main(async () => {
  const browser = await Apify.launchPuppeteer(launchContext);
  const page = await browser.newPage();
  await page.goto("https://substack.com/sign-in");
  await page.waitFor(500);

  await page.type("input[name=email]", input.email);
  await page.click(".login-option");
  await page.waitFor(500);
  await page.type("input[name=password]", input.password);
  await page.click("button[type=submit]");
  // await page.solveRecaptchas();

  await browser.waitForTarget(() => false);
});

// puppeteer.use(
//   RecaptchaPlugin({
//     provider: {
//       id: "2captcha",
//       // token: '5b3b45a9664fd175329db611ade1c89f',
//       token: "5b3b45a9664fd175329db611ade1c89c",
//     },
//     visualFeedback: true,
//   })
// );

// // puppeteer usage as normal
// puppeteer
//   .launch({ headless: false, product: "firefox" })
//   .then(async (browser) => {
//     const page = await browser.newPage();
//     await page.goto("https://substack.com/sign-in");

//     // await page.solveRecaptchas()

//     await browser.waitForTarget(() => false);
//     await browser.close();
//   });
