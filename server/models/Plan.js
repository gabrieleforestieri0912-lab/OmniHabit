const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  planData: { type: mongoose.Schema.Types.Mixed, required: true }, // { summary, plan: [{month, habits}] }
  isActive: { type: Boolean, default: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date }, // optional: when the 12-month plan ends
  habitsApplied: { type: Boolean, default: false }, // whether habits have been created from this plan
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

PlanSchema.index({ user: 1, createdAt: -1 });
PlanSchema.index({ user: 1, isActive: 1 });

module.exports = mongoose.model('Plan', PlanSchema);
