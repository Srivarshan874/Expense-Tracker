import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
  year: { type: Number, required: true, min: 2000, max: 2200 },
  month: { type: Number, required: true, min: 1, max: 12 },
  amount: { type: Number, required: true, min: [0.01, "Budget must be greater than zero"] }
}, { timestamps: true });

budgetSchema.index({ year: 1, month: 1 }, { unique: true });
export default mongoose.model("Budget", budgetSchema);
