"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    databaseUrl: process.env.DATABASE_URL || '',
    supabaseUrl: process.env.SUPABASE_URL || '',
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
});
//# sourceMappingURL=database.config.js.map