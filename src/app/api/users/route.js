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
        // password alanını gönderme
      },
    });

    // BigInt'i string'e çevir
    const serializedUsers = users.map((user) => ({
      ...user,
      id: user.id.toString(), // BigInt'i string'e dönüştür
    }));

    // serializedUsers'ı döndür, users değil!
    return NextResponse.json(serializedUsers);
  } catch (error) {
    console.error("Kullanıcılar getirilemedi:", error);
    return NextResponse.json(
      { error: "Kullanıcılar getirilemedi" },
      { status: 500 }
    );
  }
}
