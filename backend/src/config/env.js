// Load environment variables as early as possible
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file from project root
const result = dotenv.config({ path: join(__dirname, '../../.env') });

if (result.error) {
  console.error('❌ Error loading .env file:', result.error);
} else {
  console.log('✅ Environment variables loaded successfully');
  // Don't log actual values for security, just confirm they exist
  const stripeKeys = Object.keys(process.env).filter(key => key.includes('STRIPE'));
  if (stripeKeys.length > 0) {
    console.log('✅ Stripe environment variables found:', stripeKeys.length);
  } else {
    console.warn('⚠️  No Stripe environment variables found');
  }
}

export default result;