import { Page } from 'playwright'

import { RESERVA_NAV } from '../constants/locators'

export const passportAppointmentIsAvailable = async (page: Page) => {
  await page.locator(RESERVA_NAV).click()
  await page.waitForLoadState('networkidle')
  await page.locator('#dataTableServices > tbody > tr:nth-child(1) > td:nth-child(4) > a').click()
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(3000)
  const text = await page.locator('.jconfirm-content > div').innerText().catch((error) => '')

  if (text === 'Al momento non ci sono date disponibili per il servizio richiesto') {
    await page.locator('.jconfirm-buttons > button').click()
  }

  return !(text === 'Al momento non ci sono date disponibili per il servizio richiesto')
}

