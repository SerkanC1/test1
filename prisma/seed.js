// prisma/seed.js
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, saltRounds)

  const admin = await prisma.user.upsert({
    where: { username: process.env.ADMIN_USERNAME },
    update: {},
    create: {
      username: process.env.ADMIN_USERNAME,
      password: hashedPassword,
      namesurname: process.env.ADMIN_NAMESURNAME,
      role: 'ADMIN',
    },
  })

  console.log({ admin })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })