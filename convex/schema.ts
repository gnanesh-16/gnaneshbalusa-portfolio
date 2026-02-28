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
});
