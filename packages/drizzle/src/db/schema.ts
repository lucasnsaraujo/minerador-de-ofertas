import { pgTable, text, integer, uuid, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import * as t from "drizzle-orm/pg-core"

export const rolesEnum = pgEnum("roles", ["user", "admin"])
export const offerTypeEnum = pgEnum("offer_type", ["infoproduto", "nutra"])
export const offerRegionEnum = pgEnum("offer_region", ["brasil", "latam", "eua", "europa"])
export const scrapingStatusEnum = pgEnum("scraping_status", ["success", "failed", "partial"])

export const userTable = pgTable(
  "user",
  {
    id: uuid().defaultRandom().primaryKey(),
    name: text("name").notNull(),
    age: integer(),
    image: text("image"),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    role: rolesEnum().default("user"),
  },
  (table) => [t.uniqueIndex("email_idx").on(table.email)]
)

export const sessionTable = pgTable("session", {
  id: uuid("id").primaryKey().defaultRandom(), // Unique session ID
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id), // FK to users table
  token: text("token").notNull(), // Session token
  expiresAt: timestamp("expires_at").notNull(), // Expiry timestamp
  ipAddress: text("ip_address"), // Optional IP address
  userAgent: text("user_agent"), // Optional user agent
  createdAt: timestamp("created_at").defaultNow().notNull(), // Creation time
  updatedAt: timestamp("updated_at").defaultNow().notNull(), // Last update time
})

export const sessionToUserRelations = relations(sessionTable, ({ one }) => ({
  user: one(userTable, {
    fields: [sessionTable.userId],
    references: [userTable.id],
  }),
}))

export const accountTable = pgTable("account", {
  id: uuid("id").primaryKey().defaultRandom(), // Unique ID for account
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id), // FK to user

  accountId: text("account_id").notNull(), // From SSO or same as userId
  providerId: text("provider_id").notNull(), // ID of the auth provider

  accessToken: text("access_token"), // Access token from provider
  refreshToken: text("refresh_token"), // Refresh token from provider
  accessTokenExpiresAt: timestamp("access_token_expires_at"), // Access token expiry
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"), // Refresh token expiry

  scope: text("scope"), // Scope of the token
  idToken: text("id_token"), // ID token from provider

  password: text("password"), // Optional password (e.g. for email/pass login)

  createdAt: timestamp("created_at").defaultNow().notNull(), // Created time
  updatedAt: timestamp("updated_at").defaultNow().notNull(), // Updated time
})

export const verificationTable = pgTable("verification", {
  id: uuid("id").primaryKey().defaultRandom(), // Unique ID for verification
  identifier: text("identifier").notNull(), // Identifier for the request
  value: text("value").notNull(), // Value to be verified
  expiresAt: timestamp("expires_at").notNull(), // Expiry time
  createdAt: timestamp("created_at").defaultNow().notNull(), // Created timestamp
  updatedAt: timestamp("updated_at").defaultNow().notNull(), // Updated timestamp
})

// DEPRECATED - Kept for data preservation, can be removed in future migration
export const exampleTable = pgTable("example", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// DEPRECATED - Kept for data preservation, can be removed in future migration
export const messageTable = pgTable("message", {
  id: uuid().defaultRandom().primaryKey(),
  message: text("message").notNull(),
  senderId: uuid("sender_id").references(() => userTable.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const messageToUserRelations = relations(messageTable, ({ one }) => ({
  sender: one(userTable, {
    fields: [messageTable.senderId],
    references: [userTable.id],
  }),
}))

export const offerTable = pgTable("offer", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id),
  url: text("url").notNull(),
  name: text("name").notNull(),
  type: offerTypeEnum("type").notNull(),
  region: offerRegionEnum("region").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const offerSnapshotTable = pgTable(
  "offer_snapshot",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    offerId: uuid("offer_id")
      .notNull()
      .references(() => offerTable.id, { onDelete: "cascade" }),
    timestamp: timestamp("timestamp").defaultNow().notNull(),
    campaignsCount: integer("campaigns_count").notNull(),
    creativesCount: integer("creatives_count").notNull(),
    impressions: integer("impressions"),
    reach: integer("reach"),
    campaignStartDate: timestamp("campaign_start_date"),
    campaignEndDate: timestamp("campaign_end_date"),
    adTexts: t.jsonb("ad_texts"), // Array of ad copy texts
    pageName: text("page_name"), // Facebook page name
    scrapingStatus: scrapingStatusEnum("scraping_status").default("success").notNull(),
    errorMessage: text("error_message"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [t.index("offer_snapshot_offer_id_idx").on(table.offerId), t.index("offer_snapshot_timestamp_idx").on(table.timestamp)]
)

export const offerToUserRelations = relations(offerTable, ({ one, many }) => ({
  user: one(userTable, {
    fields: [offerTable.userId],
    references: [userTable.id],
  }),
  snapshots: many(offerSnapshotTable),
}))

export const offerSnapshotToOfferRelations = relations(offerSnapshotTable, ({ one }) => ({
  offer: one(offerTable, {
    fields: [offerSnapshotTable.offerId],
    references: [offerTable.id],
  }),
}))
