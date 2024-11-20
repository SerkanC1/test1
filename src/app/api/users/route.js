// src/app/api/users/route.js
import { prisma } from "../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        namesurname: true,
        role: true,
        createdAt: true,      // Eklendi
        lastLoginAt: true,    // Eklendi
        lastLogoutAt: true,   // Eklendi
        isActive: true,       // Eklendi
        isLogin: true         // Eklendi
        // password alanını gönderme
      },
    });

    // BigInt ve tarih serileştirme
    const serializedUsers = users.map((user) => ({
        ...user,
        id: user.id.toString(),
        createdAt: user.createdAt?.toISOString() || null,
        lastLoginAt: user.lastLoginAt?.toISOString() || null,
        lastLogoutAt: user.lastLogoutAt?.toISOString() || null
      }))

      return NextResponse.json(serializedUsers);
  } catch (error) {
    console.error("Kullanıcılar getirilemedi:", error);
    return NextResponse.json(
      { error: "Kullanıcılar getirilemedi" },
      { status: 500 }
    );
  }
}
