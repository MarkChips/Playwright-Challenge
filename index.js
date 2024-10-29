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
  const articles = await page.$$eval('.athing', (elements) => elements.slice(0, 100).map((el, index) => {
    const id = parseInt(el.id);
    let time = null;
    const ageElement = el.querySelector('.age a');
    // Conditional in case of missing time signature
    if (ageElement && ageElement.hasAttribute('title')) {
      time = ageElement.getAttribute('title');
    } else {
      console.log(`Warning: Could not find time for article ${index + 1} with id ${id}`);
    }
    return {id, time};
  }));

  // Iterate through article object, testing that it is sorted newest to oldest
  let isSorted = true;
  for (let i = 1; i < articles.length; i++) {
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
