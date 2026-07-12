export function validateEnv(config: Record<string, unknown>) {
  const required = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY'];
  const missing = required.filter((key) => !String(config[key] || '').trim());
  if (missing.length) throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  try { new URL(String(config.SUPABASE_URL)); } catch { throw new Error('SUPABASE_URL must be a valid URL'); }
  if (config.NODE_ENV === 'production' && !config.FRONTEND_URL) throw new Error('FRONTEND_URL is required in production');
  if (config.PAYMENTS_ENABLED === 'true' && (!config.RAZORPAY_KEY_ID || !config.RAZORPAY_KEY_SECRET)) throw new Error('Razorpay credentials are required when PAYMENTS_ENABLED=true');
  return config;
}

