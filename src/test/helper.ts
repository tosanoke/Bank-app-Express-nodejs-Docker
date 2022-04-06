import { promises as fs } from 'fs'
import path from 'path'

const database = path.join(__dirname, '..', 'database.json')

export const deleteFile = async () => {
  try {
    await fs.unlink(database)
  } catch (err) {}
}
