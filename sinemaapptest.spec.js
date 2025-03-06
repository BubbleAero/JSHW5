const { clickElement, putText, getText } = require("./lib/commands.js");
const { generateName } = require("./lib/util.js");

let page;

describe("Sinema booking app test", () => {
    beforeEach(async () => {
        page = await browser.newPage();
        await page.goto("http://qamid.tmweb.ru/client/index.php");
    }, 70000);

    afterEach(async () => {
        await page.close();
    });

    test("Successfull booking Stalker for tomorrow for one person", async () => {
        await clickElement(page, "a:nth-child(2)");
        await clickElement(page, "body > main > section:nth-child(1) > div.movie-seances__hall > ul > li > a");
        const buyingSchema = "div.buying-scheme";
        await page.waitForSelector(buyingSchema, { timeout: 50000 });
        const place = ".buying-scheme__wrapper > :nth-child(1) > :nth-child(6)";
        await clickElement(page, place);
        await clickElement(page, "button");
        const result = "h2";
        await page.waitForSelector(result);
        const filmName = [await getText(page, "div > p:nth-child(1) > span")];
        const actual = filmName;
        const expected = ["\"Сталкер(1979)\""];
        expect(actual).toEqual(expected);
    }, 60000);
    
    test("Successfull booking Stalker four days later for two people", async () => {
      await clickElement(page, "a:nth-child(5)");
      await clickElement(page, "body > main > section:nth-child(1) > div.movie-seances__hall > ul > li > a");
      
      const buyingSchema = "div.buying-scheme";
      await page.waitForSelector(buyingSchema, { timeout: 10000 });
  
      const firstSeat = "body > main > section > div.buying-scheme > div.buying-scheme__wrapper > div:nth-child(2) > span:nth-child(5)";
      const secondSeat = "body > main > section > div.buying-scheme > div.buying-scheme__wrapper > div:nth-child(2) > span:nth-child(6)";
      await clickElement(page, firstSeat);
      await clickElement(page, secondSeat);
  
      await clickElement(page, "button");
  
      const result = "h2";
      await page.waitForSelector(result, { timeout: 10000 });
  
      await page.waitForSelector("div > p:nth-child(1) > span", { timeout: 100000 });
      const actual = [await getText(page, "div > p:nth-child(1) > span")];
      const expected = ["\"Сталкер(1979)\""];
  
      await clickElement(page, "body > main > section > div > button");
  
      expect(actual).toEqual(expected);
  }, 60000);
  
    test("Unsuccessful booking of Stalker if the seat is busy", async () => {
      await clickElement(page, "body > nav > a:nth-child(5)");
      await clickElement(page, "body > main > section:nth-child(1) > div.movie-seances__hall > ul > li > a");
  
      const buyingSchema = "div.buying-scheme";
      await page.waitForSelector(buyingSchema, { timeout: 90000 });
      const occupiedSeat = ".buying-scheme__wrapper > :nth-child(2) > :nth-child(5)"; 
      await page.waitForSelector(occupiedSeat, { timeout: 90000 });
  
      const isTaken = await page.$eval(occupiedSeat, (el) => el.classList.contains("buying-scheme__chair_taken"));
      expect(isTaken).toBe(true);
  
      const bookButton = "button";
      const isDisabled = await page.$eval(bookButton, (btn) => btn.disabled);
      expect(isDisabled).toBe(true);
  }, 50000);
  
  
    test("Unsuccessful booking of Stalker for today's morning when the time has passed", async () => {
      const moscowTime = new Date().toLocaleTimeString("ru-RU", { timeZone: "Europe/Moscow" });
      const [hours] = moscowTime.split(":").map(Number);
  
      if (hours < 13) {
          console.log("Тест не актуален, время меньше 13:00 МСК");
          return;
      }
  
      await clickElement(page, "nav > a.page-nav__day.page-nav__day_today.page-nav__day_chosen");
      const disabledSession = "a.movie-seances__time.acceptin-button-disabled";
      await page.waitForSelector(disabledSession);
      const isDisabled = await page.$(disabledSession) !== null;
      expect(isDisabled).toBe(true);
  }, 50000);  

});