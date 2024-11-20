// src/app/lib/prisma.js 
import { PrismaClient } from '@prisma/client'

// Global scope'da Prisma instance'ı tutmak için
let prisma

// Development modunda hot-reloading sırasında birden fazla instance oluşmasını engelle
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }
  prisma = global.prisma
}

export { prisma }