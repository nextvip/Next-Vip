import mongoose from "mongoose";
import { PAYMENT_STATUSES } from "./constants.js";

const paymentTransactionSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subscription_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserSubscription",
      default: null,
    },
    stripe_payment_intent_id: {
      type: String,
    },
    stripe_invoice_id: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "usd",
      lowercase: true,
    },
    status: {
      type: String,
      enum: PAYMENT_STATUSES,
      default: "pending",
    },
    paid_at: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

paymentTransactionSchema.index({ user_id: 1, createdAt: -1 });
paymentTransactionSchema.index({ stripe_invoice_id: 1 }, { sparse: true });

const PaymentTransaction = mongoose.model(
  "PaymentTransaction",
  paymentTransactionSchema
);

export default PaymentTransaction;
