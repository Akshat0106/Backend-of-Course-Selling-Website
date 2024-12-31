const { Router } = require("express");

const userRouter = Router();

userRouter.post("/signup", function (req, res) {
  res.json({
    message: "You just signed up",
  });
});

userRouter.post("/signin", function (req, res) {
  res.json({
    message: "You just signed up",
  });
});

userRouter.get("/purchases", function (req, res) {
  res.json({
    message: "You just signed up",
  });
});

module.exports = {
  userRouter: userRouter,
};
