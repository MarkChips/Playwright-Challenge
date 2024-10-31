// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");

async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Navigate to Hacker News newest page
  await page.goto('https://news.ycombinator.com/newest');

  let allArticles = [];

  while (allArticles.length < 100) {
    // Click the "More" button to load more articles
    await page.click('.morelink');

    // Wait for the article elements to load
    await page.waitForSelector('tr .athing');

    // Extract article information from the current page
    const pageArticles = await page.evaluate(() => {
      const rows = document.querySelectorAll('tr.athing');
      return Array.from(rows).slice(0, 100).map(row => {
        const id = parseInt(row.id);
        const subtext = row.nextElementSibling;
        const timeElement = subtext.querySelector('.age');
        // Extract the timestamp, or null if not found
        const time = timeElement ? timeElement.getAttribute('title') : null;
        return { id, time };
      });
    });

    allArticles = allArticles.concat(pageArticles);
  }

  allArticles = allArticles.slice(0, 100);

  // Log articles with their index for debugging
  console.log(allArticles.map((row, index) => ({index, ...row})));

  // Check if articles are sorted from newest to oldest
  let isSorted = true;
  for (let i = 1; i < allArticles.length; i++) {
    // Check for missing timestamps
    if (!allArticles[i].time || !allArticles[i-1].time) {
      console.log(`Warning: Missing timestamp for article ${allArticles[i].id} or ${allArticles[i-1].id}`);
      continue;
    }
    // Convert timestamps to Date objects for comparison
    const prevTime = new Date(allArticles[i-1].time);
    const currTime = new Date(allArticles[i].time);
    if (prevTime < currTime) {
      isSorted = false;
      console.log(`Sorting error at article ${i}: ${allArticles[i-1].id} is older than ${allArticles[i].id}`);
      break;
    }
  }

  // Log the final result of the sorting check
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
