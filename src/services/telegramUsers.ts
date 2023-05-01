import * as dotenv from 'dotenv'
dotenv.config()

const users = process.env.TELEGRAM_BOT_USERS
if (users === undefined) throw Error("Missing Telegram bot users")

export const telegramUsers = users.split(",") 
