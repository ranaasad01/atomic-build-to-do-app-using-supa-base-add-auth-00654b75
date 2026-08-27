// Local Supabase client wrapper
// This file wraps @supabase/supabase-js and re-exports the types needed
// by the dashboard. If the package is not yet installed, run:
//   npm install @supabase/supabase-js

export interface SupabaseClient {
  from: (table: string) => any;
  channel: (name: string) => any;
  removeChannel: (channel: any) => any;
  auth: {
    getSession: () => Promise<{ data: { session: Session | null }; error: any }>;
    onAuthStateChange: (callback: (event: string, session: Session | null) => void) => { data: { subscription: { unsubscribe: () => void } } };
    signInWithPassword: (credentials: { email: string; password: string }) => Promise<{ data: any; error: any }>;
    signOut: () => Promise<{ error: any }>;
  };
}

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: {
    id: string;
    email?: string;
    [key: string]: any;
  };
}

export function createClient(url: string, key: string): SupabaseClient {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { createClient: _createClient } = require('@supabase/supabase-js');
    return _createClient(url, key);
  } catch {
    throw new Error(
      'Package @supabase/supabase-js is not installed. Run: npm install @supabase/supabase-js'
    );
  }
}

export interface RealtimePostgresChangesPayload {
  eventType: "INSERT" | "UPDATE" | "DELETE";
  new: Record<string, unknown>;
  old: Record<string, unknown>;
  schema: string;
  table: string;
  commit_timestamp: string;
  errors: string[] | null;
}
