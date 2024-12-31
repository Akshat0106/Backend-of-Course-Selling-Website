const {Router}=require('express')
const {adminModel}=require('../db')
const adminRouter=Router()

adminRouter.post("/signup", function (req, res) {
    res.json({
      message: "You just signed up",
    });
  });
  
adminRouter.post("/signin", function (req, res) {
    res.json({
      message: "You just signed up",
    });
});

adminRouter.post("/course", function (req, res) {
    res.json({
      message: "You just signed up",
    });
});

adminRouter.put("/course", function (req, res) {
    res.json({
      message: "You just signed up",
    });
});

adminRouter.get("/course/bulk", function (req, res) {
    res.json({
      message: "You just signed up",
    });
});

module.exports={
    adminRouter:adminRouter
}

