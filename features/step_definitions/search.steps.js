const puppeteer = require("puppeteer");
const chai = require("chai");
const expect = chai.expect;
const { Given, When, Then, Before, After } = require("@cucumber/cucumber");
const { getText, clickElement } = require("../../lib/commands.js");

let browser;
let page;
let buyingSchema;
let place;

Before(async function () {
  browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized"],
  });
  page = await browser.newPage();
  this.browser = browser;
  this.page = page;
});

After(async function () {
  if (this.browser) {
    await this.browser.close();
  }
});

Given("пользователь на странице {string}", async function (url) {
  try {
    await this.page.goto(url, { timeout: 60000, waitUntil: "networkidle2" });
  } catch (error) {
    throw new Error(`Не удалось открыть страницу ${url}: ${error}`);
  }
});

When("переход на расписание следующего дня", async function () {
  await clickElement(this.page, "a:nth-child(2)");
});

When("переход на расписание через 4 дня от текущей даты", async function () {
  await clickElement(this.page, "a:nth-child(5)");
});

When("выбор сеанса фильма Сталкер на 13-00", async function () {
  await new Promise(r => setTimeout(r, 1000));  
  await clickElement(this.page, "body > main > section:nth-child(1) > div.movie-seances__hall > ul > li > a");
});

When("выбор места в зале 1 ряд 6 место", async function () {
  buyingSchema = "div.buying-scheme";
  await this.page.waitForSelector(buyingSchema);
  await new Promise(r => setTimeout(r, 500));  
  place = ".buying-scheme__wrapper > :nth-child(1) > :nth-child(6)";
  await clickElement(this.page, place);
  await clickElement(this.page, "button");
});

When("выбор места в зале 5 ряд 5, 6 места", async function () {
  buyingSchema = "div.buying-scheme";
  await this.page.waitForSelector(buyingSchema);
  const place1 = ".buying-scheme__wrapper > :nth-child(5) > :nth-child(5)";
  const place2 = ".buying-scheme__wrapper > :nth-child(5) > :nth-child(6)";
  await clickElement(this.page, place1);
  await new Promise(r => setTimeout(r, 500));  
  await clickElement(this.page, place2);
  await new Promise(r => setTimeout(r, 500));  
  await clickElement(this.page, "button.acceptin-button");
});

Then("результат бронирования", async function () {
  await new Promise(r => setTimeout(r, 1000));  
  const result = "h2";
  await this.page.waitForSelector(result);
  const actual = await getText(this.page, "div > p:nth-child(1) > span");
  const expected = "\"Сталкер(1979)\"";
  expect(actual).to.equal(expected);
});

Then("результат бронирования двух билетов", async function () {
  await new Promise(r => setTimeout(r, 1000));  
  await this.page.waitForSelector("h2");
  const actual = await getText(this.page, "div > p:nth-child(1) > span");
  const expected = "\"Сталкер(1979)\"";
  console.log(actual);
  expect(actual).to.equal(expected);
});

Then("покупка билета", async function () {
  await new Promise(r => setTimeout(r, 1000));  
  await this.page.waitForSelector("h2");
  await clickElement(this.page, "button");
  const actual = await getText(this.page, "h2");
  const expected = "Электронный билет";
  expect(actual).to.equal(expected);
});

When("переход на главную страницу кинотеатра {string}", async function (url) {
  try {
    await this.page.goto(url);
  } catch (error) {
    throw new Error(`Не удалось открыть страницу ${url}: ${error}`);
  }
});

Then("проверка, что кнопка Забронировать отключена", async function () {
  const bookButton = "button.acceptin-button";
  await this.page.waitForSelector(bookButton, { timeout: 10000 });

  const isDisabled = await this.page.$eval(bookButton, el => el.disabled);
  expect(isDisabled).to.be.true;
});




When("пользователь выбирает в обед утренний сеанс текущего дня", async function () {
  this.disabledSession = "a.movie-seances__time.acceptin-button-disabled";
});

Then("бронирование невозможно на неактивный сеанс", async function () {
  await this.page.waitForSelector(this.disabledSession);
  const isDisabled = await this.page.$(this.disabledSession) !== null;
  expect(isDisabled).to.be.true;
});
