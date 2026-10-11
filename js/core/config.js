/**
 * Configuration Module
 * Store Supabase credentials and app settings
 */

const Config = {
  // Supabase Configuration
  // Replace these with your actual Supabase project credentials
  supabase: {
    url: 'https://jpbzxxwnxryxoqqvthhr.supabase.co',
    anonKey: 'sb_publishable_ex3efZ1Kxuw4bDrMrNA-EQ_TcB7IWMO',
  },

  // App Configuration
  app: {
    name: 'FinBot AI',
    version: '2.0.0',
    supportEmail: 'support@finbot.ai',
  },

  // Feature Flags
  features: {
    enableCloudSync: true,
    enableOfflineMode: true,
    enableChatbot: true,
    enableExport: true,
  },

  // API Configuration (for future AI integration)
  api: {
    chatbot: {
      provider: 'openai', // 'openai', 'anthropic', 'gemini'
      model: 'gpt-4',
      maxTokens: 1000,
    },
  },
};

// Load config from environment variables if available
if (typeof process !== 'undefined' && process.env) {
  Config.supabase.url = process.env.SUPABASE_URL || Config.supabase.url;
  Config.supabase.anonKey = process.env.SUPABASE_ANON_KEY || Config.supabase.anonKey;
}
