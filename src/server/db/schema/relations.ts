import { relations } from 'drizzle-orm'

import { users } from './tables/users'
import { sessions } from './tables/sessions'

import { categories } from './tables/categories'
import { designs } from './tables/designs'
import { materials } from './tables/materials'

import { products } from './tables/products'
import { productVariants } from './tables/product-variants'
import { variantImages } from './tables/variant-images'

import { productCategories } from './tables/product-categories'
import { productDesigns } from './tables/product-designs'
import { productMaterials } from './tables/product-materials'

import { factories } from './tables/factories'
import { factoryProducts } from './tables/factory-products'
import { factoryInventory } from './tables/factory-inventory'
import { factoryQuotes } from './tables/factory-quotes'

import { orders } from './tables/orders'
import { orderItems } from './tables/order-items'
import { orderItemSources } from './tables/order-item-sources'

import { inquiries } from './tables/inquiries'
import { carts } from './tables/carts'
import { cartItems } from './tables/cart-items'

// ─────────────────────────────────────────────
// Users
// ─────────────────────────────────────────────

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  orders: many(orders),
  inquiries: many(inquiries),
  factoryQuotes: many(factoryQuotes),
}))

// ─────────────────────────────────────────────
// Sessions
// ─────────────────────────────────────────────

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))

// ─────────────────────────────────────────────
// Products
// ─────────────────────────────────────────────

export const productsRelations = relations(products, ({ many }) => ({
  variants: many(productVariants),

  categories: many(productCategories),

  designs: many(productDesigns),

  materials: many(productMaterials),

  inquiries: many(inquiries),
}))

// ─────────────────────────────────────────────
// Product Variants
// ─────────────────────────────────────────────




export const productVariantsRelations = relations(
  productVariants,
  ({ one, many }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),

    images: many(variantImages),

    factoryProducts: many(factoryProducts),

    orderItems: many(orderItems),

    inquiries: many(inquiries),
  }),
)

// ─────────────────────────────────────────────
// Variant Images
// ─────────────────────────────────────────────

export const variantImagesRelations = relations(
  variantImages,
  ({ one }) => ({
    variant: one(productVariants, {
      fields: [variantImages.variantId],
      references: [productVariants.id],
    }),
  }),
)

// ─────────────────────────────────────────────
// Categories
// ─────────────────────────────────────────────

export const categoriesRelations = relations(
  categories,
  ({ many }) => ({
    products: many(productCategories),
  }),
)

// ─────────────────────────────────────────────
// Designs
// ─────────────────────────────────────────────

export const designsRelations = relations(designs, ({ many }) => ({
  products: many(productDesigns),
}))

// ─────────────────────────────────────────────
// Materials
// ─────────────────────────────────────────────

export const materialsRelations = relations(
  materials,
  ({ many }) => ({
    products: many(productMaterials),
  }),
)

// ─────────────────────────────────────────────
// Product Categories
// ─────────────────────────────────────────────

export const productCategoriesRelations = relations(
  productCategories,
  ({ one }) => ({
    product: one(products, {
      fields: [productCategories.productId],
      references: [products.id],
    }),

    category: one(categories, {
      fields: [productCategories.categoryId],
      references: [categories.id],
    }),
  }),
)

// ─────────────────────────────────────────────
// Product Designs
// ─────────────────────────────────────────────

export const productDesignsRelations = relations(
  productDesigns,
  ({ one }) => ({
    product: one(products, {
      fields: [productDesigns.productId],
      references: [products.id],
    }),

    design: one(designs, {
      fields: [productDesigns.designId],
      references: [designs.id],
    }),
  }),
)

// ─────────────────────────────────────────────
// Product Materials
// ─────────────────────────────────────────────

export const productMaterialsRelations = relations(
  productMaterials,
  ({ one }) => ({
    product: one(products, {
      fields: [productMaterials.productId],
      references: [products.id],
    }),

    material: one(materials, {
      fields: [productMaterials.materialId],
      references: [materials.id],
    }),
  }),
)

// ─────────────────────────────────────────────
// Factories
// ─────────────────────────────────────────────

export const factoriesRelations = relations(
  factories,
  ({ many }) => ({
    products: many(factoryProducts),

    inventory: many(factoryInventory),

    quotes: many(factoryQuotes),

    orderItemSources: many(orderItemSources),
  }),
)

// ─────────────────────────────────────────────
// Factory Products
// ─────────────────────────────────────────────

export const factoryProductsRelations = relations(
  factoryProducts,
  ({ one, many }) => ({
    factory: one(factories, {
      fields: [factoryProducts.factoryId],
      references: [factories.id],
    }),

    variant: one(productVariants, {
      fields: [factoryProducts.variantId],
      references: [productVariants.id],
    }),

    inventory: many(factoryInventory),

    quotes: many(factoryQuotes),
  }),
)

// ─────────────────────────────────────────────
// Factory Inventory
// ─────────────────────────────────────────────

export const factoryInventoryRelations = relations(
  factoryInventory,
  ({ one }) => ({
    factoryProduct: one(factoryProducts, {
      fields: [factoryInventory.factoryProductId],
      references: [factoryProducts.id],
    }),
  }),
)

// ─────────────────────────────────────────────
// Factory Quotes
// ─────────────────────────────────────────────

export const factoryQuotesRelations = relations(
  factoryQuotes,
  ({ one }) => ({
    factoryProduct: one(factoryProducts, {
      fields: [factoryQuotes.factoryProductId],
      references: [factoryProducts.id],
    }),

    quotedByUser: one(users, {
      fields: [factoryQuotes.quotedByUserId],
      references: [users.id],
    }),
  }),
)

// ─────────────────────────────────────────────
// Orders
// ─────────────────────────────────────────────

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),

  items: many(orderItems),
}))

// ─────────────────────────────────────────────
// Order Items
// ─────────────────────────────────────────────

export const orderItemsRelations = relations(
  orderItems,
  ({ one, many }) => ({
    order: one(orders, {
      fields: [orderItems.orderId],
      references: [orders.id],
    }),

    variant: one(productVariants, {
      fields: [orderItems.variantId],
      references: [productVariants.id],
    }),

    sources: many(orderItemSources),
  }),
)

// ─────────────────────────────────────────────
// Order Item Sources
// ─────────────────────────────────────────────

export const orderItemSourcesRelations = relations(
  orderItemSources,
  ({ one }) => ({
    orderItem: one(orderItems, {
      fields: [orderItemSources.orderItemId],
      references: [orderItems.id],
    }),

    factory: one(factories, {
      fields: [orderItemSources.factoryId],
      references: [factories.id],
    }),
  }),
)

// ─────────────────────────────────────────────
// Inquiries
// ─────────────────────────────────────────────

export const inquiriesRelations = relations(
  inquiries,
  ({ one }) => ({
    user: one(users, {
      fields: [inquiries.userId],
      references: [users.id],
    }),

    product: one(products, {
      fields: [inquiries.productId],
      references: [products.id],
    }),

    variant: one(productVariants, {
      fields: [inquiries.variantId],
      references: [productVariants.id],
    }),
  }),
)



// Carts


export const cartsRelations = relations(
  carts,
  ({ many }) => ({
    items: many(cartItems),
  }),
)

export const cartItemsRelations = relations(
  cartItems,
  ({ one }) => ({
    cart: one(carts, {
      fields: [cartItems.cartId],
      references: [carts.id],
    }),

    variant: one(productVariants, {
      fields: [cartItems.variantId],
      references: [productVariants.id],
    }),
  }),
)