/**
 * Configuration Template
 * Copy this file to config.js and fill in your Supabase credentials
 */

const Config = {
  // Supabase Configuration
  // Get these from: https://supabase.com/dashboard > Project Settings > API
  supabase: {
    url: 'YOUR_SUPABASE_URL', // Example: 'https://xxxxx.supabase.co'
    anonKey: 'YOUR_SUPABASE_ANON_KEY', // Your Supabase anon/public key (starts with 'eyJ...')
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
