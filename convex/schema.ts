import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    experiences: defineTable({
        company: v.string(),
        logo: v.string(),
        period: v.string(),
        role: v.string(),
        description: v.string(),
        order: v.number(),
        isDeleted: v.optional(v.boolean()),
    }),
    writings: defineTable({
        year: v.string(),
        title: v.string(),
        order: v.number(),
        isDeleted: v.optional(v.boolean()),
    }),
    connectsCards: defineTable({
        title: v.string(), // e.g. "Business Networking", "NY Mates"
        colorFrom: v.optional(v.string()), // Gradient start e.g., "#2A2B2E"
        colorTo: v.optional(v.string()),   // Gradient end e.g., "#121213"
        name: v.string(),
        role: v.string(),
        company: v.string(),
        email: v.string(),
        phone: v.string(),
        website: v.optional(v.string()),
        github: v.optional(v.string()),
        linkedin: v.optional(v.string()),
        instagram: v.optional(v.string()),
        order: v.number(),
        isDeleted: v.optional(v.boolean()),
    }),
    projects: defineTable({
        icon: v.string(),
        name: v.string(),
        year: v.string(),
        description: v.string(),
        order: v.number(),
        isDeleted: v.optional(v.boolean()),
    }),
    patents: defineTable({
        year: v.string(),
        title: v.string(),
        description: v.string(),
        order: v.number(),
        isDeleted: v.optional(v.boolean()),
    }),
    publications: defineTable({
        year: v.string(),
        title: v.string(),
        description: v.string(),
        order: v.number(),
        isDeleted: v.optional(v.boolean()),
    }),
    videos: defineTable({
        title: v.string(),
        url: v.string(),
        description: v.string(),
        order: v.number(),
        isDeleted: v.optional(v.boolean()),
    }),
    settings: defineTable({
        key: v.string(),
        value: v.any(),
    }),
    messages: defineTable({
        platform: v.string(),
        message: v.string(),
        locationData: v.optional(v.string()), // JSON string of location data
        userAgent: v.optional(v.string()),
    }),
});
