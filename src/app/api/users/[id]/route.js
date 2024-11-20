// src/app/api/users/[id]/route.js
import { prisma } from "../../../lib/prisma"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function PUT(req, { params }) {
  try {
    const { id } = params
    const data = await req.json()
    
    const updateData = {
      namesurname: data.namesurname,
      role: data.role,
    }

    if (data.password) {
      const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10
      updateData.password = await bcrypt.hash(data.password, saltRounds)
    }

    const updatedUser = await prisma.user.update({
      where: { 
        id: BigInt(id) 
      },
      data: updateData,
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
      ...updatedUser,
      id: updatedUser.id.toString(),
      createdAt: updatedUser.createdAt.toISOString()
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