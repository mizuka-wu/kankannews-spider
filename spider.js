/**
 * 基于owentv生成一个更新直播源的文件
 */
const fs = require('fs')
const puppeteer = require('puppeteer')

/**
 * 抓取东方卫视的直播源 by https://live.kankanews.com/huikan/
 */
async function loadShanghaiLive (lives = []) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu']
  })
  try {
    console.log('browser launch')
    const page = await browser.newPage()
    await page.goto('https://live.kankanews.com/huikan/')
    console.log('page success', page)
    await page.waitForSelector('video')
    console.log('sleep success')
    // 加载对应的api
    const result = await page.evaluate(`
    const app = document.querySelector('.huikan').__vue__;
    app.channelList.map(channel => (\`\${channel.name},\${app.decryptStreamUrl(channel.live_address)}\`))
  `)
    console.log('result success', result)
    lives.push('东方卫视,#genre#')
    lives.push(...result)
  } catch (e) {
    console.error(e, '加载东方卫视失败')
  }
  await browser.close()

  return lives
}

async function generate() {
    const lives = [];
    await loadShanghaiLive(lives);

    if (!fs.existsSync('./dist')) fs.mkdirSync('dist');
    fs.writeFileSync('./dist/live.txt', lives.join('\n'));
}

module.exports = generate;
