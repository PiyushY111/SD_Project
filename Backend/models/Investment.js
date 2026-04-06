import mongoose from 'mongoose';

const investmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['FD', 'Mutual Fund', 'SIP', 'Other'],
    default: 'Other'
  },
  amount: {
    type: Number,
    required: true
  },
  expectedReturnRate: {
    type: Number, // in %
    default: 0
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Investment = mongoose.model('Investment', investmentSchema);
export default Investment;
