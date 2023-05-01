require('log-timestamp')
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

const main = async () => {
  const browser = await webkit.launch({ headless: true /* open browser */ })

  let timeInterval = setInterval(async () => {
    for (const userId of telegramUsers) {
      await bot.telegram.sendMessage(userId, 'App running').catch()
    }
  }, 1000 * 60 * 60)

  try {
    const page = await browser.newPage()

    await auth(page)

    for (const userId of telegramUsers) {
      await bot.telegram.sendMessage(userId, 'The app just logged in').catch()
    }

    let loop = true
    let countError = 0
    do {
      try {
        const isAvailable = await passportAppointmentIsAvailable(page)
        console.log('trying access')

        if (typeof isAvailable === 'string') {
          countError++
        } else if (isAvailable) {
          for (const userId of telegramUsers) {
            await bot.telegram.sendMessage(userId, 'Prenotami Agendamento do passporte disponível').catch()
            console.log('System open')
            const pageContent = await page.content()
            await fs.writeFile('passportPage.html', pageContent)
          }
        }

        // loop = !isAvailable
        if (countError >= 5) {
          countError = 0
          throw new Error('user logout: LOGIN AGAIN')
        }
      } catch (error) {
        for (const userId of telegramUsers) {
          await bot.telegram.sendMessage(userId, (error as Error).message).catch()
        }

        if (countError >= 5) {
          throw new Error('reload main function ')
        }
      }
    } while (loop)
  } catch (error) {
    console.error('catch an error 👀: run message error: ' + (error as Error).message)
    for (const userId of telegramUsers) {
      await bot.telegram.sendMessage(userId, (error as Error).message).catch()
    }
    await browser.close().catch()
    clearInterval(timeInterval)
    main()
  }
}

main()
