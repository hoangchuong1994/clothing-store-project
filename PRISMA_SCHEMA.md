/\*\*

- PRISMA SCHEMA FOR CART SYSTEM
-
- This is the Prisma schema that would be used in production
- when replacing the fake database (src/lib/server/cart/db.ts)
-
- To use this:
- 1.  Replace schema.prisma content with this schema
- 2.  Run: npx prisma migrate dev --name add_cart_tables
- 3.  Update src/lib/server/cart/db.ts to use Prisma queries
- 4.  Run: npx prisma generate
- 5.  Replace fake data queries with real Prisma queries
      \*/

// ============================================================================
// PRISMA SCHEMA - CART SYSTEM TABLES
// ============================================================================

// ============================================================================
// User and Authentication
// ============================================================================

model User {
id String @id @default(cuid())
email String @unique
name String?
password String? // If using password auth (hash it!)

// Relations
cart Cart?
orders Order[]

createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
}

// ============================================================================
// Products
// ============================================================================

model Product {
id String @id @default(cuid())
name String
description String?
price Float // Current price
stock Int @default(0)
image String?

// Relations
variants ProductVariant[]
cartItems CartItem[]
orderItems OrderItem[]

createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

// Indexes for fast lookups
@@index([createdAt])
}

// ============================================================================
// Product Variants (Size, Color, etc.)
// ============================================================================

model ProductVariant {
id String @id @default(cuid())
productId String
product Product @relation(fields: [productId], references: [id], onDelete: Cascade)

// Variant attributes
name String // e.g., "Size", "Color"
values String[] // e.g., ["S", "M", "L"] or ["Red", "Blue"]

// Stock tracking per variant (optional)
variantStock VariantStock[]

createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

@@index([productId])
}

// ============================================================================
// Variant Stock Tracking (Optional - for granular inventory)
// ============================================================================

model VariantStock {
id String @id @default(cuid())
variantId String
variant ProductVariant @relation(fields: [variantId], references: [id], onDelete: Cascade)

// Variant combination (e.g., "size=M,color=Red")
variantKey String @unique
stock Int @default(0)

createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

@@index([variantId])
}

// ============================================================================
// Shopping Cart
// ============================================================================

model Cart {
id String @id @default(cuid())
userId String @unique
user User @relation(fields: [userId], references: [id], onDelete: Cascade)

// Cart items
items CartItem[]

createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

@@index([userId])
}

// ============================================================================
// Cart Items
// ============================================================================

model CartItem {
id String @id @default(cuid())
cartId String
cart Cart @relation(fields: [cartId], references: [id], onDelete: Cascade)

productId String
product Product @relation(fields: [productId], references: [id], onDelete: Cascade)

// Price snapshot (immutable) - prevents price change issues
priceSnapshot Float // Price at time of adding to cart

// Quantity in cart
quantity Int @default(1)

// Variant info
variantId String? // Unique variant combination ID
variantData String? // JSON: { size: "M", color: "Red" }

createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

@@unique([cartId, productId, variantId])
@@index([cartId])
@@index([productId])
}

// ============================================================================
// Orders (for checkout flow)
// ============================================================================

model Order {
id String @id @default(cuid())
userId String
user User @relation(fields: [userId], references: [id], onDelete: Restrict)

// Order totals
subtotal Float // Sum of items \* prices
tax Float // Tax amount
total Float // Grand total

// Shipping info
shippingAddress String? // JSON or separate table

// Order status
status OrderStatus @default(PENDING)

// Line items
items OrderItem[]

createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

@@index([userId])
@@index([status])
@@index([createdAt])
}

model OrderItem {
id String @id @default(cuid())
orderId String
order Order @relation(fields: [orderId], references: [id], onDelete: Cascade)

productId String
product Product @relation(fields: [productId], references: [id], onDelete: Restrict)

// Snapshot of item at order time
name String
priceSnapshot Float
quantity Int

// Variant info
variantId String?
variantData String? // JSON

createdAt DateTime @default(now())

@@index([orderId])
@@index([productId])
}

// ============================================================================
// Enums
// ============================================================================

enum OrderStatus {
PENDING
CONFIRMED
PROCESSING
SHIPPED
DELIVERED
CANCELLED
REFUNDED
}

// ============================================================================
// MIGRATION STEPS TO USE THIS SCHEMA
// ============================================================================

/\*

1. Create migration:
   npx prisma migrate dev --name add_cart_system

2. Seed database with products:
   npx prisma db seed

3. Update src/lib/server/cart/db.ts:

   Replace fake queries with:

   export async function getProduct(productId: string) {
   return await prisma.product.findUnique({
   where: { id: productId },
   include: { variants: true },
   });
   }

   export async function getUserCart(userId: string) {
   return await prisma.cart.findUnique({
   where: { userId },
   include: { items: true },
   });
   }

   export async function checkStock(productId: string, quantity: number) {
   const product = await prisma.product.findUnique({
   where: { id: productId },
   });
   return {
   available: product?.stock ?? 0,
   isAvailable: (product?.stock ?? 0) >= quantity,
   };
   }

4. Update authentication:
   In src/lib/server/actions/auth.ts, integrate with your auth provider
5. Test all cart operations with real database

6. Consider adding these optimizations:
   - Indexes for fast lookups
   - Cascade delete for data integrity
   - Transactions for concurrent operations
   - Caching layer for frequently accessed products
   - Batch operations for performance
     \*/

// ============================================================================
// DATABASE QUERIES FOR CART OPERATIONS
// ============================================================================

/\*
// ADD TO CART
const cart = await prisma.cart.upsert({
where: { userId },
create: { userId },
update: {},
});

const existingItem = await prisma.cartItem.findUnique({
where: {
cartId_productId_variantId: {
cartId: cart.id,
productId,
variantId: variantId || null,
},
},
});

if (existingItem) {
// Update quantity
await prisma.cartItem.update({
where: { id: existingItem.id },
data: { quantity: { increment: addedQuantity } },
});
} else {
// Create new item
await prisma.cartItem.create({
data: {
cartId: cart.id,
productId,
priceSnapshot,
quantity,
variantId,
variantData,
},
});
}

// UPDATE QUANTITY
await prisma.cartItem.update({
where: { id: cartItemId },
data: { quantity },
});

// REMOVE ITEM
await prisma.cartItem.delete({
where: { id: cartItemId },
});

// CLEAR CART
await prisma.cartItem.deleteMany({
where: { cartId },
});

// GET CART WITH ITEMS
const cart = await prisma.cart.findUnique({
where: { userId },
include: {
items: {
include: { product: true },
},
},
});

// MERGE CARTS
async function mergeCartsDb(userId: string, guestItems: CartItem[]) {
// Get user's existing cart
let cart = await prisma.cart.findUnique({
where: { userId },
include: { items: true },
});

if (!cart) {
cart = await prisma.cart.create({
data: { userId },
include: { items: true },
});
}

// Use transaction for atomicity
return await prisma.$transaction(async (tx) => {
// Merge logic...
// Update existing items, create new ones
// Handle quantity limits, stock checks
});
}

// CHECKOUT - CREATE ORDER
async function createOrder(userId: string) {
const cart = await prisma.cart.findUnique({
where: { userId },
include: { items: { include: { product: true } } },
});

if (!cart || cart.items.length === 0) {
throw new Error('Cart is empty');
}

// Calculate totals
let subtotal = 0;
for (const item of cart.items) {
subtotal += item.priceSnapshot _ item.quantity;
}
const tax = subtotal _ 0.08;
const total = subtotal + tax;

// Create order in transaction
return await prisma.$transaction(async (tx) => {
const order = await tx.order.create({
data: {
userId,
subtotal,
tax,
total,
items: {
create: cart.items.map((item) => ({
productId: item.productId,
name: item.product.name,
priceSnapshot: item.priceSnapshot,
quantity: item.quantity,
variantId: item.variantId,
variantData: item.variantData,
})),
},
},
});

    // Reduce stock
    for (const item of cart.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // Clear cart
    await tx.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return order;

});
}
\*/

export {};
