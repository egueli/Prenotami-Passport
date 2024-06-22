import { Page } from 'playwright'

import { RESERVA_NAV } from '../constants/locators'

export const passportAppointmentIsAvailable = async (page: Page) => {
  try {
    await page.locator(RESERVA_NAV).click()
    await page.waitForLoadState('load')
    await page.locator('#dataTableServices > tbody > tr:nth-child(1) > td:nth-child(4) > a').click()
    await page.waitForLoadState('load')
    const text = await page.locator('.jconfirm-content > div').innerText().catch((_) => '')
  
    const noAvailable = (text.startsWith("Stante l'elevata richiesta i posti disponibili per il servizio scelto sono esauriti"))
    if (noAvailable) {
      await page.locator('.jconfirm-buttons > button').click()
    }
  
    return !noAvailable
  } catch (error) {
    console.error(`catch an error 👀: passportAppointmentIsAvailable: ${(error as Error).message}`)
    return 'error'
  }
}

