import mongoose from "mongoose";

// Defines the structure and validation for a subscription document
const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subscription name is required'],
        trim: true,
        minlength: [3, 'Subscription name must be at least 3 characters long'],
        maxlength: [50, 'Subscription name must be at most 50 characters long']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price must be a positive number']
    },
    currency: {
        type: String,
        enum: ['USD', 'EUR', 'GBP', 'INR', 'JPY'],
        default: 'INR',
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
        default: 'monthly',
    },
    category: {
        type: String,
        enum: ["Music", "Video", "Education"], // Example allowed values
        required: true
    },
    paymentMethod: {
        type: String,
        trim: true,
        required: [true, 'Payment method is required'],
    },
    status: {
        type: String,
        enum: ['active', 'expired', 'cancelled'],
        default: 'active',
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required'],
        validate: {
            validator: (value) => value <= new Date(),
            message: 'Start date cannot be in the future',
        },
        default: Date.now,
    },
    renewalDate: {
        type: Date,
        validate: {
            validator: function (value) { return value > this.startDate; },
        },
        message: 'Renewal date must be after the start date',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
        index: true,
    }
}, { timestamps: true });

// Before saving, set renewalDate if not provided and update status if expired
subscriptionSchema.pre('save', function (next) {
    if (!this.renewalDate) {
        // Set renewalDate based on frequency if not already set
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365
        };
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }
    // Mark as expired if renewalDate is in the past
    if (this.renewalDate < new Date()) {
        this.status = 'expired';
    }
    next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;