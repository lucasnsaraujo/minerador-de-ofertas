import { z } from "zod"

export const zod = {
  zodSignup: z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
    email: z.string().email("Please enter a valid email address").min(1, "Email is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  }),
  zodUpdatePassword: z.object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  }),

  zodLogin: z.object({
    email: z.string().email("Please enter a valid email address").min(1, "Email is required"),
    password: z.string().min(1, "Password is required"),
  }),

  // Offer enums
  zodOfferType: z.enum(["infoproduto", "nutra"]),
  zodOfferRegion: z.enum(["brasil", "latam", "eua", "europa"]),
  zodScrapingStatus: z.enum(["success", "failed", "partial"]),

  // Offer schemas
  zodCreateOffer: z.object({
    url: z.string().url("Please enter a valid URL").min(1, "URL is required"),
    name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
    type: z.enum(["infoproduto", "nutra"]),
    region: z.enum(["brasil", "latam", "eua", "europa"]),
  }),

  zodUpdateOffer: z.object({
    offerId: z.string().uuid("Invalid offer ID"),
    name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters").optional(),
    type: z.enum(["infoproduto", "nutra"]).optional(),
    region: z.enum(["brasil", "latam", "eua", "europa"]).optional(),
    isActive: z.boolean().optional(),
  }),

  zodDeleteOffer: z.object({
    offerId: z.string().uuid("Invalid offer ID"),
  }),

  zodGetOfferDetails: z.object({
    offerId: z.string().uuid("Invalid offer ID"),
  }),

  zodGetOffers: z.object({
    type: z.enum(["infoproduto", "nutra"]).optional(),
    region: z.enum(["brasil", "latam", "eua", "europa"]).optional(),
    limit: z.number().min(1).max(100).default(20),
    offset: z.number().min(0).default(0),
  }),

  zodGetOfferChartData: z.object({
    offerId: z.string().uuid("Invalid offer ID"),
    days: z.number().min(1).max(30).default(7),
  }),

  zodGetOfferSnapshots: z.object({
    offerId: z.string().uuid("Invalid offer ID"),
    limit: z.number().min(1).max(100).default(50),
    offset: z.number().min(0).default(0),
  }),
}
