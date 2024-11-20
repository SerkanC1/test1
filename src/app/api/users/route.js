// src/app/api/users/route.js - POST ve GET
import { prisma } from "../../lib/prisma"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        namesurname: true,
        role: true,
        createdAt: true,
        lastLoginAt: true,
        lastLogoutAt: true,
        isActive: true,
        isLogin: true,
      }
    })

    const serializedUsers = users.map(user => ({
      ...user,
      id: user.id.toString(),
      createdAt: user.createdAt?.toISOString() || null,
      lastLoginAt: user.lastLoginAt?.toISOString() || null,
      lastLogoutAt: user.lastLogoutAt?.toISOString() || null,
    }))

    return NextResponse.json(serializedUsers)
  } catch (error) {
    return NextResponse.json({ error: "Kullanıcılar getirilemedi" }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const data = await req.json()
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10

    const newUser = await prisma.user.create({
      data: {
        username: data.username,
        password: await bcrypt.hash(data.password, saltRounds),
        namesurname: data.namesurname,
        role: data.role,
        isActive: true
      },
      select: {
        id: true,
        username: true,
        namesurname: true,
        role: true,
        isActive: true,
        createdAt: true,
      }
    })

    const serializedUser = {
      ...newUser,
      id: newUser.id.toString(),
      createdAt: newUser.createdAt.toISOString()
    }

    return NextResponse.json({
      success: true,
      data: serializedUser
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}