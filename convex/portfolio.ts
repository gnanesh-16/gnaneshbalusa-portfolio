import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const verifyToken = (token: string) => {
    if (token !== "admin_session_valid_token_777") {
        throw new Error("Unauthorized access");
    }
};

// --- Experiences ---
export const getExperiences = query({
    handler: async (ctx) => {
        const items = await ctx.db.query("experiences")
            .filter((q) => q.neq(q.field("isDeleted"), true))
            .collect();
        return items.sort((a, b) => a.order - b.order);
    }
});

export const getDeletedExperiences = query({
    handler: async (ctx) => {
        const items = await ctx.db.query("experiences")
            .filter((q) => q.eq(q.field("isDeleted"), true))
            .collect();
        return items;
    }
});

export const saveExperience = mutation({
    args: {
        token: v.string(),
        id: v.optional(v.id("experiences")),
        company: v.string(),
        logo: v.string(),
        period: v.string(),
        role: v.string(),
        description: v.string(),
        order: v.number()
    },
    handler: async (ctx, args) => {
        verifyToken(args.token);
        const { token, id, ...data } = args;
        if (id) {
            await ctx.db.patch(id, data);
            return id;
        }
        return await ctx.db.insert("experiences", data);
    }
});

export const softDeleteExperience = mutation({
    args: { token: v.string(), id: v.id("experiences") },
    handler: async (ctx, args) => {
        verifyToken(args.token);
        await ctx.db.patch(args.id, { isDeleted: true });
    }
});

export const hardDeleteExperience = mutation({
    args: { token: v.string(), id: v.id("experiences") },
    handler: async (ctx, args) => {
        verifyToken(args.token);
        await ctx.db.delete(args.id);
    }
});

export const restoreExperience = mutation({
    args: { token: v.string(), id: v.id("experiences") },
    handler: async (ctx, args) => {
        verifyToken(args.token);
        await ctx.db.patch(args.id, { isDeleted: false });
    }
});

// --- Writings ---
export const getWritings = query({
    handler: async (ctx) => {
        const items = await ctx.db.query("writings")
            .filter((q) => q.neq(q.field("isDeleted"), true))
            .collect();
        return items.sort((a, b) => a.order - b.order);
    }
});

export const getDeletedWritings = query({
    handler: async (ctx) => {
        const items = await ctx.db.query("writings")
            .filter((q) => q.eq(q.field("isDeleted"), true))
            .collect();
        return items;
    }
});

export const saveWriting = mutation({
    args: {
        token: v.string(),
        id: v.optional(v.id("writings")),
        year: v.string(),
        title: v.string(),
        order: v.number()
    },
    handler: async (ctx, args) => {
        verifyToken(args.token);
        const { token, id, ...data } = args;
        if (id) {
            await ctx.db.patch(id, data);
            return id;
        }
        return await ctx.db.insert("writings", data);
    }
});

export const softDeleteWriting = mutation({
    args: { token: v.string(), id: v.id("writings") },
    handler: async (ctx, args) => {
        verifyToken(args.token);
        await ctx.db.patch(args.id, { isDeleted: true });
    }
});

export const hardDeleteWriting = mutation({
    args: { token: v.string(), id: v.id("writings") },
    handler: async (ctx, args) => {
        verifyToken(args.token);
        await ctx.db.delete(args.id);
    }
});

export const restoreWriting = mutation({
    args: { token: v.string(), id: v.id("writings") },
    handler: async (ctx, args) => {
        verifyToken(args.token);
        await ctx.db.patch(args.id, { isDeleted: false });
    }
});

// --- Projects ---
export const getProjects = query({
    handler: async (ctx) => {
        const items = await ctx.db.query("projects")
            .filter((q) => q.neq(q.field("isDeleted"), true))
            .collect();
        return items.sort((a, b) => a.order - b.order);
    }
});

export const getDeletedProjects = query({
    handler: async (ctx) => {
        const items = await ctx.db.query("projects")
            .filter((q) => q.eq(q.field("isDeleted"), true))
            .collect();
        return items;
    }
});

export const saveProject = mutation({
    args: {
        token: v.string(),
        id: v.optional(v.id("projects")),
        icon: v.string(),
        name: v.string(),
        year: v.string(),
        description: v.string(),
        order: v.number()
    },
    handler: async (ctx, args) => {
        verifyToken(args.token);
        const { token, id, ...data } = args;
        if (id) {
            await ctx.db.patch(id, data);
            return id;
        }
        return await ctx.db.insert("projects", data);
    }
});

export const softDeleteProject = mutation({
    args: { token: v.string(), id: v.id("projects") },
    handler: async (ctx, args) => {
        verifyToken(args.token);
        await ctx.db.patch(args.id, { isDeleted: true });
    }
});

export const hardDeleteProject = mutation({
    args: { token: v.string(), id: v.id("projects") },
    handler: async (ctx, args) => {
        verifyToken(args.token);
        await ctx.db.delete(args.id);
    }
});

export const restoreProject = mutation({
    args: { token: v.string(), id: v.id("projects") },
    handler: async (ctx, args) => {
        verifyToken(args.token);
        await ctx.db.patch(args.id, { isDeleted: false });
    }
});

// --- Patents ---
export const getPatents = query({
    handler: async (ctx) => {
        const items = await ctx.db.query("patents")
            .filter((q) => q.neq(q.field("isDeleted"), true))
            .collect();
        return items.sort((a, b) => a.order - b.order);
    }
});

export const getDeletedPatents = query({
    handler: async (ctx) => {
        const items = await ctx.db.query("patents")
            .filter((q) => q.eq(q.field("isDeleted"), true))
            .collect();
        return items;
    }
});

export const savePatent = mutation({
    args: {
        token: v.string(),
        id: v.optional(v.id("patents")),
        year: v.string(),
        title: v.string(),
        description: v.string(),
        order: v.number()
    },
    handler: async (ctx, args) => {
        verifyToken(args.token);
        const { token, id, ...data } = args;
        if (id) {
            await ctx.db.patch(id, data);
            return id;
        }
        return await ctx.db.insert("patents", data);
    }
});

export const softDeletePatent = mutation({
    args: { token: v.string(), id: v.id("patents") },
    handler: async (ctx, args) => {
        verifyToken(args.token);
        await ctx.db.patch(args.id, { isDeleted: true });
    }
});

export const hardDeletePatent = mutation({
    args: { token: v.string(), id: v.id("patents") },
    handler: async (ctx, args) => {
        verifyToken(args.token);
        await ctx.db.delete(args.id);
    }
});

export const restorePatent = mutation({
    args: { token: v.string(), id: v.id("patents") },
    handler: async (ctx, args) => {
        verifyToken(args.token);
        await ctx.db.patch(args.id, { isDeleted: false });
    }
});

// --- Videos ---
export const getVideos = query({
    handler: async (ctx) => {
        const items = await ctx.db.query("videos")
            .filter((q) => q.neq(q.field("isDeleted"), true))
            .collect();
        return items.sort((a, b) => a.order - b.order);
    }
});

export const getDeletedVideos = query({
    handler: async (ctx) => {
        const items = await ctx.db.query("videos")
            .filter((q) => q.eq(q.field("isDeleted"), true))
            .collect();
        return items;
    }
});

export const saveVideo = mutation({
    args: {
        token: v.string(),
        id: v.optional(v.id("videos")),
        title: v.string(),
        url: v.string(),
        description: v.string(),
        order: v.number()
    },
    handler: async (ctx, args) => {
        verifyToken(args.token);
        const { token, id, ...data } = args;
        if (id) {
            await ctx.db.patch(id, data);
            return id;
        }
        return await ctx.db.insert("videos", data);
    }
});

export const softDeleteVideo = mutation({
    args: { token: v.string(), id: v.id("videos") },
    handler: async (ctx, args) => {
        verifyToken(args.token);
        await ctx.db.patch(args.id, { isDeleted: true });
    }
});

export const hardDeleteVideo = mutation({
    args: { token: v.string(), id: v.id("videos") },
    handler: async (ctx, args) => {
        verifyToken(args.token);
        await ctx.db.delete(args.id);
    }
});

export const restoreVideo = mutation({
    args: { token: v.string(), id: v.id("videos") },
    handler: async (ctx, args) => {
        verifyToken(args.token);
        await ctx.db.patch(args.id, { isDeleted: false });
    }
});

// --- Publications ---
export const getPublications = query({
    handler: async (ctx) => {
        const items = await ctx.db.query("publications")
            .filter((q) => q.neq(q.field("isDeleted"), true))
            .collect();
        return items.sort((a, b) => a.order - b.order);
    }
});

export const getDeletedPublications = query({
    handler: async (ctx) => {
        const items = await ctx.db.query("publications")
            .filter((q) => q.eq(q.field("isDeleted"), true))
            .collect();
        return items;
    }
});

export const savePublication = mutation({
    args: {
        token: v.string(),
        id: v.optional(v.id("publications")),
        year: v.string(),
        title: v.string(),
        description: v.string(),
        order: v.number()
    },
    handler: async (ctx, args) => {
        verifyToken(args.token);
        const { token, id, ...data } = args;
        if (id) {
            await ctx.db.patch(id, data);
            return id;
        }
        return await ctx.db.insert("publications", data);
    }
});

export const softDeletePublication = mutation({
    args: { token: v.string(), id: v.id("publications") },
    handler: async (ctx, args) => {
        verifyToken(args.token);
        await ctx.db.patch(args.id, { isDeleted: true });
    }
});

export const hardDeletePublication = mutation({
    args: { token: v.string(), id: v.id("publications") },
    handler: async (ctx, args) => {
        verifyToken(args.token);
        await ctx.db.delete(args.id);
    }
});

export const restorePublication = mutation({
    args: { token: v.string(), id: v.id("publications") },
    handler: async (ctx, args) => {
        verifyToken(args.token);
        await ctx.db.patch(args.id, { isDeleted: false });
    }
});

export const seedData = mutation({
    handler: async (ctx) => {
        // Only run if empty
        const exps = await ctx.db.query("experiences").collect();
        if (exps.length > 0) return "Already seeded";

        const experiences = [
            {
                company: 'Amazon',
                logo: '/brand-assets/amazonlogo-.png',
                period: '2025 -',
                role: 'DS Machine Learning Associate 2',
                description: 'Building AI-powered solutions that translate complex data into measurable business outcomes. My work centers on developing systems that remain robust at scale while preserving the nuance required for real-world deployment.',
                order: 1
            },
            {
                company: 'McKinsey & Company',
                logo: '/brand-assets/mcksiney&coampnt-logo.png',
                period: '2024 - 2025',
                role: 'Business Analyst',
                description: 'Guided cross-functional teams through data analysis initiatives that reshaped how the organization captures and interprets information. Applied structured problem-solving frameworks to inform executive strategy.',
                order: 2
            },
            {
                company: 'TiHAN IIT Hyderabad',
                logo: '/brand-assets/iith-logo.png',
                period: '2024 - 2024',
                role: 'AI Research Software Engineer',
                description: 'Designed and implemented AI/ML systems with an emphasis on production readiness. Balanced research ambition with engineering pragmatism to deliver solutions that meet demanding performance requirements.',
                order: 3
            },
            {
                company: 'Microsoft',
                logo: '/brand-assets/microsoftlogo.png',
                period: '2024 - 2024',
                role: 'Microsoft Student Ambassador',
                description: 'Led community initiatives that brought emerging technologies to peers through hands-on workshops and collaborative projects. Fostered an environment where curiosity and technical rigor could coexist.',
                order: 4
            }
        ];

        const writings = [
            { year: '2025', title: 'Your LLM Might Already Be Backdoored and You Dont Even Know It', order: 1 },
            { year: '2025', title: 'The 15 Git Commands Every Developer Needs to Join $2B+ Companies', order: 2 },
            { year: '2024', title: 'Cracking the Code: How I Mastered REST API Interviews at Amazon', order: 3 },
            { year: '2024', title: 'My Journey Learning React, Electron, and Building MuteMemo', order: 4 },
            { year: '2024', title: 'SOAP vs REST: Understanding the Differences', order: 5 },
            { year: '2023', title: 'The Hidden Algorithm That 90% of Software Engineers Miss', order: 6 },
            { year: '2023', title: 'Why 99% of AI Projects Fail And the AWS Blueprint to Save Yours', order: 7 },
            { year: '2022', title: 'Dhvagna-NPI: Lightweight English Speech Transcription for Developers', order: 8 }
        ];

        const projects = [
            { icon: 'Pipeline', name: 'ML Pipeline Development', year: '2026', description: 'Scalable machine learning systems built for production environments—encompassing data preprocessing, model training, and deployment strategies for enterprise-grade reliability.', order: 1 },
            { icon: 'Cursor', name: 'BrogsCursor', year: '2025', description: 'An open-source Python package enabling precise recording and replay of mouse movements, clicks, and keyboard inputs with pixel-perfect accuracy. No paid browser APIs—just straightforward automation for everyone.', order: 2 },
            { icon: 'React', name: 'MuteMemo', year: '2024', description: 'An invisible overlay application for online meetings built with React and Electron. Enables seamless note-taking, action item tracking, and image capture—entirely hidden from screen sharing.', order: 3 },
            { icon: 'Eye', name: 'Computer Vision Applications', year: '2024', description: 'Production implementations including object detection, image classification, and real-time processing systems. Demonstrates practical applications of deep learning in visual recognition.', order: 4 },
            { icon: 'Voice', name: 'Speech Emotion Recognition', year: '2023', description: 'A deep learning system for temporal sequence analysis in detecting human emotions from speech patterns. Applications span human-computer interaction and mental health monitoring.', order: 5 },
            { icon: 'Brain', name: 'NLP Solutions', year: '2023', description: 'Natural language processing projects focusing on text analysis, sentiment detection, and language model applications. Showcases advanced techniques in processing and understanding human language.', order: 6 },
            { icon: 'Trophy', name: 'Hackathon Winning Solutions', year: '2023', description: 'A collection of innovative projects that secured victories across multiple hackathons. Demonstrates rapid prototyping capabilities and creative problem-solving across AI, web, and mobile domains.', order: 7 }
        ];

        const patents = [
            { year: '2024', title: 'MuteMemo: Invisible Overlay System for Real-Time Meeting Annotation', description: 'A novel system enabling real-time note-taking during video conferences with complete invisibility to screen sharing protocols.', order: 1 }
        ];

        const publications = [
            { year: '2025', title: 'Comparative Analysis of Different Operational Logic Gates for Cutting-Edge Technology', description: 'Published in IEEE. Authored with Vijay Rao Kumbhare, Tallam Sai Nithin, M Sahil Krishna, Ashwini Kumar Varma, Bittu Kumar.', order: 1 },
            { year: '2024', title: 'Evaluating Gesture Based Text Generator Gloves System on Arduino Platform', description: 'Published in IEEE Gujarat. Authored with Vijay Rao Kumbhare, Bittu Kumar, Amit Kumar Shrivastava, Ashwini Kumar Varma, Aditya Japa.', order: 2 }
        ];

        const videos = [
            { title: 'Build AI Agents with Groq', url: 'https://youtube.com/watch?v=dQw4w9WgXcQ', description: 'A complete tutorial on building blazing fast LLM agents.', order: 1 }
        ];

        for (const e of experiences) await ctx.db.insert("experiences", e);
        for (const w of writings) await ctx.db.insert("writings", w);
        for (const p of projects) await ctx.db.insert("projects", p);
        for (const p of patents) await ctx.db.insert("patents", p);
        for (const p of publications) await ctx.db.insert("publications", p);
        for (const v of videos) await ctx.db.insert("videos", v);

        return "Seeded successfully";
    }
});

// --- Data Portability ---
export const getAllData = query({
    handler: async (ctx) => {
        const experiences = await ctx.db.query("experiences").collect();
        const writings = await ctx.db.query("writings").collect();
        const projects = await ctx.db.query("projects").collect();
        const patents = await ctx.db.query("patents").collect();
        const publications = await ctx.db.query("publications").collect();
        const videos = await ctx.db.query("videos").collect();

        return {
            experiences,
            writings,
            projects,
            patents,
            publications,
            videos
        };
    }
});

export const importData = mutation({
    args: {
        token: v.string(),
        data: v.object({
            experiences: v.optional(v.array(v.any())),
            writings: v.optional(v.array(v.any())),
            projects: v.optional(v.array(v.any())),
            patents: v.optional(v.array(v.any())),
            publications: v.optional(v.array(v.any())),
            videos: v.optional(v.array(v.any())),
        })
    },
    handler: async (ctx, args) => {
        verifyToken(args.token);
        const { data } = args;

        if (data.experiences) {
            for (const item of data.experiences) {
                const { _id, _creationTime, ...fields } = item;
                await ctx.db.insert("experiences", fields as any);
            }
        }
        if (data.writings) {
            for (const item of data.writings) {
                const { _id, _creationTime, ...fields } = item;
                await ctx.db.insert("writings", fields as any);
            }
        }
        if (data.projects) {
            for (const item of data.projects) {
                const { _id, _creationTime, ...fields } = item;
                await ctx.db.insert("projects", fields as any);
            }
        }
        if (data.patents) {
            for (const item of data.patents) {
                const { _id, _creationTime, ...fields } = item;
                await ctx.db.insert("patents", fields as any);
            }
        }
        if (data.publications) {
            for (const item of data.publications) {
                const { _id, _creationTime, ...fields } = item;
                await ctx.db.insert("publications", fields as any);
            }
        }
        if (data.videos) {
            for (const item of data.videos) {
                const { _id, _creationTime, ...fields } = item;
                await ctx.db.insert("videos", fields as any);
            }
        }

        return "Import complete";
    }
});
// --- Settings ---
export const getSettings = query({
    handler: async (ctx) => {
        return await ctx.db.query("settings").collect();
    }
});

export const updateSetting = mutation({
    args: {
        token: v.string(),
        key: v.string(),
        value: v.any()
    },
    handler: async (ctx, args) => {
        verifyToken(args.token);
        const { token, key, value } = args;
        const existing = await ctx.db
            .query("settings")
            .filter((q) => q.eq(q.field("key"), key))
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, { value });
            return existing._id;
        } else {
            return await ctx.db.insert("settings", { key, value });
        }
    }
});

// --- Messages (Reply DM) ---
export const sendMessage = mutation({
    args: {
        platform: v.string(),
        message: v.string(),
        locationData: v.optional(v.string()),
        userAgent: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("messages", {
            platform: args.platform,
            message: args.message,
            locationData: args.locationData,
            userAgent: args.userAgent,
        });
    }
});

export const getMessages = query({
    args: { token: v.string() },
    handler: async (ctx, args) => {
        verifyToken(args.token);
        return await ctx.db.query("messages").order("desc").collect();
    }
});
