import { Telegraf } from 'telegraf'

import * as dotenv from 'dotenv'
dotenv.config()

const token = process.env.TELEGRAM_BOT_TOKEN
if (token === undefined) throw Error("Missing Telegram bot token")
export const bot = new Telegraf(token)

  // const bot = new Telegraf('5676055374:AAHWFXHHHNTQwXt1k8CVqGxklWUuL-4f9Is')
  // bot.start(ctx => ctx.reply('Welcome'))
  // bot.help(ctx => ctx.reply('Send me a sticker'))
  // bot.on('sticker', ctx => ctx.reply('👍'))
  // bot.hears('hi', ctx => ctx.reply('Hey there'))
  // bot.launch()
