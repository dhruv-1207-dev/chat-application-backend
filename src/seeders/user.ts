import mongoose, { Document } from 'mongoose';
import User from '../models/user';
import * as dotenv from 'dotenv';
import bcryptjs = require('bcryptjs');
import { Constants } from '../config/constants';

dotenv.config();

const seedDB = async () => {
  try {
    // Clear existing data (optional, depending on whether you want to wipe data on each seed)
    await User.deleteMany({});
    const password = await bcryptjs.hashSync(
      'admin@123',
      Constants.HASH_STRING_LIMIT
    );
    // Create seed data
    const users = [
      {
        name: 'Admin',
        email: 'admin@gmail.com',
        password,
        role: 'ADMIN',
      },
    ];

    // Insert seed data into collections
    await User.insertMany(users);

    console.log('Data seeded successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Connect to MongoDB and run the seed function
const mongoURI = process.env.MONGO_URI as string;
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log('MongoDB connected');
    seedDB();
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
