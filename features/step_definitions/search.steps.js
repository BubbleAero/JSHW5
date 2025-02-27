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
  await this.page.goto(url, { timeout: 60000 });
});

When("переход на расписание следующего дня", async function () {
  await clickElement(this.page, "a:nth-child(2)");
});

When("выбор сеанса фильма Сталкер", async function () {
  await this.page.waitForTimeout(1000);
  await clickElement(this.page, "body > main > section:nth-child(1) > div.movie-seances__hall > ul > li > a");
});

When("выбор места в зале 6 ряд 6 место", async function () {
  buyingSchema = "div.buying-scheme";
  await this.page.waitForSelector(buyingSchema);
  place = ".buying-scheme__wrapper > :nth-child(6) > :nth-child(6)";
  await clickElement(this.page, place);
  await clickElement(this.page, "button");
});

Then("результат бронирования фильма {string}", async function (film) {
  await this.page.waitForSelector("h2");
  const actual = [await getText(this.page, "div > p:nth-child(1) > span")];
  expect(actual).to.have.members([film]);
});

When("переход на расписание через 4 дня от текущей даты", async function () {
  await clickElement(this.page, "a:nth-child(5)");
});

When("выбор мест в зале 5 ряд 4 и 5 места", async function () {
  buyingSchema = "div.buying-scheme";
  await this.page.waitForSelector(buyingSchema);
  let place1 = ".buying-scheme__wrapper > :nth-child(5) > :nth-child(4)";
  let place2 = ".buying-scheme__wrapper > :nth-child(5) > :nth-child(5)";
  await clickElement(this.page, place1);
  await clickElement(this.page, place2);
  await clickElement(this.page, "button");
});

When("выбор занятого места в зале", async function () {
  buyingSchema = "div.buying-scheme";
  await this.page.waitForSelector(buyingSchema);
  place = "div.buying-scheme__wrapper .buying-scheme__chair_taken";
  await this.page.waitForSelector(place);
});

Then("бронирование невозможно", async function () {
  const isTaken = await this.page.$eval(place, el => el.classList.contains("buying-scheme__chair_taken"));
  expect(isTaken).to.be.true;

  const bookButton = "button";
  const isDisabled = await this.page.$eval(bookButton, btn => btn.disabled);
  expect(isDisabled).to.be.true;
});

When("переход на расписание текущего дня", async function () {
  await clickElement(this.page, "nav > a.page-nav__day.page-nav__day_today.page-nav__day_chosen");
});

When("выбор неактивного сеанса", async function () {
  await this.page.waitForSelector("a.movie-seances__time.acceptin-button-disabled");
});

