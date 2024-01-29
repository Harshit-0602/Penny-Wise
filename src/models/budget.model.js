import mongoose, { Schema } from "mongoose";

const expenseSchema = new Schema({
    expenseName: {
        type: String,
        trim: true,
        required: true,
    },
    expenseCost: {
        type: Number,
        required: true,
    },
    // date: {
    //     type: Date,
    //     default: new Date(),  
    // }
},
    {
    timestamps:true,
});

const budgetSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    totalAmount: {
        type: Number,
    },
    budgetName: {
        type: String,
        trim: true,
    },
    spending: {
        type: Number
    },
    saving: {
        type: Number
    },
    expenses: {
        type: [expenseSchema],
    }
},
    {
        timestamps: true,
    });

const Budget = mongoose.model("Budget", budgetSchema);

export { Budget };