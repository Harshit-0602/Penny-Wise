import { Router } from "express";
import { RegenerateAccessToken, login, logout, register, uploadImage } from "../controllers/user.controller.js";
import { verifyUser } from "../middlewares/userVerify.middleware.js";
import { Budget } from "../models/budget.model.js";
import { User } from "../models/user.model.js";

const router = Router();

// router.get("/", (req, res) => {
    
// })



router.get("/dashboard", verifyUser, async (req, res) => {
  
  // res.status(200).render("dashboard.ejs", {
  //   user: req.user,
  // });
  const user = await User.findById(req.user._id).populate('budgets').exec();
  // console.log(user);
  const lastBudgetID = req.user.budgets[req.user.budgets.length - 1];
  let budgetExist = true;
  if (!lastBudgetID)
  {
    budgetExist = false;
  }
  // const budget = await Budget.findById(lastBudgetID);
  res.status(200).render("dashboard.ejs", {
    profileImage: req.user.profileImage,
    budgetExist,
    user,
  });
});
router.get("/budget", verifyUser, async (req, res) => {
  try {
    const lastBudgetID = req.user.budgets[req.user.budgets.length - 1];
    // console.log(lastBudgetID);
    if (!lastBudgetID)
    {
      res.render("budget.ejs", {
        totalAmount: 0,
        saving: 0,
        spending:0,
      });
      
    }
    else {
      const budget = await Budget.findById(lastBudgetID);
      res.render("budget.ejs", {
        totalAmount: budget.totalAmount,
        saving: budget.saving,
        spending:budget.spending
      });
    }
  } catch (error) {
    console.log(error);
  }
  // console.log(req.user);
  
});
router.get("/login",(req, res) => {
  res.render("login.ejs");
});
router.get("/register",(req, res) => {
  res.render("register.ejs");
});


router.post("/register", register);
router.post("/login",login);
router.get("/logout",verifyUser,logout);
router.post("/refreshtoken", RegenerateAccessToken);
router.post("/profileImage", verifyUser, uploadImage);

export default router;