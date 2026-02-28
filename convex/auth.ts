import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const login = mutation({
    args: { email: v.string(), password: v.string() },
    handler: async (ctx, args) => {
        // Hardcoded credentials
        if (args.email === 'balusagnanesh@gmail.com' && args.password === 'ExCalidraw@simplify-1274&%') {
            return "admin_session_valid_token_777";
        }
        return null;
    }
});
