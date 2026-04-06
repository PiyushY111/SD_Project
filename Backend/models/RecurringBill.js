import mongoose from 'mongoose';

const recurringBillSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  dueDate: {
    type: Number, // 1–31 (day of month)
    required: true
  },
  notes: {
    type: String
  }
}, { timestamps: true });

const RecurringBill = mongoose.model('RecurringBill', recurringBillSchema);
export default RecurringBill;
