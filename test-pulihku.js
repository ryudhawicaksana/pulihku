const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ARTIFACTS_DIR = '/Users/ltdinfyudha/.gemini/antigravity-ide/brain/4109cc48-5a9f-4f6e-a5fd-15c71fdf7baf';
const SCREENSHOTS_DIR = path.join(ARTIFACTS_DIR, 'screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function run() {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  // Capture console messages
  page.on('console', msg => {
    console.log(`[Browser Console] ${msg.type()}: ${msg.text()}`);
  });

  // Capture page errors
  page.on('pageerror', err => {
    console.error(`[Browser PageError] ${err.toString()}`);
  });

  try {
    console.log('Navigating to https://pulihku.netlify.app/...');
    await page.goto('https://pulihku.netlify.app/', { waitUntil: 'networkidle' });
    
    let currentUrl = page.url();
    console.log(`Current URL: ${currentUrl}`);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '1-initial.png') });

    // Fill registration form if on onboarding page
    if (currentUrl.includes('/onboarding')) {
      console.log('On onboarding/registration page.');

      // Check if registration fields exist
      const hasRegister = await page.$('input[placeholder="Nama Lengkap Anda"]');
      if (hasRegister) {
        console.log('Filling Nama Lengkap...');
        await page.fill('input[placeholder="Nama Lengkap Anda"]', 'Test User');
        
        console.log('Filling Umur...');
        await page.fill('input[placeholder="Contoh: 22"]', '25');

        console.log('Filling Email...');
        await page.fill('input[type="email"]', `test-${Date.now()}@example.com`);

        console.log('Filling Password...');
        await page.fill('input[type="password"]', 'password123');

        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '2-filled-form.png') });

        console.log('Clicking Daftar & Mulai...');
        await page.click('button:has-text("Daftar & Mulai")');
        await page.waitForTimeout(4000);
      }
    }

    console.log(`Current URL after registration: ${page.url()}`);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '3-after-signup.png') });

    // Answer the questionnaire steps dynamically
    let stepCount = 0;
    while (stepCount < 12) {
      stepCount++;
      const isQuestionPage = await page.$('button:has-text("Lanjut"), button:has-text("Mulai Pemulihan")');
      const isNicknamePage = await page.$('input[placeholder*="nama"], input[placeholder*="Nama"]');
      
      if (isNicknamePage) {
        console.log('Nickname page reached inside loop!');
        break;
      }
      
      if (isQuestionPage) {
        console.log(`Answering questionnaire step ${stepCount}...`);
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `4-step-${stepCount}.png`) });

        // Click first option
        const options = await page.$$('button:not(:has-text("Kembali")):not(:has-text("Lanjut")):not(:has-text("Mulai"))');
        if (options.length > 0) {
          await options[0].click();
          await page.waitForTimeout(500);
        }

        const nextBtn = await page.$('button:has-text("Lanjut"), button:has-text("Mulai Pemulihan")');
        if (nextBtn) {
          await nextBtn.click();
          await page.waitForTimeout(2000);
        }
      } else {
        console.log('Not on question page and not on nickname page. Waiting...');
        await page.waitForTimeout(2000);
        const stillNot = !await page.$('button:has-text("Lanjut"), button:has-text("Mulai Pemulihan")') && !await page.$('input[placeholder*="nama"], input[placeholder*="Nama"]');
        if (stillNot) {
          console.log('Questionnaire flow finished (no next button or nickname input).');
          break;
        }
      }
    }

    // Now look for Nickname step: "Email terverifikasi! Sekarang, tentukan nama panggilan..."
    await page.waitForTimeout(2000);
    const nicknameInput = await page.$('input[placeholder*="nama"], input[placeholder*="Nama"]');
    if (nicknameInput) {
      console.log('Nickname page detected. Entering nickname...');
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '5-nickname-page.png') });
      await nicknameInput.fill('Buddy');
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '6-nickname-filled.png') });
      
      console.log('Clicking Mulai Perjalanan Saya...');
      await page.click('button:has-text("Mulai Perjalanan Saya")');
      await page.waitForTimeout(5000);
    }

    // Go to Dashboard
    console.log('Verifying Dashboard...');
    currentUrl = page.url();
    console.log(`Current URL: ${currentUrl}`);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '7-dashboard.png') });

    // Panic Button test
    console.log('Testing Panic Button...');
    const panicButton = await page.$('button:has-text("Panic Button"), button:has-text("SOS")');
    if (panicButton) {
      await panicButton.click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '8-panic-modal.png') });
      // Close modal
      const closeBtn = await page.$('button:has-text("Tutup"), button:has-text("Kembali"), button:has-text("✕")');
      if (closeBtn) {
        await closeBtn.click();
      } else {
        await page.keyboard.press('Escape');
      }
      await page.waitForTimeout(1000);
    }

    // Navigate to Jejak
    console.log('Navigating to Jejak...');
    await page.goto('https://pulihku.netlify.app/jejak', { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '9-jejak.png') });

    // Navigate to AI Sahabat
    console.log('Navigating to AI Sahabat...');
    await page.goto('https://pulihku.netlify.app/ai', { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '10-ai.png') });
    
    // Type in AI chat
    console.log('Sending message to AI...');
    const chatInput = await page.$('input[placeholder*="Tulis"], textarea[placeholder*="Tulis"]');
    if (chatInput) {
      await chatInput.fill('Saya merasa sangat stres hari ini');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(4000);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '11-ai-chat-response.png') });
    }

    // Navigate to Akademi
    console.log('Navigating to Akademi...');
    await page.goto('https://pulihku.netlify.app/akademi', { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '12-akademi.png') });

    // Navigate to Komunitas
    console.log('Navigating to Komunitas...');
    await page.goto('https://pulihku.netlify.app/komunitas', { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '13-komunitas.png') });

    // Navigate to Safe Browse
    console.log('Navigating to Safe Browse...');
    await page.goto('https://pulihku.netlify.app/safe-browse', { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '14-safe-browse.png') });

  } catch (err) {
    console.error('Error during test execution:', err);
  } finally {
    await browser.close();
    console.log('Browser closed. Test finished.');
  }
}

run();
