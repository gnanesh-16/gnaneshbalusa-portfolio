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
        locationData: v.optional(v.string()),
        userAgent: v.optional(v.string()),
    }),
    availableSlots: defineTable({
        date: v.string(),         // ISO date "2026-03-15"
        startTime: v.string(),    // "10:00 AM"
        endTime: v.string(),      // "10:30 AM"
        isBooked: v.boolean(),
        bookedRequestId: v.optional(v.string()),
        isDeleted: v.optional(v.boolean()),
    }),
    bookingRequests: defineTable({
        slotId: v.string(),
        name: v.string(),
        email: v.string(),
        note: v.optional(v.string()),
        meetType: v.optional(v.string()), // "Interview" | "Coffee Chat" | "Connect" | "General Meeting"
        gmeetLink: v.optional(v.string()),
        status: v.union(v.literal('pending'), v.literal('approved'), v.literal('rejected')),
        createdAt: v.number(),
    }),
    courses: defineTable({
        title: v.string(),
        description: v.string(),
        thumbnail: v.optional(v.string()),       // image URL
        instructor: v.optional(v.string()),
        level: v.optional(v.string()),            // Beginner | Intermediate | Advanced
        category: v.optional(v.string()),         // AI/ML | Web Dev | etc.
        sessions: v.optional(v.string()),         // newline-separated list of session titles
        duration: v.optional(v.string()),         // e.g. "8 weeks" | "10 hours"
        prerequisites: v.optional(v.string()),
        link: v.optional(v.string()),             // external url or internal path
        status: v.optional(v.string()),           // "published" | "draft"
        order: v.number(),
        isDeleted: v.optional(v.boolean()),
    }),

});
