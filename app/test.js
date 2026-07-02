const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('response', response => {
    if (!response.ok()) {
      console.log('PAGE RESPONSE ERROR:', response.status(), response.url());
    }
  });

  try {
    console.log('Navigating to http://localhost:5173/dashboard');
    await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle0', timeout: 10000 });
    console.log('Done waiting. Checking page content...');
    
    const bodyHTML = await page.evaluate(() => document.body.innerHTML);
    if (bodyHTML.includes('id="root"')) {
       console.log('Root element exists.');
    } else {
       console.log('No root element.');
    }
  } catch (e) {
    console.log('NAVIGATION ERROR:', e.message);
  } finally {
    await browser.close();
  }
})();
