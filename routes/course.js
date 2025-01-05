const { Router } = require("express");
const courseRouter = Router();
const {courseModel}=require("../db")
const {purchaseModel}=require("../db");
const { userMiddleWare } = require("../middleware/user");

courseRouter.post("/purchase",userMiddleWare,async function (req, res) {
  const userId=req.userId
  const courseId=req.body.courseId

  if(!courseId){
    return res.status(400).json({
      message:"Invalid data"
    })
  }

  try{
    const existsingCourse=await purchaseModel.findOne({
      userId:userId,
      courseId:courseId
    })

    if(existsingCourse){
      return res.status(400).json({
        message:"You have already purchased this course!"
      })
    }

    await purchaseModel.create({
      userId:userId,
      courseId:courseId
    })

    res.status(201).json({
      message:"You have successfully bougfht the course!"
    })
  }catch(error){
    return res.status(500).json({
      message:"Error irupted from the server side",
      error:error.message
    })
  }
});

courseRouter.get("/preview",async function (req, res) {
  try{
    const allCourses=await courseModel.find({})
    res.status(200).json({
      allCourses:allCourses
    })
  }catch(e){
    return res.status(500).json({
      message:"Error irupted from the server side",
      e:e.message
    })
  }
});

module.exports = {
  courseRouter: courseRouter
};
