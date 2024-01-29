import { Budget } from "../models/budget.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiRes } from "../utils/apiRes.js";
import { apiErr } from "../utils/apiErr.js";
import { formatName } from "../utils/formatterFunc.js";
import { User } from "../models/user.model.js";

const newBudget = asyncHandler(async (req, res) => {

  // console.log(req.body);

  const { totalAmount, budgetName } = req.body;

  if (!totalAmount && !budgetName) {
    throw new apiErr(400, "All fields are Required....");
  }
  const UpdatedName = formatName(budgetName);

  const budget = await Budget.create({
    totalAmount,
    budgetName: UpdatedName,
    userId: req.user._id,
    saving: totalAmount,
    spending:0,
  });

  // console.log(budget);

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $push: {
        budgets: budget._id,
      },
    },
    {
      new: true,
    }
  );

  // req.user.budgets.push(budget._id);

  // console.log(user);
    // res.render("budget.ejs")
  res.redirect("/user/budget");
});

const newExpense = asyncHandler(async (req, res) => {
  const { expenseName, expenseCost } = req.body;
  if (!expenseName && !expenseCost) {
    throw new apiErr(400, "All fields are required.....");
  }
    const UpdatedName = formatName(expenseName);
    if ((req.user.budgets.length - 1) < 0) {
        throw new apiErr(400,"First You need to create a budget");   
    }
    const lastBudgetID = req.user.budgets[req.user.budgets.length - 1];
  const budget = await Budget.findByIdAndUpdate(
    lastBudgetID,
    {
      $push: {
        expenses: {
          expenseName: UpdatedName,
          expenseCost,
        },
      },
      $inc: {
        spending: expenseCost,
        saving:-expenseCost,
      },
    },
    {
      new: true,
    }
  );
    // console.log(req.user);
  res.status(200).redirect("/user/budget");
});

export { newBudget , newExpense};
