require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./src/config/db');
const Category = require('./src/models/category.model');

const PREDEFINED_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Healthcare',
  'Utilities',
  'Rent / Housing',
  'Education',
  'Travel',
  'Personal Care',
  'Investments',
  'Salary',
  'Freelance',
  'Business Income',
  'Gifts & Donations',
  'Other',
];

const seed = async () => {
  await connectDB();

  console.log('Seeding predefined categories...');

  for (const name of PREDEFINED_CATEGORIES) {
    const exists = await Category.findOne({ name, userId: null });
    if (!exists) {
      await Category.create({ name, userId: null });
      console.log(`  Created: ${name}`);
    } else {
      console.log(`  Skipped (exists): ${name}`);
    }
  }

  console.log('\nSeeding complete.');
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
