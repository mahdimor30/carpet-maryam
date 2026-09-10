-- ============================================================
-- Carpet Maryam - D1 Seed
-- Generated from seed.ts
-- ============================================================

PRAGMA foreign_keys = ON;


-- ============================================================
-- Categories
-- ============================================================

INSERT OR IGNORE INTO categories (name, slug)
VALUES
  ('فرش کلاسیک', 'classic'),
  ('فرش مدرن', 'modern'),
  ('فرش سنتی', 'traditional'),
  ('فرش اتاق کودک', 'children');


-- ============================================================
-- Designs
-- ============================================================

INSERT OR IGNORE INTO designs (name, slug)
VALUES
  ('افشان', 'afshan'),
  ('ترنج', 'toranj'),
  ('خشتی', 'kheshti'),
  ('وینتیج', 'vintage'),
  ('هندسی', 'geometric');


-- ============================================================
-- Materials
-- ============================================================

INSERT OR IGNORE INTO materials (name, slug)
VALUES
  ('اکریلیک هیت‌ست', 'acrylic-heatset'),
  ('پلی‌استر', 'polyester'),
  ('پلی‌پروپیلن', 'polypropylene'),
  ('پشم', 'wool');


-- ============================================================
-- Products
-- ============================================================

INSERT OR IGNORE INTO products (
  name,
  slug,
  description,
  description_short,
  brand,
  style,
  shaneh,
  density,
  yarn,
  pile_height_mm,
  weight_per_square_meter_grams,
  weaving_type,
  warranty_months,
  is_active
)
VALUES

(
  'فرش ماشینی افشان کرم',
  'afshan-cream-700',
  'فرش ماشینی طرح افشان با زمینه کرم، مناسب دکوراسیون کلاسیک و مدرن.',
  'فرش افشان کرم با طراحی کلاسیک و رنگ‌بندی گرم.',
  'فرش مریم',
  'classic',
  700,
  2550,
  'اکریلیک هیت‌ست',
  10,
  2500,
  'ماشینی',
  60,
  1
),

(
  'فرش ماشینی ترنج سرمه‌ای',
  'toranj-navy-700',
  'فرش طرح ترنج با زمینه سرمه‌ای و حاشیه کلاسیک، مناسب سالن پذیرایی.',
  'ترنج سرمه‌ای با ظاهر رسمی و لوکس.',
  'فرش مریم',
  'classic',
  700,
  2550,
  'اکریلیک هیت‌ست',
  10,
  2500,
  'ماشینی',
  60,
  1
),

(
  'فرش مدرن هندسی طوسی',
  'modern-geometric-gray',
  'فرش مدرن با طرح هندسی و رنگ طوسی، مناسب دکوراسیون مینیمال.',
  'فرش مدرن طوسی برای خانه‌های مینیمال.',
  'فرش مریم',
  'modern',
  1200,
  3600,
  'اکریلیک هیت‌ست',
  9,
  2200,
  'ماشینی',
  60,
  1
),

(
  'فرش وینتیج طوسی کرم',
  'vintage-gray-cream',
  'فرش وینتیج با ترکیب طوسی و کرم، مناسب دکوراسیون مدرن و نئوکلاسیک.',
  'وینتیج طوسی کرم با ظاهر خاص و امروزی.',
  'فرش مریم',
  'fancy',
  1200,
  3600,
  'پلی‌استر',
  8,
  2100,
  'ماشینی',
  36,
  1
),

(
  'فرش سنتی خشتی لاکی',
  'traditional-kheshti-red',
  'فرش سنتی با طرح خشتی و رنگ لاکی، مناسب دکوراسیون سنتی و کلاسیک.',
  'طرح خشتی لاکی با حال‌وهوای اصیل ایرانی.',
  'فرش مریم',
  'traditional',
  700,
  2550,
  'اکریلیک هیت‌ست',
  10,
  2500,
  'ماشینی',
  60,
  1
),

(
  'فرش کودک طرح ستاره',
  'kids-star',
  'فرش کودک با طراحی ساده و رنگ‌های شاد، مناسب اتاق کودک.',
  'فرش کودک با طرح ستاره و رنگ‌بندی شاد.',
  'فرش مریم',
  'children',
  700,
  2550,
  'پلی‌استر',
  8,
  2000,
  'ماشینی',
  36,
  1
);


-- ============================================================
-- Product Categories
-- ============================================================

INSERT OR IGNORE INTO product_categories (
  product_id,
  category_id
)
SELECT
  p.id,
  c.id
FROM products p
CROSS JOIN categories c
WHERE p.slug = 'afshan-cream-700'
  AND c.slug = 'classic';


INSERT OR IGNORE INTO product_categories (
  product_id,
  category_id
)
SELECT
  p.id,
  c.id
FROM products p
CROSS JOIN categories c
WHERE p.slug = 'toranj-navy-700'
  AND c.slug = 'classic';


INSERT OR IGNORE INTO product_categories (
  product_id,
  category_id
)
SELECT
  p.id,
  c.id
FROM products p
CROSS JOIN categories c
WHERE p.slug = 'modern-geometric-gray'
  AND c.slug = 'modern';


INSERT OR IGNORE INTO product_categories (
  product_id,
  category_id
)
SELECT
  p.id,
  c.id
FROM products p
CROSS JOIN categories c
WHERE p.slug = 'vintage-gray-cream'
  AND c.slug = 'modern';


INSERT OR IGNORE INTO product_categories (
  product_id,
  category_id
)
SELECT
  p.id,
  c.id
FROM products p
CROSS JOIN categories c
WHERE p.slug = 'traditional-kheshti-red'
  AND c.slug IN ('traditional', 'classic');


INSERT OR IGNORE INTO product_categories (
  product_id,
  category_id
)
SELECT
  p.id,
  c.id
FROM products p
CROSS JOIN categories c
WHERE p.slug = 'kids-star'
  AND c.slug = 'children';


-- ============================================================
-- Product Designs
-- ============================================================

INSERT OR IGNORE INTO product_designs (
  product_id,
  design_id
)
SELECT
  p.id,
  d.id
FROM products p
CROSS JOIN designs d
WHERE p.slug = 'afshan-cream-700'
  AND d.slug = 'afshan';


INSERT OR IGNORE INTO product_designs (
  product_id,
  design_id
)
SELECT
  p.id,
  d.id
FROM products p
CROSS JOIN designs d
WHERE p.slug = 'toranj-navy-700'
  AND d.slug = 'toranj';


INSERT OR IGNORE INTO product_designs (
  product_id,
  design_id
)
SELECT
  p.id,
  d.id
FROM products p
CROSS JOIN designs d
WHERE p.slug = 'modern-geometric-gray'
  AND d.slug = 'geometric';


INSERT OR IGNORE INTO product_designs (
  product_id,
  design_id
)
SELECT
  p.id,
  d.id
FROM products p
CROSS JOIN designs d
WHERE p.slug = 'vintage-gray-cream'
  AND d.slug = 'vintage';


INSERT OR IGNORE INTO product_designs (
  product_id,
  design_id
)
SELECT
  p.id,
  d.id
FROM products p
CROSS JOIN designs d
WHERE p.slug = 'traditional-kheshti-red'
  AND d.slug = 'kheshti';


INSERT OR IGNORE INTO product_designs (
  product_id,
  design_id
)
SELECT
  p.id,
  d.id
FROM products p
CROSS JOIN designs d
WHERE p.slug = 'kids-star'
  AND d.slug = 'geometric';


-- ============================================================
-- Product Materials
-- ============================================================

INSERT OR IGNORE INTO product_materials (
  product_id,
  material_id
)
SELECT
  p.id,
  m.id
FROM products p
CROSS JOIN materials m
WHERE p.slug = 'afshan-cream-700'
  AND m.slug = 'acrylic-heatset';


INSERT OR IGNORE INTO product_materials (
  product_id,
  material_id
)
SELECT
  p.id,
  m.id
FROM products p
CROSS JOIN materials m
WHERE p.slug = 'toranj-navy-700'
  AND m.slug = 'acrylic-heatset';


INSERT OR IGNORE INTO product_materials (
  product_id,
  material_id
)
SELECT
  p.id,
  m.id
FROM products p
CROSS JOIN materials m
WHERE p.slug = 'modern-geometric-gray'
  AND m.slug = 'acrylic-heatset';


INSERT OR IGNORE INTO product_materials (
  product_id,
  material_id
)
SELECT
  p.id,
  m.id
FROM products p
CROSS JOIN materials m
WHERE p.slug = 'vintage-gray-cream'
  AND m.slug = 'polyester';


INSERT OR IGNORE INTO product_materials (
  product_id,
  material_id
)
SELECT
  p.id,
  m.id
FROM products p
CROSS JOIN materials m
WHERE p.slug = 'traditional-kheshti-red'
  AND m.slug = 'acrylic-heatset';


INSERT OR IGNORE INTO product_materials (
  product_id,
  material_id
)
SELECT
  p.id,
  m.id
FROM products p
CROSS JOIN materials m
WHERE p.slug = 'kids-star'
  AND m.slug = 'polyester';


-- ============================================================
-- Product Variants
-- ============================================================

INSERT OR IGNORE INTO product_variants (
  product_id,
  dimension,
  color,
  color_hex,
  sku,
  price,
  compare_at_price,
  stock,
  is_active
)
SELECT
  p.id,
  '6 متری',
  'کرم',
  '#E8DCC8',
  'FM-AFSHAN-700-6M',
  12500000,
  14500000,
  0,
  1
FROM products p
WHERE p.slug = 'afshan-cream-700';


INSERT OR IGNORE INTO product_variants (
  product_id,
  dimension,
  color,
  color_hex,
  sku,
  price,
  compare_at_price,
  stock,
  is_active
)
SELECT
  p.id,
  '9 متری',
  'کرم',
  '#E8DCC8',
  'FM-AFSHAN-700-9M',
  18500000,
  21000000,
  0,
  1
FROM products p
WHERE p.slug = 'afshan-cream-700';


INSERT OR IGNORE INTO product_variants (
  product_id,
  dimension,
  color,
  color_hex,
  sku,
  price,
  compare_at_price,
  stock,
  is_active
)
SELECT
  p.id,
  '12 متری',
  'کرم',
  '#E8DCC8',
  'FM-AFSHAN-700-12M',
  24500000,
  28000000,
  0,
  1
FROM products p
WHERE p.slug = 'afshan-cream-700';


INSERT OR IGNORE INTO product_variants (
  product_id,
  dimension,
  color,
  color_hex,
  sku,
  price,
  compare_at_price,
  stock,
  is_active
)
SELECT
  p.id,
  '6 متری',
  'سرمه‌ای',
  '#172554',
  'FM-TORANJ-700-6M',
  13000000,
  15000000,
  0,
  1
FROM products p
WHERE p.slug = 'toranj-navy-700';


INSERT OR IGNORE INTO product_variants (
  product_id,
  dimension,
  color,
  color_hex,
  sku,
  price,
  compare_at_price,
  stock,
  is_active
)
SELECT
  p.id,
  '9 متری',
  'سرمه‌ای',
  '#172554',
  'FM-TORANJ-700-9M',
  19200000,
  22000000,
  0,
  1
FROM products p
WHERE p.slug = 'toranj-navy-700';


INSERT OR IGNORE INTO product_variants (
  product_id,
  dimension,
  color,
  color_hex,
  sku,
  price,
  compare_at_price,
  stock,
  is_active
)
SELECT
  p.id,
  '6 متری',
  'طوسی',
  '#9CA3AF',
  'FM-GEO-1200-6M',
  15500000,
  17500000,
  0,
  1
FROM products p
WHERE p.slug = 'modern-geometric-gray';


INSERT OR IGNORE INTO product_variants (
  product_id,
  dimension,
  color,
  color_hex,
  sku,
  price,
  compare_at_price,
  stock,
  is_active
)
SELECT
  p.id,
  '9 متری',
  'طوسی',
  '#9CA3AF',
  'FM-GEO-1200-9M',
  22500000,
  25000000,
  0,
  1
FROM products p
WHERE p.slug = 'modern-geometric-gray';


INSERT OR IGNORE INTO product_variants (
  product_id,
  dimension,
  color,
  color_hex,
  sku,
  price,
  compare_at_price,
  stock,
  is_active
)
SELECT
  p.id,
  '6 متری',
  'طوسی کرم',
  '#B8B3A7',
  'FM-VINTAGE-1200-6M',
  14000000,
  16500000,
  0,
  1
FROM products p
WHERE p.slug = 'vintage-gray-cream';


INSERT OR IGNORE INTO product_variants (
  product_id,
  dimension,
  color,
  color_hex,
  sku,
  price,
  compare_at_price,
  stock,
  is_active
)
SELECT
  p.id,
  '6 متری',
  'لاکی',
  '#991B1B',
  'FM-KHESHTI-700-6M',
  12800000,
  15000000,
  0,
  1
FROM products p
WHERE p.slug = 'traditional-kheshti-red';


INSERT OR IGNORE INTO product_variants (
  product_id,
  dimension,
  color,
  color_hex,
  sku,
  price,
  compare_at_price,
  stock,
  is_active
)
SELECT
  p.id,
  '9 متری',
  'لاکی',
  '#991B1B',
  'FM-KHESHTI-700-9M',
  19000000,
  21500000,
  0,
  1
FROM products p
WHERE p.slug = 'traditional-kheshti-red';


INSERT OR IGNORE INTO product_variants (
  product_id,
  dimension,
  color,
  color_hex,
  sku,
  price,
  compare_at_price,
  stock,
  is_active
)
SELECT
  p.id,
  '4 متری',
  'چند رنگ',
  '#F5D0FE',
  'FM-KIDS-STAR-4M',
  7500000,
  8500000,
  0,
  1
FROM products p
WHERE p.slug = 'kids-star';


-- ============================================================
-- Factories
-- ============================================================

INSERT OR IGNORE INTO factories (
  name,
  slug,
  phone,
  whatsapp,
  contact_name,
  address,
  city,
  region,
  notes,
  is_active
)
VALUES
(
  'کارخانه نمونه آران',
  'aran-sample-factory',
  '03100000000',
  '989100000000',
  'محمد احمدی',
  'آران و بیدگل',
  'آران و بیدگل',
  'اصفهان',
  'تأمین‌کننده نمونه برای تست سیستم',
  1
),
(
  'کارخانه نمونه کاشان',
  'kashan-sample-factory',
  '03100000001',
  '989110000000',
  'علی رضایی',
  'کاشان',
  'کاشان',
  'اصفهان',
  'مناسب تولید سفارشی',
  1
);


-- ============================================================
-- Factory Products
-- ============================================================

INSERT OR IGNORE INTO factory_products (
  factory_id,
  variant_id,
  can_weave,
  weaving_days,
  notes,
  is_active
)
SELECT
  f.id,
  v.id,
  1,
  7,
  'تأمین و تولید سفارشی',
  1
FROM factories f
CROSS JOIN product_variants v
WHERE f.slug = 'aran-sample-factory';


-- ============================================================
-- Factory Inventory
-- ============================================================
-- Original TS used Math.floor(Math.random() * 5).
-- Fixed to 2 for deterministic/repeatable seeding.

INSERT OR IGNORE INTO factory_inventory (
  factory_product_id,
  quantity,
  reserved_quantity,
  checked_at,
  notes
)
SELECT
  fp.id,
  2,
  0,
  CURRENT_TIMESTAMP,
  'موجودی اولیه Seed'
FROM factory_products fp
JOIN factories f
  ON f.id = fp.factory_id
WHERE f.slug = 'aran-sample-factory';


-- ============================================================
-- Factory Quotes
-- ============================================================

INSERT OR IGNORE INTO factory_quotes (
  factory_product_id,
  purchase_price,
  valid_from,
  notes
)
SELECT
  fp.id,
  CAST(v.price * 0.75 AS INTEGER),
  CURRENT_TIMESTAMP,
  'قیمت خرید نمونه'
FROM factory_products fp
JOIN factories f
  ON f.id = fp.factory_id
JOIN product_variants v
  ON v.id = fp.variant_id
WHERE f.slug = 'aran-sample-factory';


