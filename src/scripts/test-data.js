// src/scripts/test-data.js
// Veritabanına test verileri eklemek için bir betik dosyası oluşturduk.
// Bu dosyayı çalıştırarak veritabanına test verileri ekleyebiliriz.
// Bu dosyayı çalıştırmak için terminalde "node src/scripts/test-data.js" komutunu kullanabiliriz.
// Bu dosya çalıştırıldığında PrismaClient nesnesi oluşturulur ve veritabanına test verileri eklenir.
// Ekleme işlemi başarılı olursa konsola "Veriler eklendi:" mesajı yazdırılır ve eklenen veriler konsola yazdırılır.
// Ekleme işlemi başarısız olursa hata konsola yazdırılır.
// Son olarak PrismaClient nesnesi kapatılır.

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  try {
    const test1 = await prisma.test.create({
      data: {
        isim: "Şükrü Öğüt",
        sehir: "İstanbul",
      },
    });

    const test2 = await prisma.test.create({
      data: {
        isim: "Özge Çelik",
        sehir: "İzmir",
      },
    });

    console.log("Veriler eklendi:", test1, test2);
  } catch (error) {
    console.error("Hata:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
