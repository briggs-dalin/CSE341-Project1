require('dotenv').config();
const mongoose = require('mongoose');
const Contact = require('./models/Contact');
const contacts = require('./data/contacts');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected');

    // Clear existing data
    await Contact.deleteMany();
    console.log('Existing contacts removed');

    // Insert new data
    await Contact.insertMany(contacts);
    console.log('Contacts imported successfully');

    process.exit(); // Exit script
  })
  .catch(err => {
    console.error('Error importing data:', err);
    process.exit(1);
  });
