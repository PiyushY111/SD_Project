import mongoose from 'mongoose';

const savingsMetaSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  month: {
    type: String, // Format: "2025-07"
    required: true
  },
  targetSavings: {
    type: Number,
    required: true
  },
  actualSavings: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const SavingsMeta = mongoose.model('SavingsMeta', savingsMetaSchema);
export default SavingsMeta;
