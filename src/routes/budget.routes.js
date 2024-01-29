import { Router } from "express";
import { verifyUser } from "../middlewares/userVerify.middleware.js";
import { newBudget, newExpense } from "../controllers/budget.controller.js";

const router = Router();

router.post("/addExpense",verifyUser, newExpense);
router.post("/addBudget",verifyUser, newBudget);

export default router;