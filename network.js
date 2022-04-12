const puppeteer = require("puppeteer-extra");
const RecaptchaPlugin = require("puppeteer-extra-plugin-recaptcha");
const Apify = require("apify");
const input = require("./input");

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
  launcher: puppeteer,
  useChrome: true,
};

const checkResponseAndAct = async (page, resp) => {
  const status = await resp.status();
  let text = await resp.text();
  text = JSON.parse(text);

  if (status === 200) {
    console.log("Everything went well bro");
    return;
  }

  if (text?.error === "Please complete the captcha to continue") {
    console.log("yep its asking for captcha bro");
    await page.waitFor(5000);
    // console.log('sent captcha to 2captchas')
    await page.solveRecaptchas();
    // console.log('get the captcha response')
    await page.click("button[type=submit]");
  }
};

Apify.main(async () => {
  try {
    const browser = await Apify.launchPuppeteer({ ...launchContext });
    const page = await browser.newPage();

    await page.goto("https://substack.com/sign-in");
    await page.waitForSelector("input[name=email]");

    await page.type("input[name=email]", input.email);
    await page.click(".login-option");

    await page.waitForSelector("input[name=password]");
    await page.type("input[name=password]", input.password);

    await page.waitForSelector("button[type=submit]");
    await page.click("button[type=submit]");

    const resp = await page.waitForResponse(
      (response) => response.url() === "https://substack.com/api/v1/login"
    );
    await checkResponseAndAct(page, resp);

    // await Promise.all([
    //   page.waitForNavigation(),
    //   page.click(`#recaptcha-demo-submit`),
    // ]);
    await browser.waitForTarget(() => false);
  } catch (e) {
    console.log(e);
  }
});
