import { createConnection } from 'typeorm'
import * as entities from './models'
import { timeEnd, time, timeLog } from 'console'

export default async function connection() {
  time('db')

  await createConnection({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    entities: Object.values(entities),
  })

  timeLog('db')
}
