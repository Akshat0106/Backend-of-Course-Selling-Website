const { Router } = require("express");

const userRouter = Router();

userRouter.post("/users/signup", function (req, res) {
  res.json({
    message: "You just signed up",
  });
});

userRouter.post("/users/signin", function (req, res) {
  res.json({
    message: "You just signed up",
  });
});

userRouter.get("/users/purchases", function (req, res) {
  res.json({
    message: "You just signed up",
  });
});

module.exports = {
  userRouter: userRouter,
};
