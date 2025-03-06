const express = require('express');
const Contact = require('../models/Contact');

const router = express.Router();

// @desc    Get all contacts
// @route   GET /api/contacts
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @desc    Get a single contact by ID
// @route   GET /api/contacts/:id
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(200).json(contact);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
