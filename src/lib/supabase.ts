import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jlarsdrflseeqykvbjze.supabase.co';
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsYXJzZHJmbHNlZXF5a3ZianplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwOTQyNjAsImV4cCI6MjEwMzY3MDI2MH0.pnSMZ0w1G81qpMGwaAENhoMhcw0iX9EKYDBxH4cjKZs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
