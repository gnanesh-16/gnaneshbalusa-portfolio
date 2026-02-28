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
        const items = await ctx.db.query("experiences").collect();
        return items.sort((a, b) => a.order - b.order);
    }
});

export const addExperience = mutation({
    args: { token: v.string(), company: v.string(), logo: v.string(), period: v.string(), role: v.string(), description: v.string(), order: v.number() },
    handler: async (ctx, args) => {
        verifyToken(args.token);
        const { token, ...data } = args;
        return await ctx.db.insert("experiences", data);
    }
});

export const deleteExperience = mutation({
    args: { token: v.string(), id: v.id("experiences") },
    handler: async (ctx, args) => {
        verifyToken(args.token);
        await ctx.db.delete(args.id);
    }
});

// --- Writings ---
export const getWritings = query({
    handler: async (ctx) => {
        const items = await ctx.db.query("writings").collect();
        return items.sort((a, b) => a.order - b.order);
    }
});

export const addWriting = mutation({
    args: { token: v.string(), year: v.string(), title: v.string(), order: v.number() },
    handler: async (ctx, args) => {
        verifyToken(args.token);
        const { token, ...data } = args;
        return await ctx.db.insert("writings", data);
    }
});

export const deleteWriting = mutation({
    args: { token: v.string(), id: v.id("writings") },
    handler: async (ctx, args) => {
        verifyToken(args.token);
        await ctx.db.delete(args.id);
    }
});

// --- Projects ---
export const getProjects = query({
    handler: async (ctx) => {
        const items = await ctx.db.query("projects").collect();
        return items.sort((a, b) => a.order - b.order);
    }
});

export const addProject = mutation({
    args: { token: v.string(), icon: v.string(), name: v.string(), year: v.string(), description: v.string(), order: v.number() },
    handler: async (ctx, args) => {
        verifyToken(args.token);
        const { token, ...data } = args;
        return await ctx.db.insert("projects", data);
    }
});

export const deleteProject = mutation({
    args: { token: v.string(), id: v.id("projects") },
    handler: async (ctx, args) => {
        verifyToken(args.token);
        await ctx.db.delete(args.id);
    }
});

// --- Patents ---
export const getPatents = query({
    handler: async (ctx) => {
        const items = await ctx.db.query("patents").collect();
        return items.sort((a, b) => a.order - b.order);
    }
});

export const addPatent = mutation({
    args: { token: v.string(), year: v.string(), title: v.string(), description: v.string(), order: v.number() },
    handler: async (ctx, args) => {
        verifyToken(args.token);
        const { token, ...data } = args;
        return await ctx.db.insert("patents", data);
    }
});

export const deletePatent = mutation({
    args: { token: v.string(), id: v.id("patents") },
    handler: async (ctx, args) => {
        verifyToken(args.token);
        await ctx.db.delete(args.id);
    }
});

// --- Publications ---
export const getPublications = query({
    handler: async (ctx) => {
        const items = await ctx.db.query("publications").collect();
        return items.sort((a, b) => a.order - b.order);
    }
});

export const addPublication = mutation({
    args: { token: v.string(), year: v.string(), title: v.string(), description: v.string(), order: v.number() },
    handler: async (ctx, args) => {
        verifyToken(args.token);
        const { token, ...data } = args;
        return await ctx.db.insert("publications", data);
    }
});

export const deletePublication = mutation({
    args: { token: v.string(), id: v.id("publications") },
    handler: async (ctx, args) => {
        verifyToken(args.token);
        await ctx.db.delete(args.id);
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

        for (const e of experiences) await ctx.db.insert("experiences", e);
        for (const w of writings) await ctx.db.insert("writings", w);
        for (const p of projects) await ctx.db.insert("projects", p);
        for (const p of patents) await ctx.db.insert("patents", p);
        for (const p of publications) await ctx.db.insert("publications", p);

        return "Seeded successfully";
    }
});
