export default () => ({
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseRestUrl: process.env.SUPABASE_REST_URL || '',
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  supabasePublishableKey: process.env.SUPABASE_PUBLISHABLE_KEY || '',
});
