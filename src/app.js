import Express from "express";
import cookieParser from "cookie-parser";

const app = Express();
app.use(Express.json());
app.use(cookieParser());
app.use(Express.static("public"));
app.use(Express.urlencoded({ extended: true }));


import userRouter from "./routes/user.routes.js";

app.use("/user", userRouter);

import budgetRouter from "./routes/budget.routes.js";

app.use("/budget", budgetRouter);
app.get("/" ,(req, res) => {
  res.render("index.ejs");
});


export { app };