import * as dotenv from 'dotenv'
dotenv.config()

const email = process.env.PRENOTAMI_EMAIL
if (email === undefined) throw Error("Missing Prenotami account email")

const password = process.env.PRENOTAMI_PASSWORD
if (password === undefined) throw Error("Missing Prenotami account password")

export default {
  email: email,
  password: password,
}
