const { Router } = require("express");
const courseRouter = Router();

courseRouter.post("/purchase", function (req, res) {
  res.json({
    message: "You just signed up",
  });
});

courseRouter.get("/preview", function (req, res) {
  res.json({
    message: "You just signed up--course preview endpoint",
  });
});

module.exports = {
  courseRouter: courseRouter
};
