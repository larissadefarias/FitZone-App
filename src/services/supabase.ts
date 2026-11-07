
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zeefxvlavghdbsietmmx.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_NIfwoDw3YK5G3RAFF_dveA_osKf5Tk7';

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);
