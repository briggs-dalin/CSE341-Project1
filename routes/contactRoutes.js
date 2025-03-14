const express = require('express');
const Contact = require('../models/Contact');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Contacts
 *   description: The contacts managing API
 */

/**
 * @swagger
 * /api/contacts:
 *   get:
 *     summary: Get all contacts
 *     tags: [Contacts]
 *     responses:
 *       200:
 *         description: A list of contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   phone:
 *                     type: string
 */




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

/**
 * @swagger
 * /api/contacts/{id}:
 *   get:
 *     summary: Get a single contact by ID
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The contact ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single contact object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 email:
 *                   type: string
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Server error
 */

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

/**
 * @swagger
 * /api/contacts:
 *   post:
 *     summary: Add a new contact
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Contact added successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */
// @desc    Create a new contact
// @route   POST /api/contacts
router.post('/', async (req, res) => {
  try {
    // Destructure the request body
    const { name, email, phone } = req.body;

    // Ensure that all required fields are provided
    if (!name || !email || !phone) {
      return res.status(400).json({ message: 'All fields (name, email, phone) are required' });
    }

    // Create a new contact
    const newContact = new Contact({
      name,
      email,
      phone,
    });

    // Save the new contact to the database
    await newContact.save();

    // Return the new contact's ID in the response
    res.status(201).json({
      message: 'Contact added successfully',
      contactId: newContact._id,  // Returning the newly created contact's ID
    });
  } catch (err) {
    // Handle any server errors
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @swagger
 * /api/contacts/{id}:
 *   put:
 *     summary: Update an existing contact by ID
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The contact ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contact updated successfully
 *       400:
 *         description: Invalid data for update
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Server error
 */

// @desc    Update a contact
// @route   PUT /api/contacts/:id
router.put('/:id', async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    // Ensure at least one field is provided
    if (!name && !email && !phone) {
      return res.status(400).json({ message: "At least one field (name, email, or phone) is required to update" });
    }

    // Find the contact by ID and update it
    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      { name, email, phone },
      { new: true, runValidators: true }  // `new: true` returns the updated contact, `runValidators: true` ensures validation
    );

    // If no contact is found
    if (!updatedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    // If update is successful
    res.status(200).json({
      message: "Contact updated successfully",
      contact: updatedContact
    });

  } catch (error) {
    res.status(500).json({ message: "Error updating contact", error: error.message });
  }
});

/**
 * @swagger
 * /api/contacts/{id}:
 *   delete:
 *     summary: Delete a contact by ID
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The contact ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contact deleted successfully
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Server error
 */

// @desc    Delete a contact
// @route   DELETE /api/contacts/:id
router.delete('/:id', async (req, res) => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(req.params.id);

    if (!deletedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
