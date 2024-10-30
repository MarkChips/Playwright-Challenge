// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");

async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");

  // Create an object containing 100 article ids and time signatures
  const articles = await page.evaluate(() => {
    const rows = document.querySelectorAll('tr .athing');
    return Array.from(rows).slice(0, 100).map((row, index) => {
      const id = parseInt(row.id);
      const subtext = row.nextElementSibling;
      const timeElement = subtext.querySelector('.age');
      const time = timeElement ? timeElement.getAttribute('title') : null;
      return { index, id, time };
    });
  });

  console.log(articles);

  // Iterate through article object, testing that it is sorted newest to oldest
  let isSorted = true;
  for (let i = 1; i < articles.length; i++) {
    if (!articles[i].time || !articles[i - 1].time) {
      console.log(`Warning: Missing timestamp for article ${articles[i].id} or ${articles[i-1].id}`);
      continue;
    }
    const prevTime = new Date(articles[i - 1].time);
    const currTime = new Date(articles[i].time);
    if (prevTime < currTime) {
      isSorted = false;
      console.log(`Sorting error at article ${i}: ${articles[i-1].id} is older than ${articles[i].id}`);
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
