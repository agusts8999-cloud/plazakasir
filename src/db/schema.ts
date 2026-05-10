import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  boolean,
  decimal,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import type { AdapterAccount } from "next-auth/adapters";

export const roles = pgTable("Role", {
  id: text("id").notNull().primaryKey(),
  name: text("name").notNull(),
  permissions: text("permissions").default("[]"), // JSON string array of menu keys
});

export const users = pgTable("User", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  password: text("password"),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  roleId: text("roleId").references(() => roles.id),
  image: text("image"),
});

export const accounts = pgTable(
  "Account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] }),
  })
);

export const sessions = pgTable("Session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "VerificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

// --- PlazaKasir Tables ---

export const categories = pgTable("Category", {
  id: text("id").notNull().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
});

export const licenses = pgTable("License", {
  id: text("id").notNull().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
});

export const releaseInfos = pgTable("ReleaseInfo", {
  id: text("id").notNull().primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  estimateDate: text("estimateDate"),
});

export const products = pgTable("Product", {
  id: text("id").notNull().primaryKey(),
  sku: text("sku").unique(),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).default("0").notNull(),
  promoPrice: decimal("promoPrice", { precision: 10, scale: 2 }),
  type: text("type").default("PAID").notNull(), // PAID, FREE, PROMO
  
  status: text("status").default("LAUNCHED").notNull(), // LAUNCHED, COMING_SOON
  releaseInfoId: text("releaseInfoId").references(() => releaseInfos.id),

  categoryId: text("categoryId").references(() => categories.id),
  licenseId: text("licenseId").references(() => licenses.id),
  
  version: text("version").default("1.0.0"),
  releaseDate: timestamp("releaseDate", { mode: "date" }).defaultNow(),
  supportStatus: text("supportStatus").default("ACTIVE"), // ACTIVE, EOL, BETA
  
  image: text("image"),
  downloadUrl: text("downloadUrl"),
  youtubeUrl: text("youtubeUrl"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});

export const productFeatures = pgTable("ProductFeature", {
  id: text("id").notNull().primaryKey(),
  productId: text("productId")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
});

export const productRequirements = pgTable("ProductRequirement", {
  id: text("id").notNull().primaryKey(),
  productId: text("productId")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  os: text("os"),
  ram: text("ram"),
  storage: text("storage"),
  other: text("other"),
});

export const productKeys = pgTable("ProductKey", {
  id: text("id").notNull().primaryKey(),
  key: text("key").notNull().unique(),
  productId: text("productId")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  userId: text("userId"),
  status: text("status").default("UNUSED").notNull(), // UNUSED, USED
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
});

export const settings = pgTable("Setting", {
  key: text("key").notNull().primaryKey(),
  value: text("value").notNull(),
  group: text("group").default("GENERAL").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});

export const pages = pgTable("Page", {
  id: text("id").notNull().primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ one }) => ({
  roleData: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
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

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
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
