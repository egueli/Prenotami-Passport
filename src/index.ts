import { webkit } from 'playwright'
import { goToLoginPage } from './functions/goToLoginPage'
import { userLogin } from './functions/userLogin'

import { bot } from './services/telegram'
import { telegramUsers } from './services/telegramUsers'

const run = async () => {
  const browser = await webkit.launch({ headless: false })
  const page = await browser.newPage()

  await goToLoginPage(page)
  await userLogin(page)

  // for (const userId of telegramUsers) {
  //   await bot.telegram.sendMessage(userId, 'eufrasio tips')
  // }

  await browser.close()
}

run()
