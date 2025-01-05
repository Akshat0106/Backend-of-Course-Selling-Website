const { Router } = require("express");
const { adminModel, courseModel } = require("../db");
const adminRouter = Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const zod = require("zod");
const { adminMiddleWare } = require("../middleware/admin");
require('dotenv').config()

adminRouter.post("/signup", async function (req, res) {
  const requiredBody = zod.object({
    email: zod.string().min(3).max(100).email(),
    password: zod.string().min(3).max(100),
    firstName: zod.string().min(3).max(100),
    lastName: zod.string().min(3).max(100),
  });

  const parseData = requiredBody.safeParse(req.body);

  if (!parseData.success) {
    return res.json({
      message: "Invalid credentials",
      error: parseData.error,
    });
  }

  const { email, password, firstName, lastName } = req.body;

  const hashedpassword =await bcrypt.hash(password, 5);

  try {
    await adminModel.create({
      email,
      password: hashedpassword,
      firstName,
      lastName,
    });
  } catch (e) {
    return res.json({
      message: "User already exists",
    });
  }

  res.json({
    message: "You just signed up",
  });
});

// -----------------------

adminRouter.post("/signin", async function (req, res) {
  const { email, password } = req.body;

  try {
    const admin = await adminModel.findOne({email});

    if (!admin) {
      return res.status(403).json({
        message: "User not found",
      });
    }

    const passwordMatched =await bcrypt.compare(password, admin.password);

    if (passwordMatched) {
      const token = jwt.sign({ id: admin._id.toString() }, process.env.JWT_ADMIN_sECRET);
      return res.json({
        message: "You are signed in!",
        token
      });
    } else {
      return res.json({
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    console.error("error occured", error);
    res.status(500).json({
      message: "Internal error erupted",
    });
  }
});

adminRouter.post("/course",adminMiddleWare,async function (req, res) {
  const adminId=req.adminId

  const requiredBody=zod.object({
    title:zod.string().min(3),
    description:zod.string().min(10),
    imageUrl:zod.string().url(),
    price:zod.number().positive()
  })

  const parseBody=requiredBody.safeParse(req.body)

  if(!parseBody.success){
    return res.json({
      message:"Incorrect data format",
      error:parseBody.error
    })
  }

  const {title,description,imageUrl,price}=req.body

  const course=await courseModel.create({
    title,
    description,
    imageUrl,
    price,
    creatorId:adminId
  })

  res.status(200).json({
    message: "Course created",
    courseId:course._id
  });
});

adminRouter.put("/course", adminMiddleWare,async function (req, res) {
  const adminId=req.adminId

  const requireBody=zod.object({
    courseId:zod.string().min(5),
    title:zod.string().min(3).optional(),
    description:zod.string().min(5).optional(),
    imageUrl:zod.string().url().min(5).optional(),
    price:zod.number().positive().optional()
  })

  const parseData=requireBody.safeParse(req.body)

  if(!parseData.success){
    return res.json({
      message:"Invalid data",
      error:parseData.error
    })
  }

  const {courseId,title,description,imageUrl,price}=req.body

  const course=await courseModel.findOne({
    _id:courseId,
    creatorId:adminId
  })

  if(!course){
    return res.json({
      message:"Course not found"
    })
  }

  await courseModel.updateOne(
    {
      _id:courseId,
      creatorId:adminId
    },
    {
      title:title||course.title,
      description:description||course.description,
      imageUrl:imageUrl||course.imageUrl,
      price:price||course.price
    }
  )


  res.status(200).json({
    message: "Course updated",
  });
});

adminRouter.delete("/course",adminMiddleWare,async function(req,res){
  const adminId=req.adminId

  const requireBody=zod.object({
    courseId:zod.string().min(5)
  })

  const parseBody=requireBody.safeParse(req.body)

  if(!parseBody.success){
    return res.json({
      message:"Incorrect data format",
      error:parseBody.error
    })
  }

  const {courseId}=req.body

  const course=await courseModel.findOne({
    _id:courseId,
    creatorId:adminId
  })

  if(!course){
    return res.status(404).json({
      message:"Course not found"
    })
  }

  await courseModel.deleteOne({
    _id:courseId,
    creatorId:adminId
  })

  res.status(200).json({
    message:"Course deleted!"
  })
})

adminRouter.get("/course/bulk",adminMiddleWare,async function (req, res) {
  const adminId=req.adminId

  const courses=await courseModel.find({
    creatorId:adminId
  })

  res.status(200).json({
    courses
  });
});

module.exports = {
  adminRouter: adminRouter,
};
