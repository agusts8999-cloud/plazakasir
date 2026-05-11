import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  boolean,
  decimal,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

// ==========================================
// 1. Master Data: Businesses (Tenants)
// ==========================================
export const businesses = pgTable("businesses", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  code: text("code").unique(),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  type: text("type"), // RETAIL, F&B, SERVICE, etc.
  ownerName: text("owner_name"),
  phone: text("phone"),
  email: text("email"),
  address: text("address"),
  city: text("city"),
  province: text("province"),
  country: text("country").default("Indonesia"),
  postalCode: text("postal_code"),
  logo: text("logo"),
  timezone: text("timezone").default("Asia/Jakarta"),
  currency: text("currency").default("IDR"),
  packageType: text("package_type").default("FREE"), // FREE, BASIC, PRO, ENTERPRISE
  packageExpiredAt: timestamp("package_expired_at"),
  isMaster: boolean("is_master").default(false).notNull(), // TRUE for PlazaKasir Central
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

// ==========================================
// 2. Identity: Users Global
// ==========================================
export const users = pgTable("users", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  fullName: text("full_name").notNull(),
  username: text("username").unique(),
  email: text("email").unique().notNull(),
  phone: text("phone"),
  passwordHash: text("password_hash"),
  avatar: text("avatar"),
  lastLoginAt: timestamp("last_login_at"),
  isSuperAdmin: boolean("is_super_admin").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

// ==========================================
// 3. RBAC: Roles & Permissions
// ==========================================
export const roles = pgTable("roles", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  businessId: uuid("business_id").references(() => businesses.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  isSystem: boolean("is_system").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const permissions = pgTable("permissions", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  code: text("code").unique().notNull(), // e.g., 'product.create'
  name: text("name").notNull(),
  category: text("category"), // e.g., 'Inventory'
});

export const rolePermissions = pgTable("role_permissions", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  roleId: uuid("role_id").references(() => roles.id, { onDelete: "cascade" }).notNull(),
  permissionId: uuid("permission_id").references(() => permissions.id, { onDelete: "cascade" }).notNull(),
});

// ==========================================
// 4. Relations: User to Business
// ==========================================
export const businessUsers = pgTable("business_users", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  businessId: uuid("business_id").references(() => businesses.id, { onDelete: "cascade" }).notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  roleId: uuid("role_id").references(() => roles.id),
  isOwner: boolean("is_owner").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ==========================================
// 5. Tenant Data: Infrastructure
// ==========================================
export const branches = pgTable("branches", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  businessId: uuid("business_id").references(() => businesses.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  address: text("address"),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

export const devices = pgTable("devices", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  businessId: uuid("business_id").references(() => businesses.id, { onDelete: "cascade" }).notNull(),
  branchId: uuid("branch_id").references(() => branches.id),
  name: text("name").notNull(),
  type: text("type"), // POS, KIOSK, TABLET
  serialNumber: text("serial_number").unique(),
  isActive: boolean("is_active").default(true).notNull(),
  lastOnlineAt: timestamp("last_online_at"),
});

// ==========================================
// 6. Tenant Data: Inventory & Catalog
// ==========================================
export const categories = pgTable("categories", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  businessId: uuid("business_id").references(() => businesses.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

export const products = pgTable("products", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  businessId: uuid("business_id").references(() => businesses.id, { onDelete: "cascade" }).notNull(),
  categoryId: uuid("category_id").references(() => categories.id),
  sku: text("sku"),
  barcode: text("barcode"),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 12, scale: 2 }).default("0").notNull(),
  stock: decimal("stock", { precision: 12, scale: 2 }).default("0").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

// ==========================================
// 7. Tenant Data: Sales & CRM
// ==========================================
export const customers = pgTable("customers", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  businessId: uuid("business_id").references(() => businesses.id, { onDelete: "cascade" }).notNull(),
  code: text("code"),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

export const salesTransactions = pgTable("sales_transactions", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  businessId: uuid("business_id").references(() => businesses.id, { onDelete: "cascade" }).notNull(),
  invoiceNumber: text("invoice_number").unique().notNull(),
  customerId: uuid("customer_id").references(() => customers.id),
  cashierUserId: uuid("cashier_user_id").references(() => users.id),
  subtotal: decimal("subtotal", { precision: 12, scale: 2 }).default("0").notNull(),
  discount: decimal("discount", { precision: 12, scale: 2 }).default("0").notNull(),
  tax: decimal("tax", { precision: 12, scale: 2 }).default("0").notNull(),
  grandTotal: decimal("grand_total", { precision: 12, scale: 2 }).default("0").notNull(),
  paymentMethod: text("payment_method"), // CASH, QRIS, DEBIT, TRANSFER
  status: text("status").default("COMPLETED").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const salesTransactionItems = pgTable("sales_transaction_items", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  businessId: uuid("business_id").references(() => businesses.id, { onDelete: "cascade" }).notNull(),
  transactionId: uuid("transaction_id").references(() => salesTransactions.id, { onDelete: "cascade" }).notNull(),
  productId: uuid("product_id").references(() => products.id).notNull(),
  qty: decimal("qty", { precision: 12, scale: 2 }).notNull(),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  total: decimal("total", { precision: 12, scale: 2 }).notNull(),
});

// ==========================================
// 8. Platform: Subscriptions & Logs
// ==========================================
export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  businessId: uuid("business_id").references(() => businesses.id, { onDelete: "cascade" }).notNull(),
  packageName: text("package_name").notNull(),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  startedAt: timestamp("started_at").notNull(),
  expiredAt: timestamp("expired_at").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const activityLogs = pgTable("activity_logs", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  businessId: uuid("business_id").references(() => businesses.id, { onDelete: "cascade" }),
  userId: uuid("user_id").references(() => users.id),
  action: text("action").notNull(),
  description: text("description"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ==========================================
// RELATIONS
// ==========================================
export const businessesRelations = relations(businesses, ({ many }) => ({
  users: many(businessUsers),
  branches: many(branches),
  products: many(products),
  customers: many(customers),
  subscriptions: many(subscriptions),
}));

export const usersRelations = relations(users, ({ many }) => ({
  businesses: many(businessUsers),
}));

export const businessUsersRelations = relations(businessUsers, ({ one }) => ({
  business: one(businesses, {
    fields: [businessUsers.businessId],
    references: [businesses.id],
  }),
  user: one(users, {
    fields: [businessUsers.userId],
    references: [users.id],
  }),
  role: one(roles, {
    fields: [businessUsers.roleId],
    references: [roles.id],
  }),
}));

export const rolesRelations = relations(roles, ({ one, many }) => ({
  business: one(businesses, {
    fields: [roles.businessId],
    references: [businesses.id],
  }),
  permissions: many(rolePermissions),
}));

export const productsRelations = relations(products, ({ one }) => ({
  business: one(businesses, {
    fields: [products.businessId],
    references: [businesses.id],
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}));

export const salesTransactionsRelations = relations(salesTransactions, ({ one, many }) => ({
  business: one(businesses, {
    fields: [salesTransactions.businessId],
    references: [businesses.id],
  }),
  customer: one(customers, {
    fields: [salesTransactions.customerId],
    references: [customers.id],
  }),
  items: many(salesTransactionItems),
}));

export const salesTransactionItemsRelations = relations(salesTransactionItems, ({ one }) => ({
  transaction: one(salesTransactions, {
    fields: [salesTransactionItems.transactionId],
    references: [salesTransactions.id],
  }),
  product: one(products, {
    fields: [salesTransactionItems.productId],
    references: [products.id],
  }),
}));
