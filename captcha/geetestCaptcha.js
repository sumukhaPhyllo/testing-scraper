const puppeteer = require("puppeteer-extra");
const RecaptchaPlugin = require("puppeteer-extra-plugin-recaptcha");
const Apify = require("apify");
const axios = require("axios").default;

const token = "5b3b45a9664fd175329db611ade1c89c";

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
  await page.goto("https://2captcha.com/demo/geetest");

  // await page.setRequestInterception(true);
  let data;
  // await page.setRequestInterception(true);
  // page.on('request', (request) => {
  //   // BLOCK IMAGES
  //   if (request.url().includes('api.geetest.com/get.php')){
  //     console.log('blocked')
  //     request.abort();
  //   }
  //   else
  //       request.continue();
  // });

  page.on("response", async (response) => {
    try {
      if (
        response.status() === 200 &&
        response
          .url()
          .startsWith("https://2captcha.com/api/v1/captcha-demo/gee-test")
      ) {
        const results = await response.json();
        if (results.gt && results.challenge) {
          const { data } = await axios.post(
            `https://2captcha.com/in.php/?key=${token}&method=geetest&gt=${results.gt}&challenge=${results.challenge}&pageurl=http://2captcha.com/demo/geetest`
          );
          setTimeout(async() => {
            const response = await axios.get(`https://2captcha.com/res.php?key=${token}&action=get&id=${data.substr(3)}`)
            console.log(response)
          }, 29000);
        }

        // https://2captcha.com/in.php?key=1abc234de56fab7c89012d34e56fa7b8&method=geetest&gt=929c4274113891610f91fecd8f98f84a&challenge=12345678abc90123d45678ef90123a456b&api_server=api-na.geetest.com&pageurl=http://2captcha.com/demo/geetest
      }
    } catch (e) {
      console.log(e);
    }
    console.log(data);
  });

  await page.waitForSelector(".geetest_radar_tip");
  // await page.evaluate(() => {
    // window.scrollBy(0, 100);
    // document.body.scrollTo(100, document.body)
    // document.querySelector(".geetest_radar_tip").click();
  // });

  // const response = await page.solveRecaptchas();
  // console.log(response);
  // await page.evaluate(() => {
  //   document.querySelector("button[type=submit]").click();
  // });
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
//   await page.goto('https://www.geetest.com/en/demo')

//   await page.evaluate(() => {
//     document.querySelector('.geetest_radar_tip').click()
//   });

//   await page.solveRecaptchas()

//   await browser.waitForTarget(() => false)
//   await browser.close()
// })
