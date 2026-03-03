import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

interface ExpenseCategoryInput {
  name: string;
  slug: string;
  sortOrder: number;
  subcategories?: { name: string; slug: string; sortOrder: number }[];
}

const DEFAULT_CATEGORIES: ExpenseCategoryInput[] = [
  {
    name: 'Bahan Baku',
    slug: 'bahan_baku',
    sortOrder: 1,
    subcategories: [
      { name: 'Deterjen', slug: 'deterjen', sortOrder: 1 },
      { name: 'Pewangi', slug: 'pewangi', sortOrder: 2 },
      { name: 'Plastik', slug: 'plastik', sortOrder: 3 },
      { name: 'Hanger', slug: 'hanger', sortOrder: 4 },
      { name: 'Setrika Spray', slug: 'setrika_spray', sortOrder: 5 },
    ],
  },
  {
    name: 'Operasional',
    slug: 'operasional',
    sortOrder: 2,
    subcategories: [
      { name: 'Listrik', slug: 'listrik', sortOrder: 1 },
      { name: 'Air', slug: 'air', sortOrder: 2 },
      { name: 'Sewa', slug: 'sewa', sortOrder: 3 },
      { name: 'Internet', slug: 'internet', sortOrder: 4 },
      { name: 'Maintenance Mesin', slug: 'maintenance_mesin', sortOrder: 5 },
    ],
  },
  {
    name: 'Gaji',
    slug: 'gaji',
    sortOrder: 3,
  },
  {
    name: 'Marketing',
    slug: 'marketing',
    sortOrder: 4,
    subcategories: [
      { name: 'Promo', slug: 'promo', sortOrder: 1 },
      { name: 'Diskon', slug: 'diskon', sortOrder: 2 },
      { name: 'Iklan', slug: 'iklan', sortOrder: 3 },
    ],
  },
  {
    name: 'Lain-lain',
    slug: 'lainnya',
    sortOrder: 5,
  },
];

/**
 * Seed default expense categories untuk sebuah outlet.
 * Dipanggil saat outlet baru dibuat.
 */
export async function seedExpenseCategories(outletId: string): Promise<void> {
  for (const cat of DEFAULT_CATEGORIES) {
    const category = await prisma.expenseCategory.create({
      data: {
        outletId,
        name: cat.name,
        slug: cat.slug,
        isDefault: true,
        sortOrder: cat.sortOrder,
      },
    });

    if (cat.subcategories && cat.subcategories.length > 0) {
      await prisma.expenseSubcategory.createMany({
        data: cat.subcategories.map((sub) => ({
          categoryId: category.id,
          name: sub.name,
          slug: sub.slug,
          sortOrder: sub.sortOrder,
        })),
      });
    }
  }
}

async function main(): Promise<void> {
  console.log('🌱 LaundryKu seed script');
  console.log('   seedExpenseCategories(outletId) — call when creating a new outlet.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
