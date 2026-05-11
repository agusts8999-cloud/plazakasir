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
  packageType: text("package_type").default("FREE"), 
  packageExpiredAt: timestamp("package_expired_at"),
  isMaster: boolean("is_master").default(false).notNull(), 
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
  // Legacy Member fields for compatibility
  code: text("code"),
  businessName: text("business_name"),
  businessCategoryId: uuid("business_category_id"),
  address: text("address"),
  website: text("website"),
  status: text("status").default("ACTIVE"),
  type: text("type"), // ADMIN, USER, CUSTOMER
  isMainCompany: boolean("is_main_company").default(false),
  roleId: uuid("role_id"),
  registrationDate: timestamp("registration_date").defaultNow(),
  lastLoginAt: timestamp("last_login_at"),
  isSuperAdmin: boolean("is_super_admin").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

// Aliases for legacy code compatibility
export const members = users; 

// ==========================================
// 3. RBAC: Roles & Permissions
// ==========================================
export const roles = pgTable("roles", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  businessId: uuid("business_id").references(() => businesses.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  permissions: text("permissions").default("[]"), // Legacy JSON string for compatibility
  isSystem: boolean("is_system").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const permissions = pgTable("permissions", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  code: text("code").unique().notNull(), 
  name: text("name").notNull(),
  category: text("category"), 
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
  type: text("type"), 
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
  
  // Legacy Marketplace Fields
  promoPrice: decimal("promo_price", { precision: 12, scale: 2 }),
  type: text("type").default("PAID"), 
  status: text("status").default("LAUNCHED"),
  licenseId: uuid("license_id"),
  releaseInfoId: uuid("release_info_id"),
  version: text("version").default("1.0.0"),
  releaseDate: timestamp("release_date"),
  supportStatus: text("support_status").default("ACTIVE"),
  image: text("image"),
  downloadUrl: text("download_url"),
  youtubeUrl: text("youtube_url"),
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
  memberId: uuid("member_id").references(() => users.id), // Legacy link to users (Member)
  cashierUserId: uuid("cashier_user_id").references(() => users.id),
  subtotal: decimal("subtotal", { precision: 12, scale: 2 }).default("0").notNull(),
  discount: decimal("discount", { precision: 12, scale: 2 }).default("0").notNull(),
  tax: decimal("tax", { precision: 12, scale: 2 }).default("0").notNull(),
  grandTotal: decimal("grand_total", { precision: 12, scale: 2 }).default("0").notNull(),
  paymentMethod: text("payment_method"), 
  status: text("status").default("COMPLETED").notNull(),
  productId: uuid("product_id").references(() => products.id), // Legacy link
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Alias for legacy code compatibility
export const purchases = salesTransactions;

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
// 8. Platform: CMS & Settings
// ==========================================
export const settings = pgTable("settings", {
  key: text("key").notNull().primaryKey(),
  value: text("value").notNull(),
  group: text("group").default("GENERAL").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const pages = pgTable("pages", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

export const licenses = pgTable("licenses", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  deletedAt: timestamp("deleted_at"),
});

export const releaseInfos = pgTable("release_infos", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  estimateDate: text("estimate_date"),
  deletedAt: timestamp("deleted_at"),
});

export const productFeatures = pgTable("product_features", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
});

export const productRequirements = pgTable("product_requirements", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  os: text("os"),
  ram: text("ram"),
  storage: text("storage"),
  other: text("other"),
});

// ==========================================
// 9. Platform: Subscriptions & Logs
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
  entity: text("entity"), // For compatibility
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

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  business: one(businesses, {
    fields: [categories.businessId],
    references: [businesses.id],
  }),
  products: many(products),
  users: many(users),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  businesses: many(businessUsers),
  businessCategory: one(categories, {
    fields: [users.businessCategoryId],
    references: [categories.id],
  }),
  purchases: many(salesTransactions, { relationName: "member_purchases" }),
  roleData: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
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

export const productsRelations = relations(products, ({ one, many }) => ({
  business: one(businesses, {
    fields: [products.businessId],
    references: [businesses.id],
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  license: one(licenses, {
    fields: [products.licenseId],
    references: [licenses.id],
  }),
  releaseInfo: one(releaseInfos, {
    fields: [products.releaseInfoId],
    references: [releaseInfos.id],
  }),
  features: many(productFeatures),
  requirements: one(productRequirements, {
    fields: [products.id],
    references: [productRequirements.productId],
  }),
}));

export const salesTransactionsRelations = relations(salesTransactions, ({ one, many }) => ({
  business: one(businesses, {
    fields: [salesTransactions.businessId],
    references: [businesses.id],
  }),
  member: one(users, {
    fields: [salesTransactions.memberId],
    references: [users.id],
    relationName: "member_purchases",
  }),
  cashier: one(users, {
    fields: [salesTransactions.cashierUserId],
    references: [users.id],
    relationName: "cashier_transactions",
  }),
  customer: one(customers, {
    fields: [salesTransactions.customerId],
    references: [customers.id],
  }),
  product: one(products, {
    fields: [salesTransactions.productId],
    references: [products.id],
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

export const productFeaturesRelations = relations(productFeatures, ({ one }) => ({
  product: one(products, {
    fields: [productFeatures.productId],
    references: [products.id],
  }),
}));

export const productRequirementsRelations = relations(productRequirements, ({ one }) => ({
  product: one(products, {
    fields: [productRequirements.productId],
    references: [products.id],
  }),
}));
export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  user: one(users, {
    fields: [activityLogs.userId],
    references: [users.id],
  }),
  business: one(businesses, {
    fields: [activityLogs.businessId],
    references: [businesses.id],
  }),
}));

// Aliases for relations to support legacy code queries
export const membersRelations = usersRelations;
export const purchasesRelations = salesTransactionsRelations;
