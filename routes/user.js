const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const zod = require("zod");
const { userModel } = require("../db");
const userRouter = Router();
require('dotenv').config()

userRouter.post("/signup", async function (req, res) {
  const requiredBody = zod.object({
    email: zod.string().email().min(3).max(100),
    password: zod.string().min(5).max(30),
    // .regex(
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    // ),
    firstName: zod.string().min(3).max(100),
    lastName: zod.string().min(3).max(100),
  });

  const parseData = requiredBody.safeParse(req.body);

  console.log(req.body);

  if (!parseData.success) {
    return res.json({
      message: "Incorrect credentials",
      error: parseData.error,
    });
  }

  const { email, password, firstName, lastName } = req.body;

  const hashPassword = await bcrypt.hash(password, 5);

  try {
    await userModel.create({
      email,
      password: hashPassword,
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

// --------------

userRouter.post("/signin", async function (req, res) {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }

    const passwordMatched = await bcrypt.compare(password, user.password);

    if (passwordMatched) {
      const token = jwt.sign(
        {
          id: user._id.toString(),
        },
        process.env.JWT_USER_SECRET
      );

      res.json({
        message: "You are signed-in!",
        token
      });
    } else {
      return res.json({
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    console.error("error during signin", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

userRouter.get("/purchases", function (req, res) {
  res.json({
    message: "You just signed up",
  });
});

module.exports = {
  userRouter: userRouter,
};
