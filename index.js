// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");

async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  const urls = [
    'https://news.ycombinator.com/newest',
    'https://news.ycombinator.com/newest?next=41996620&n=31',
    'https://news.ycombinator.com/newest?next=41996256&n=61',
    'https://news.ycombinator.com/newest?next=41995919&n=91'
  ];

  let allArticles = [];
  
  for (const url of urls) {
    await page.goto(url);
    await page.waitForSelector('tr .athing');

    const pageArticles = await page.evaluate(() => {
      const rows = document.querySelectorAll('tr .athing');
      return Array.from(rows).map((row) => {
        const id = parseInt(row.id);
        const subtext = row.nextElementSibling;
        const timeElement = subtext.querySelector('.age');
        const time = timeElement ? timeElement.getAttribute('title') : null;
        return { id, time };
      });
    });

    allArticles = allArticles.concat(pageArticles);

    if (allArticles.length >= 100) break;
  }

  allArticles = allArticles.slice(0, 100);

  console.log(allArticles.map((row, index) => ({index, ...row})));

  // Iterate through allArticle object, testing that it is sorted newest to oldest
  let isSorted = true;
  for (let i = 1; i < allArticles.length; i++) {
    if (!allArticles[i].time || !allArticles[i - 1].time) {
      console.log(`Warning: Missing timestamp for article ${allArticles[i].id} or ${allArticles[i-1].id}`);
      continue;
    }
    const prevTime = new Date(allArticles[i - 1].time);
    const currTime = new Date(allArticles[i].time);
    if (prevTime < currTime) {
      isSorted = false;
      console.log(`Sorting error at article ${i}: ${allArticles[i-1].id} is older than ${allArticles[i].id}`);
      break;
    }
  }

  // Test result console message
  if (isSorted) {
    console.log('PASS: The first 100 articles are correctly sorted from newest to oldest.');
  } else {
    console.log('FAIL: The first 100 articles are not correctly sorted from newest to oldest.');
  }

  await browser.close();
}

(async () => {
  await sortHackerNewsArticles();
})();
