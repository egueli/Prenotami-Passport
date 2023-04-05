"use strict";Object.defineProperty(exports,"__esModule",{value:true});Object.defineProperty(exports,"userLogin",{enumerable:true,get:()=>userLogin});const _locators=require("../constants/locators");const _fakeUser=_interopRequireDefault(require("../constants/fakeUser"));function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}const userLogin=async page=>{await page.locator(_locators.LOGIN_EMAIL_LOCATORS).fill(_fakeUser.default.email);await page.locator(_locators.LOGIN_PASSWORD_LOCATORS).fill(_fakeUser.default.password);await page.getByRole("button").click({force:true});await page.waitForLoadState("networkidle")};