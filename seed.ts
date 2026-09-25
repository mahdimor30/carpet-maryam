// seed.ts

import { drizzle } from 'drizzle-orm/d1'
import { env } from 'cloudflare:workers'
import {
  categories,
  designs,
  materials,
  products,
  productVariants,
  productCategories,
  productDesigns,
  productMaterials,
  factories,
  factoryProducts,
  factoryInventory,
  factoryQuotes,
} from './src/server/db/schema'

const db = drizzle(env.carpet_maryam_db)

async function seed() {
  console.log('🌱 Starting seed...')

  // --------------------------------------------------
  // Categories
  // --------------------------------------------------

  const categoryData = [
    {
      name: 'فرش کلاسیک',
      slug: 'classic',
    },
    {
      name: 'فرش مدرن',
      slug: 'modern',
    },
    {
      name: 'فرش سنتی',
      slug: 'traditional',
    },
    {
      name: 'فرش اتاق کودک',
      slug: 'children',
    },
  ]

  for (const category of categoryData) {
    await db.insert(categories).values(category).onConflictDoNothing({
      target: categories.slug,
    })
  }

  // --------------------------------------------------
  // Designs
  // --------------------------------------------------

  const designData = [
    {
      name: 'افشان',
      slug: 'afshan',
    },
    {
      name: 'ترنج',
      slug: 'toranj',
    },
    {
      name: 'خشتی',
      slug: 'kheshti',
    },
    {
      name: 'وینتیج',
      slug: 'vintage',
    },
    {
      name: 'هندسی',
      slug: 'geometric',
    },
  ]

  for (const design of designData) {
    await db.insert(designs).values(design).onConflictDoNothing({
      target: designs.slug,
    })
  }

  // --------------------------------------------------
  // Materials
  // --------------------------------------------------

  const materialData = [
    {
      name: 'اکریلیک هیت‌ست',
      slug: 'acrylic-heatset',
    },
    {
      name: 'پلی‌استر',
      slug: 'polyester',
    },
    {
      name: 'پلی‌پروپیلن',
      slug: 'polypropylene',
    },
    {
      name: 'پشم',
      slug: 'wool',
    },
  ]

  for (const material of materialData) {
    await db.insert(materials).values(material).onConflictDoNothing({
      target: materials.slug,
    })
  }

  // --------------------------------------------------
  // Fetch IDs
  // --------------------------------------------------

  const categoryRows = await db.select().from(categories)
  const designRows = await db.select().from(designs)
  const materialRows = await db.select().from(materials)

  const categoryId = (slug: string) =>
    categoryRows.find((item) => item.slug === slug)?.id

  const designId = (slug: string) =>
    designRows.find((item) => item.slug === slug)?.id

  const materialId = (slug: string) =>
    materialRows.find((item) => item.slug === slug)?.id

  // --------------------------------------------------
  // Products
  // --------------------------------------------------

  const productData = [
    {
      name: 'فرش ماشینی افشان کرم',
      slug: 'afshan-cream-700',
      description:
        'فرش ماشینی طرح افشان با زمینه کرم، مناسب دکوراسیون کلاسیک و مدرن.',
      descriptionShort: 'فرش افشان کرم با طراحی کلاسیک و رنگ‌بندی گرم.',
      brand: 'فرش مریم',
      style: 'classic' as const,
      shaneh: 700,
      density: 2550,
      yarn: 'اکریلیک هیت‌ست',
      pileHeightMm: 10,
      weightPerSquareMeterGrams: 2500,
      weavingType: 'ماشینی',
      warrantyMonths: 60,
      isActive: true,
    },

    {
      name: 'فرش ماشینی ترنج سرمه‌ای',
      slug: 'toranj-navy-700',
      description:
        'فرش طرح ترنج با زمینه سرمه‌ای و حاشیه کلاسیک، مناسب سالن پذیرایی.',
      descriptionShort: 'ترنج سرمه‌ای با ظاهر رسمی و لوکس.',
      brand: 'فرش مریم',
      style: 'classic' as const,
      shaneh: 700,
      density: 2550,
      yarn: 'اکریلیک هیت‌ست',
      pileHeightMm: 10,
      weightPerSquareMeterGrams: 2500,
      weavingType: 'ماشینی',
      warrantyMonths: 60,
      isActive: true,
    },

    {
      name: 'فرش مدرن هندسی طوسی',
      slug: 'modern-geometric-gray',
      description: 'فرش مدرن با طرح هندسی و رنگ طوسی، مناسب دکوراسیون مینیمال.',
      descriptionShort: 'فرش مدرن طوسی برای خانه‌های مینیمال.',
      brand: 'فرش مریم',
      style: 'modern' as const,
      shaneh: 1200,
      density: 3600,
      yarn: 'اکریلیک هیت‌ست',
      pileHeightMm: 9,
      weightPerSquareMeterGrams: 2200,
      weavingType: 'ماشینی',
      warrantyMonths: 60,
      isActive: true,
    },

    {
      name: 'فرش وینتیج طوسی کرم',
      slug: 'vintage-gray-cream',
      description:
        'فرش وینتیج با ترکیب طوسی و کرم، مناسب دکوراسیون مدرن و نئوکلاسیک.',
      descriptionShort: 'وینتیج طوسی کرم با ظاهر خاص و امروزی.',
      brand: 'فرش مریم',
      style: 'fancy' as const,
      shaneh: 1200,
      density: 3600,
      yarn: 'پلی‌استر',
      pileHeightMm: 8,
      weightPerSquareMeterGrams: 2100,
      weavingType: 'ماشینی',
      warrantyMonths: 36,
      isActive: true,
    },

    {
      name: 'فرش سنتی خشتی لاکی',
      slug: 'traditional-kheshti-red',
      description:
        'فرش سنتی با طرح خشتی و رنگ لاکی، مناسب دکوراسیون سنتی و کلاسیک.',
      descriptionShort: 'طرح خشتی لاکی با حال‌وهوای اصیل ایرانی.',
      brand: 'فرش مریم',
      style: 'traditional' as const,
      shaneh: 700,
      density: 2550,
      yarn: 'اکریلیک هیت‌ست',
      pileHeightMm: 10,
      weightPerSquareMeterGrams: 2500,
      weavingType: 'ماشینی',
      warrantyMonths: 60,
      isActive: true,
    },

    {
      name: 'فرش کودک طرح ستاره',
      slug: 'kids-star',
      description: 'فرش کودک با طراحی ساده و رنگ‌های شاد، مناسب اتاق کودک.',
      descriptionShort: 'فرش کودک با طرح ستاره و رنگ‌بندی شاد.',
      brand: 'فرش مریم',
      style: 'children' as const,
      shaneh: 700,
      density: 2550,
      yarn: 'پلی‌استر',
      pileHeightMm: 8,
      weightPerSquareMeterGrams: 2000,
      weavingType: 'ماشینی',
      warrantyMonths: 36,
      isActive: true,
    },
  ]

  for (const product of productData) {
    await db.insert(products).values(product).onConflictDoNothing({
      target: products.slug,
    })
  }

  // --------------------------------------------------
  // Product IDs
  // --------------------------------------------------

  const productRows = await db.select().from(products)

  const productId = (slug: string) =>
    productRows.find((item) => item.slug === slug)?.id

  // --------------------------------------------------
  // Product Relations
  // --------------------------------------------------

  const productRelations = [
    {
      productSlug: 'afshan-cream-700',
      categories: ['classic'],
      designs: ['afshan'],
      materials: ['acrylic-heatset'],
    },
    {
      productSlug: 'toranj-navy-700',
      categories: ['classic'],
      designs: ['toranj'],
      materials: ['acrylic-heatset'],
    },
    {
      productSlug: 'modern-geometric-gray',
      categories: ['modern'],
      designs: ['geometric'],
      materials: ['acrylic-heatset'],
    },
    {
      productSlug: 'vintage-gray-cream',
      categories: ['modern'],
      designs: ['vintage'],
      materials: ['polyester'],
    },
    {
      productSlug: 'traditional-kheshti-red',
      categories: ['traditional', 'classic'],
      designs: ['kheshti'],
      materials: ['acrylic-heatset'],
    },
    {
      productSlug: 'kids-star',
      categories: ['children'],
      designs: ['geometric'],
      materials: ['polyester'],
    },
  ]

  for (const relation of productRelations) {
    const product = productId(relation.productSlug)

    if (!product) continue

    for (const slug of relation.categories) {
      const category = categoryId(slug)

      if (!category) continue

      await db
        .insert(productCategories)
        .values({
          productId: product,
          categoryId: category,
        })
        .onConflictDoNothing()
    }

    for (const slug of relation.designs) {
      const design = designId(slug)

      if (!design) continue

      await db
        .insert(productDesigns)
        .values({
          productId: product,
          designId: design,
        })
        .onConflictDoNothing()
    }

    for (const slug of relation.materials) {
      const material = materialId(slug)

      if (!material) continue

      await db
        .insert(productMaterials)
        .values({
          productId: product,
          materialId: material,
        })
        .onConflictDoNothing()
    }
  }

  // --------------------------------------------------
  // Product Variants
  // --------------------------------------------------

  const variants = [
    // Afshan
    {
      productSlug: 'afshan-cream-700',
      dimension: '6 متری',
      color: 'کرم',
      colorHex: '#E8DCC8',
      sku: 'FM-AFSHAN-700-6M',
      price: 12500000,
      compareAtPrice: 14500000,
    },
    {
      productSlug: 'afshan-cream-700',
      dimension: '9 متری',
      color: 'کرم',
      colorHex: '#E8DCC8',
      sku: 'FM-AFSHAN-700-9M',
      price: 18500000,
      compareAtPrice: 21000000,
    },
    {
      productSlug: 'afshan-cream-700',
      dimension: '12 متری',
      color: 'کرم',
      colorHex: '#E8DCC8',
      sku: 'FM-AFSHAN-700-12M',
      price: 24500000,
      compareAtPrice: 28000000,
    },

    // Toranj
    {
      productSlug: 'toranj-navy-700',
      dimension: '6 متری',
      color: 'سرمه‌ای',
      colorHex: '#172554',
      sku: 'FM-TORANJ-700-6M',
      price: 13000000,
      compareAtPrice: 15000000,
    },
    {
      productSlug: 'toranj-navy-700',
      dimension: '9 متری',
      color: 'سرمه‌ای',
      colorHex: '#172554',
      sku: 'FM-TORANJ-700-9M',
      price: 19200000,
      compareAtPrice: 22000000,
    },

    // Modern
    {
      productSlug: 'modern-geometric-gray',
      dimension: '6 متری',
      color: 'طوسی',
      colorHex: '#9CA3AF',
      sku: 'FM-GEO-1200-6M',
      price: 15500000,
      compareAtPrice: 17500000,
    },
    {
      productSlug: 'modern-geometric-gray',
      dimension: '9 متری',
      color: 'طوسی',
      colorHex: '#9CA3AF',
      sku: 'FM-GEO-1200-9M',
      price: 22500000,
      compareAtPrice: 25000000,
    },

    // Vintage
    {
      productSlug: 'vintage-gray-cream',
      dimension: '6 متری',
      color: 'طوسی کرم',
      colorHex: '#B8B3A7',
      sku: 'FM-VINTAGE-1200-6M',
      price: 14000000,
      compareAtPrice: 16500000,
    },

    // Traditional
    {
      productSlug: 'traditional-kheshti-red',
      dimension: '6 متری',
      color: 'لاکی',
      colorHex: '#991B1B',
      sku: 'FM-KHESHTI-700-6M',
      price: 12800000,
      compareAtPrice: 15000000,
    },
    {
      productSlug: 'traditional-kheshti-red',
      dimension: '9 متری',
      color: 'لاکی',
      colorHex: '#991B1B',
      sku: 'FM-KHESHTI-700-9M',
      price: 19000000,
      compareAtPrice: 21500000,
    },

    // Kids
    {
      productSlug: 'kids-star',
      dimension: '4 متری',
      color: 'چند رنگ',
      colorHex: '#F5D0FE',
      sku: 'FM-KIDS-STAR-4M',
      price: 7500000,
      compareAtPrice: 8500000,
    },
  ]

  for (const variant of variants) {
    const product = productId(variant.productSlug)

    if (!product) continue

    await db
      .insert(productVariants)
      .values({
        productId: product,
        dimension: variant.dimension,
        color: variant.color,
        colorHex: variant.colorHex,
        sku: variant.sku,
        price: variant.price,
        compareAtPrice: variant.compareAtPrice,
        stock: 0,
        isActive: true,
      })
      .onConflictDoNothing({
        target: productVariants.sku,
      })
  }

  // --------------------------------------------------
  // Factory
  // --------------------------------------------------

  const factoryData = [
    {
      name: 'کارخانه نمونه آران',
      slug: 'aran-sample-factory',
      phone: '03100000000',
      whatsapp: '989100000000',
      contactName: 'محمد احمدی',
      address: 'آران و بیدگل',
      city: 'آران و بیدگل',
      region: 'اصفهان',
      notes: 'تأمین‌کننده نمونه برای تست سیستم',
      isActive: true,
    },
    {
      name: 'کارخانه نمونه کاشان',
      slug: 'kashan-sample-factory',
      phone: '03100000001',
      whatsapp: '989110000000',
      contactName: 'علی رضایی',
      address: 'کاشان',
      city: 'کاشان',
      region: 'اصفهان',
      notes: 'مناسب تولید سفارشی',
      isActive: true,
    },
  ]

  for (const factory of factoryData) {
    await db.insert(factories).values(factory).onConflictDoNothing({
      target: factories.slug,
    })
  }

  const factoryRows = await db.select().from(factories)
  const variantRows = await db.select().from(productVariants)

  // --------------------------------------------------
  // Factory Products + Inventory + Quotes
  // --------------------------------------------------

  for (const variant of variantRows) {
    const factory = factoryRows[0]

    if (!factory) continue

    const [factoryProduct] = await db
      .insert(factoryProducts)
      .values({
        factoryId: factory.id,
        variantId: variant.id,
        canWeave: true,
        weavingDays: 7,
        notes: 'تأمین و تولید سفارشی',
        isActive: true,
      })
      .onConflictDoNothing()
      .returning()

    if (!factoryProduct) continue

    await db
      .insert(factoryInventory)
      .values({
        factoryProductId: factoryProduct.id,
        quantity: Math.floor(Math.random() * 5),
        reservedQuantity: 0,
        checkedAt: new Date(),
        notes: 'موجودی اولیه Seed',
      })
      .onConflictDoNothing()

    await db.insert(factoryQuotes).values({
      factoryProductId: factoryProduct.id,
      purchasePrice: Math.floor(variant.price * 0.75),
      validFrom: new Date(),
      notes: 'قیمت خرید نمونه',
    })
  }

  console.log('✅ Seed completed successfully')
}

seed().catch((error) => {
  console.error('❌ Seed failed:')
  console.error(error)
  process.exit(1)
})
