import bcrypt from 'bcryptjs'
import { getDb } from '@/db'
import {
  categories,
  designs,
  inquiries,
  materials,
  orderItems,
  orders,
  productCategories,
  productDesigns,
  productMaterials,
  products,
  productVariants,
  users,
  variantImages,
} from '@/server/db/schema'
import { createServerFn } from '@tanstack/react-start'

const db = getDb()

async function seed() {
  console.log('🌱 شروع seed...')

  // ============================================================
  // 1. کاربران
  // ============================================================
  const passwordHash = await bcrypt.hash('password123', 10)

  const [admin] = await db
    .insert(users)
    .values({
      phone: '09120000001',
      email: 'admin@farshgallery.ir',
      name: 'مدیر سیستم',
      role: 'admin',
      passwordHash,
      isActive: true,
      phoneVerifiedAt: new Date().toISOString(),
    })
    .returning()

  const [staff1] = await db
    .insert(users)
    .values({
      phone: '09120000002',
      email: 'staff1@farshgallery.ir',
      name: 'علی محمدی',
      role: 'staff',
      passwordHash,
      isActive: true,
      phoneVerifiedAt: new Date().toISOString(),
    })
    .returning()

  const [staff2] = await db
    .insert(users)
    .values({
      phone: '09120000003',
      email: 'staff2@farshgallery.ir',
      name: 'فاطمه رضایی',
      role: 'staff',
      passwordHash,
      isActive: true,
      phoneVerifiedAt: new Date().toISOString(),
    })
    .returning()

  const customers = await db
    .insert(users)
    .values([
      {
        phone: '09111111101',
        name: 'رضا کریمی',
        role: 'customer',
        passwordHash,
        isActive: true,
        phoneVerifiedAt: new Date().toISOString(),
      },
      {
        phone: '09111111102',
        name: 'مریم احمدی',
        role: 'customer',
        passwordHash,
        isActive: true,
        phoneVerifiedAt: new Date().toISOString(),
      },
      {
        phone: '09111111103',
        name: 'حسین نوری',
        role: 'customer',
        passwordHash,
        isActive: true,
        phoneVerifiedAt: new Date().toISOString(),
      },
      {
        phone: '09111111104',
        name: 'زهرا صادقی',
        role: 'customer',
        passwordHash,
        isActive: true,
        phoneVerifiedAt: new Date().toISOString(),
      },
      {
        phone: '09111111105',
        name: 'امیر حسینی',
        role: 'customer',
        passwordHash,
        isActive: true,
        phoneVerifiedAt: new Date().toISOString(),
      },
    ])
    .returning()

  console.log('✅ کاربران ایجاد شدند')

  // ============================================================
  // 2. دسته‌بندی‌ها
  // ============================================================
  const categoriesData = await db
    .insert(categories)
    .values([
      { name: 'گبه', slug: 'gabbeh' },
      { name: 'فرش ماشینی', slug: 'machine-made' },
      { name: 'فرش دستباف', slug: 'handmade' },
      { name: 'پادری', slug: 'doormat' },
      { name: 'موکت', slug: 'carpet-tile' },
    ])
    .returning()

  console.log('✅ دسته‌بندی‌ها ایجاد شدند')

  // ============================================================
  // 3. طرح‌ها
  // ============================================================
  const designsData = await db
    .insert(designs)
    .values([
      { name: 'سنتی', slug: 'traditional' },
      { name: 'مدرن', slug: 'modern' },
      { name: 'گبه‌ای', slug: 'gabbeh-style' },
      { name: 'هندسی', slug: 'geometric' },
      { name: 'فانتزی', slug: 'fantasy' },
      { name: 'وینتیج', slug: 'vintage' },
    ])
    .returning()

  console.log('✅ طرح‌ها ایجاد شدند')

  // ============================================================
  // 4. متریال‌ها
  // ============================================================
  const materialsData = await db
    .insert(materials)
    .values([
      { name: 'اکریلیک', slug: 'acrylic' },
      { name: 'پلی‌پروپیلن', slug: 'polypropylene' },
      { name: 'پشم طبیعی', slug: 'wool' },
      { name: 'ابریشم', slug: 'silk' },
      { name: 'نایلون', slug: 'nylon' },
    ])
    .returning()

  console.log('✅ متریال‌ها ایجاد شدند')

  // ============================================================
  // 5. محصولات (۲۰ عدد)
  // ============================================================
  const productsList = [
    {
      name: 'فرش گبه لری ۱۲۰۰ شانه',
      slug: 'gabbeh-lori-1200',
      description:
        'فرش گبه‌ای با طرح‌های قبیله‌ای لری، بافته‌شده با پشم طبیعی اعلا. مناسب نشیمن و اتاق خواب.',
      categories: [0, 2], // گبه، دستباف
      designs: [2], // گبه‌ای
      materials: [2], // پشم طبیعی
    },
    {
      name: 'فرش ماشینی وینتیج ۵۰۰ شانه',
      slug: 'machine-vintage-500',
      description:
        'فرش ماشینی با طرح وینتیج، مناسب برای فضاهای کلاسیک و مدرن. رنگ‌آمیزی با رنگ‌های گیاهی.',
      categories: [1],
      designs: [5],
      materials: [0],
    },
    {
      name: 'فرش دستباف تبریز ۷۰ رج',
      slug: 'tabriz-handmade-70',
      description:
        'فرش دستباف تبریز ۷۰ رج با طرح ترنج، ریسیده از ابریشم خالص. کیفیت صادراتی.',
      categories: [2],
      designs: [0],
      materials: [3],
    },
    {
      name: 'فرش مدرن فانتزی اکریلیک',
      slug: 'modern-fantasy-acrylic',
      description:
        'فرش ماشینی با طرح هندسی مدرن، ایده‌آل برای دکوراسیون مینیمال.',
      categories: [1],
      designs: [1, 3],
      materials: [0],
    },
    {
      name: 'گبه قشقایی دستباف',
      slug: 'qashqai-gabbeh',
      description:
        'گبه اصیل قشقایی با نقوش حیوانی و گیاهی، ساخته شده توسط عشایر استان فارس.',
      categories: [0, 2],
      designs: [2, 0],
      materials: [2],
    },
    {
      name: 'فرش ماشینی ۷۰۰ شانه پلی‌پروپیلن',
      slug: 'machine-700-pp',
      description:
        'فرش پرمقاومت ماشینی مناسب برای استفاده روزانه و ترافیک بالا.',
      categories: [1],
      designs: [1],
      materials: [1],
    },
    {
      name: 'فرش کرمان دستباف ترمه',
      slug: 'kerman-termeh',
      description:
        'فرش دستباف کرمان با خامه‌کشی ریز و ظریف، نقشه گل‌وبوته اصیل.',
      categories: [2],
      designs: [0],
      materials: [2, 3],
    },
    {
      name: 'فرش مدرن ۱۰۰۰ شانه ابریشم‌نما',
      slug: 'modern-1000-silk-look',
      description:
        'فرش ماشینی با درخشندگی ابریشم‌نما و طرح‌های معاصر. مناسب محیط‌های لوکس.',
      categories: [1],
      designs: [1],
      materials: [4],
    },
    {
      name: 'گبه لری سرمه‌ای',
      slug: 'lori-gabbeh-navy',
      description:
        'گبه لری با زمینه سرمه‌ای عمیق و نقوش هندسی سنتی. بافت خشن اصیل.',
      categories: [0],
      designs: [2, 3],
      materials: [2],
    },
    {
      name: 'فرش سنتی اصفهان ۶۰ رج',
      slug: 'isfahan-traditional-60',
      description:
        'فرش دستباف اصفهان با طرح اسلیمی و ختایی، مناسب فضاهای کلاسیک.',
      categories: [2],
      designs: [0],
      materials: [2],
    },
    {
      name: 'فرش هندسی مدرن نایلون',
      slug: 'geometric-modern-nylon',
      description:
        'فرش ماشینی با نقش هندسی ساده، مناسب دفاتر و محیط‌های اداری.',
      categories: [1],
      designs: [3],
      materials: [4],
    },
    {
      name: 'پادری طرح گل برجسته',
      slug: 'doormat-flower-relief',
      description: 'پادری با طرح گل برجسته، ضد لغزش، مناسب ورودی منزل.',
      categories: [3],
      designs: [4],
      materials: [1],
    },
    {
      name: 'فرش ۵۰۰ شانه گل‌رز',
      slug: 'machine-rose-500',
      description: 'فرش ماشینی ۵۰۰ شانه با طرح گل‌رز، رنگ‌های گرم و دل‌نشین.',
      categories: [1],
      designs: [0],
      materials: [0],
    },
    {
      name: 'گبه رنگارنگ قبیله‌ای',
      slug: 'tribal-gabbeh-colorful',
      description: 'گبه قبیله‌ای با رنگ‌بندی شاد و نقوش اصیل، مناسب کودکان.',
      categories: [0],
      designs: [2],
      materials: [2],
    },
    {
      name: 'فرش دستباف نائین ۹ لا',
      slug: 'nain-9la-handmade',
      description:
        'فرش معروف نائین ۹ لا با پرز کوتاه و دقت بالا، مناسب مجالس رسمی.',
      categories: [2],
      designs: [0],
      materials: [2, 3],
    },
    {
      name: 'موکت طرح سنگ طبیعی',
      slug: 'carpet-tile-stone',
      description: 'موکت با طرح سنگ طبیعی، مناسب سالن‌ها و راهروها.',
      categories: [4],
      designs: [1],
      materials: [1],
    },
    {
      name: 'فرش وینتیج پتینه ۱۲۰۰ شانه',
      slug: 'vintage-patina-1200',
      description:
        'فرش ماشینی با پرداخت پتینه (شسته‌شده) که ظاهری کهنه و لوکس می‌دهد.',
      categories: [1],
      designs: [5],
      materials: [0],
    },
    {
      name: 'فرش بختیاری دستباف',
      slug: 'bakhtiari-handmade',
      description:
        'فرش بختیاری اصیل با طرح باغ خشتی، بافته شده توسط عشایر چهارمحال.',
      categories: [2],
      designs: [0],
      materials: [2],
    },
    {
      name: 'پادری چرمی ساده',
      slug: 'leather-doormat-simple',
      description:
        'پادری مدرن با رویه اکریلیک و پشت ضد لغزش، قابل شستشو در ماشین.',
      categories: [3],
      designs: [1],
      materials: [0],
    },
    {
      name: 'فرش ابریشم دستباف قم',
      slug: 'qom-silk-handmade',
      description:
        'شاهکار فرشبافی قم، بافته‌شده از ابریشم خالص با تراکم ۸۰ رج. کیفیت موزه‌ای.',
      categories: [2],
      designs: [0],
      materials: [3],
    },
  ]

  // داده‌های variant برای هر محصول
  const variantTemplates = [
    {
      dimension: '۶ متری (۲۰۰×۳۰۰)',
      colors: [
        { color: 'کرم', colorHex: '#F5F0DC', priceMultiplier: 1.0 },
        { color: 'سرمه‌ای', colorHex: '#1B2A4A', priceMultiplier: 1.05 },
      ],
    },
    {
      dimension: '۹ متری (۳۰۰×۳۰۰)',
      colors: [
        { color: 'قرمز لاکی', colorHex: '#8B0000', priceMultiplier: 1.5 },
        { color: 'طوسی', colorHex: '#808080', priceMultiplier: 1.45 },
      ],
    },
    {
      dimension: '۱۲ متری (۳۰۰×۴۰۰)',
      colors: [{ color: 'فیلی', colorHex: '#C2B280', priceMultiplier: 2.0 }],
    },
  ]

  const basePrices: Record<string, number> = {
    'gabbeh-lori-1200': 8_500_000,
    'machine-vintage-500': 3_200_000,
    'tabriz-handmade-70': 45_000_000,
    'modern-fantasy-acrylic': 2_800_000,
    'qashqai-gabbeh': 12_000_000,
    'machine-700-pp': 3_800_000,
    'kerman-termeh': 38_000_000,
    'modern-1000-silk-look': 5_500_000,
    'lori-gabbeh-navy': 9_200_000,
    'isfahan-traditional-60': 42_000_000,
    'geometric-modern-nylon': 2_600_000,
    'doormat-flower-relief': 450_000,
    'machine-rose-500': 3_000_000,
    'tribal-gabbeh-colorful': 10_500_000,
    'nain-9la-handmade': 55_000_000,
    'carpet-tile-stone': 1_200_000,
    'vintage-patina-1200': 4_200_000,
    'bakhtiari-handmade': 35_000_000,
    'leather-doormat-simple': 380_000,
    'qom-silk-handmade': 120_000_000,
  }

  for (const p of productsList) {
    // درج محصول
    const [product] = await db
      .insert(products)
      .values({
        name: p.name,
        slug: p.slug,
        description: p.description,
        isActive: true,
      })
      .returning()

    // دسته‌بندی‌ها
    for (const ci of p.categories) {
      await db.insert(productCategories).values({
        productId: product.id,
        categoryId: categoriesData[ci].id,
      })
    }

    // طرح‌ها
    for (const di of p.designs) {
      await db.insert(productDesigns).values({
        productId: product.id,
        designId: designsData[di].id,
      })
    }

    // متریال‌ها
    for (const mi of p.materials) {
      await db.insert(productMaterials).values({
        productId: product.id,
        materialId: materialsData[mi].id,
      })
    }

    // Variant ها
    const basePrice = basePrices[p.slug] ?? 5_000_000
    // پادری فقط یک سایز دارد
    const templates =
      p.slug.startsWith('doormat') ||
      p.slug.startsWith('leather-doormat') ||
      p.slug === 'carpet-tile-stone'
        ? [variantTemplates[0]]
        : variantTemplates

    let skuCounter = 1
    for (const tpl of templates) {
      for (const col of tpl.colors) {
        const price = Math.round(basePrice * col.priceMultiplier)
        const [variant] = await db
          .insert(productVariants)
          .values({
            productId: product.id,
            dimension: tpl.dimension,
            color: col.color,
            colorHex: col.colorHex,
            sku: `${p.slug.toUpperCase().replace(/-/g, '_')}_${skuCounter++}`,
            price,
            compareAtPrice: Math.round(price * 1.1),
            stock: Math.floor(Math.random() * 15) + 2, // ۲ تا ۱۶
            isActive: true,
          })
          .returning()

        // تصاویر نمونه برای هر variant
        await db.insert(variantImages).values([
          {
            variantId: variant.id,
            url: `https://picsum.photos/seed/${p.slug}-${variant.id}-1/800/600`,
            alt: `${p.name} - ${col.color} - ${tpl.dimension}`,
            sortOrder: 0,
          },
          {
            variantId: variant.id,
            url: `https://picsum.photos/seed/${p.slug}-${variant.id}-2/800/600`,
            alt: `${p.name} - نمای نزدیک`,
            sortOrder: 1,
          },
        ])
      }
    }
  }

  console.log('✅ محصولات، Variant ها و تصاویر ایجاد شدند')

  // ============================================================
  // 6. سفارش‌های نمونه
  // ============================================================

  // گرفتن چند variant برای آیتم‌های سفارش
  const allVariants = await db.query.productVariants.findMany({ limit: 10 })

  for (let i = 0; i < customers.length; i++) {
    const customer = customers[i]
    const v1 = allVariants[i % allVariants.length]
    const v2 = allVariants[(i + 2) % allVariants.length]

    const total = v1.price + v2.price
    const statuses: Array<
      'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
    > = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

    const [order] = await db
      .insert(orders)
      .values({
        userId: customer.id,
        shippingAddress: `تهران، خیابان آزادی، پلاک ${100 + i}، واحد ${i + 1}`,
        customerNote: i === 0 ? 'لطفاً زودتر ارسال شود' : null,
        totalAmount: total,
        status: statuses[i % statuses.length],
      })
      .returning()

    await db.insert(orderItems).values([
      {
        orderId: order.id,
        variantId: v1.id,
        quantity: 1,
        unitPrice: v1.price,
      },
      {
        orderId: order.id,
        variantId: v2.id,
        quantity: 1,
        unitPrice: v2.price,
      },
    ])
  }

  console.log('✅ سفارش‌های نمونه ایجاد شدند')

  // ============================================================
  // 7. استعلام‌های نمونه
  // ============================================================
  const allProducts = await db.query.products.findMany({ limit: 6 })

  for (let i = 0; i < 3; i++) {
    const customer = customers[i]
    const product = allProducts[i]
    const inquiryStatuses: Array<'new' | 'contacted' | 'closed'> = [
      'new',
      'contacted',
      'closed',
    ]

    await db.insert(inquiries).values({
      userId: customer.id,
      productId: product.id,
      message: [
        'آیا این فرش در سایز ۱۲ متری هم موجود است؟',
        'قیمت نهایی با احتساب ارسال به اصفهان چقدر می‌شود؟',
        'آیا امکان مشاهده‌ی حضوری این فرش وجود دارد؟',
      ][i],
      status: inquiryStatuses[i],
    })
  }

  console.log('✅ استعلام‌های نمونه ایجاد شدند')
  console.log('\n🎉 seed با موفقیت به پایان رسید!')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`👤 Admin:    09120000001 / password123`)
  console.log(`👤 Staff:    09120000002 / password123`)
  console.log(`👤 Customer: 09111111101 / password123`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

export const runSeedServerFn = createServerFn().handler(async () => {
  await seed()
  return { message: 'Seed completed successfully' }
})
