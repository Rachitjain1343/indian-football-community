"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUPABASE_ADMIN_CLIENT = exports.SUPABASE_PUBLIC_CLIENT = void 0;
exports.createSupabasePublicClient = createSupabasePublicClient;
exports.createSupabaseAdminClient = createSupabaseAdminClient;
const supabase_js_1 = require("@supabase/supabase-js");
exports.SUPABASE_PUBLIC_CLIENT = 'SUPABASE_PUBLIC_CLIENT';
exports.SUPABASE_ADMIN_CLIENT = 'SUPABASE_ADMIN_CLIENT';
function getRequiredEnv(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}
function createSupabasePublicClient() {
    return (0, supabase_js_1.createClient)(getRequiredEnv('SUPABASE_URL'), getRequiredEnv('SUPABASE_ANON_KEY'));
}
function createSupabaseAdminClient() {
    return (0, supabase_js_1.createClient)(getRequiredEnv('SUPABASE_URL'), getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY'), {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}
//# sourceMappingURL=supabase.client.js.map