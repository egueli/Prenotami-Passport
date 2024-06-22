require('log-timestamp')
import { webkit, Page } from 'playwright'
import { goToLoginPage } from './functions/goToLoginPage'
import { userLogin } from './functions/userLogin'
import { passportAppointmentIsAvailable } from './functions/passport'
import { setTimeout } from 'timers/promises'
import fs from 'fs/promises'

import { bot } from './services/telegram'
import { telegramUsers } from './services/telegramUsers'

const auth = async (page: Page) => {
  await goToLoginPage(page)
  await userLogin(page)
  console.log('auth')
}

async function sendTelegramMessage(message: string) {
  try {
    for (const userId of telegramUsers) {
      await bot.telegram.sendMessage(userId, message)
    }
    console.log(`Telegram message(s) sent: ${message}`)
  } catch (e) {
    console.log(`Unable to send Telegram message: ${(e as Error).message}`)
  }
}

const main = async () => {
  const browser = await webkit.launch({ headless: false /* open browser */ })
  const context = await browser.newContext()

  let timeInterval = setInterval(async () => {
    sendTelegramMessage('App running')
  }, 1000 * 60 * 60)

  try {
    await context.tracing.start({ screenshots: true, snapshots: true });
    const page = await browser.newPage()

    await auth(page)

    sendTelegramMessage('The app just logged in')

    let loop = true
    let countError = 0
    do {
      try {
        console.log(`trying access (countError=${countError})`)
        const isAvailable = await passportAppointmentIsAvailable(page)
        console.log(`isAvailable: ${isAvailable}`)

        if (typeof isAvailable === 'string') {
          countError++
        } else if (isAvailable) {
          sendTelegramMessage('Prenotami Agendamento do passporte disponível')
          console.log('System open')
          const pageContent = await page.content()
          await fs.writeFile('passportPage.html', pageContent)
      }

        // loop = !isAvailable
        if (countError >= 5) {
          countError = 0
          throw new Error('user logout: LOGIN AGAIN')
        }
      } catch (error) {
        sendTelegramMessage(`App error ${(error as Error).message}`)

        if (countError >= 5) {
          throw new Error('reload main function')
        }
      }

      await setTimeout(1000 * 60)
    } while (loop)
  } catch (error) {
    console.error('catch an error 👀: run message error: ' + (error as Error).message)
    await context.tracing.stop({ path: `trace-${new Date().toISOString()}.zip` });
    sendTelegramMessage((error as Error).message)
    await browser.close().catch()
    clearInterval(timeInterval)
    main()
  }
}

main()
