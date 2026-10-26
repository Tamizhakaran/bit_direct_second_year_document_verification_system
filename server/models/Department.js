const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  availableSeats: {
    type: Number,
    required: true,
    default: 30
  },
  totalCapacity: {
    type: Number,
    required: true,
    default: 60
  },
  filledSeats: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Department', departmentSchema);
