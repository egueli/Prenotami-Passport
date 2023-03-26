import { Page } from 'playwright'

import { LOGIN_EMAIL_LOCATORS, LOGIN_PASSWORD_LOCATORS } from '../constants/locators'
import fakeUser from '../constants/fakeUser'

export const userLogin = async (page: Page) => {
  await page.locator(LOGIN_EMAIL_LOCATORS).fill(fakeUser.email)
  await page.locator(LOGIN_PASSWORD_LOCATORS).fill(fakeUser.password)
  await page.getByRole('button').click({ force: true })
  await page.waitForLoadState('networkidle')
}
