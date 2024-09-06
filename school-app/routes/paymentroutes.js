// paymentroutes.js
const express = require('express');
const router = express.Router();
const Payment = require('../models/payment');

// Create a new payment
router.post('/payments', async (req, res) => {
  const { student, amount, paymentMethod } = req.body;
  try {
    const newPayment = new Payment({ student, amount, paymentMethod });
    await newPayment.save();
    res.status(201).json(newPayment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all payments
router.get('/payments', async (req, res) => {
  try {
    const payments = await Payment.find().populate('student');
    res.status(200).json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific payment by ID
router.get('/payments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const payment = await Payment.findById(id).populate('student');
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.status(200).json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a payment
router.put('/payments/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const updatedPayment = await Payment.findByIdAndUpdate(id, updates, { new: true });
    res.status(200).json(updatedPayment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a payment
router.delete('/payments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Payment.findByIdAndDelete(id);
    res.status(200).json({ message: 'Payment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
