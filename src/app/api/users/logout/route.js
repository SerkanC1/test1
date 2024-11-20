// src/app/api/users/logout/route.js
import { getLocalDate } from "../../../lib/date-utils";
import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userId } = await req.json();
    const logoutDate = getLocalDate();

    // Tarih geçerli mi kontrol et
    if (!(logoutDate instanceof Date) || isNaN(logoutDate)) {
      throw new Error("Geçersiz tarih");
    }

    await prisma.user.update({
      where: { id: BigInt(userId) },
      data: {
        lastLogoutAt: getLocalDate(),
        isLogin: false,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout hatası:", error);
    return NextResponse.json(
      { error: "Logout işlemi başarısız" },
      { status: 500 }
    );
  }
}
