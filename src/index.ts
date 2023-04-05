import { webkit, Page } from 'playwright'
import { goToLoginPage } from './functions/goToLoginPage'
import { userLogin } from './functions/userLogin'
import { passportAppointmentIsAvailable } from './functions/passport'
import fs from 'fs/promises'

import { bot } from './services/telegram'
import { telegramUsers } from './services/telegramUsers'

const auth = async (page: Page) => {
  await goToLoginPage(page)
  await userLogin(page)
  console.log('auth')
}

const run = async () => {
  const browser = await webkit.launch({ headless: true /* open browser */ })

  setInterval(async () => {
    for (const userId of telegramUsers) {
      await bot.telegram.sendMessage(userId, 'App running').catch()
    }
  }, 1000 * 60 * 60)

  try {
    const page = await browser.newPage()

    await auth(page)

    let loop = true
    do {
      try {
        const isAvailable = await passportAppointmentIsAvailable(page)
        console.log('trying access')

        if (isAvailable) {
          for (const userId of telegramUsers) {
            await bot.telegram.sendMessage(userId, 'Prenotami Agendamento do passporte disponível')
            console.log('System open')
            const pageContent = await page.content()
            await fs.writeFile('passportPage.html', pageContent)
          }
        }

        loop = !isAvailable
      } catch (error) {
        for (const userId of telegramUsers) {
          await bot.telegram.sendMessage(userId, (error as Error).message)
        }

        await auth(page)
      }
    } while (loop)

    await browser.close()
  } catch (error) {
    for (const userId of telegramUsers) {
      await bot.telegram.sendMessage(userId, (error as Error).message)
      await browser.close()
      run()
    }
  }
}

run()
