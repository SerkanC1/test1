// src/app/api/users/route.js
import { prisma } from "../../lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        namesurname: true,
        role: true,
        createdAt: true, // Eklendi
        lastLoginAt: true, // Eklendi
        lastLogoutAt: true, // Eklendi
        isActive: true, // Eklendi
        isLogin: true, // Eklendi
        // password alanını gönderme
      },
    });

    // BigInt ve tarih serileştirme
    const serializedUsers = users.map((user) => ({
      ...user,
      id: user.id.toString(),
      createdAt: user.createdAt?.toISOString() || null,
      lastLoginAt: user.lastLoginAt?.toISOString() || null,
      lastLogoutAt: user.lastLogoutAt?.toISOString() || null,
    }));

    return NextResponse.json(serializedUsers);
  } catch (error) {
    console.error("Kullanıcılar getirilemedi:", error);
    return NextResponse.json(
      { error: "Kullanıcılar getirilemedi" },
      { status: 500 }
    );
  }
}

// Yeni kullanıcı oluştur
export async function POST(req) {
  try {
    const data = await req.json();
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    const user = await prisma.user.create({
      data: {
        username: data.username,
        password: hashedPassword,
        namesurname: data.namesurname,
        role: data.role,
        isActive: true,
      },
    });

    // Password'ü çıkart
    const { password, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    return NextResponse.json(
      { error: "Kullanıcı oluşturulamadı" },
      { status: 500 }
    );
  }
}

// Kullanıcı güncelle
export async function PUT(req) {
  try {
    const data = await req.json();
    const updateData = {
      namesurname: data.namesurname,
      role: data.role,
    };

    // Şifre değiştirilecekse hash'le
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, saltRounds);
    }

    const user = await prisma.user.update({
      where: { id: BigInt(data.id) },
      data: updateData,
    });

    const { password, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    return NextResponse.json(
      { error: "Kullanıcı güncellenemedi" },
      { status: 500 }
    );
  }
}
