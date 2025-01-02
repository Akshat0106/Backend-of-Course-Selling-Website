const { Router } = require("express");
const { adminModel } = require("../db");
const adminRouter = Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const zod = require("zod");
const JWT_ADMIN_sECRET = "helloadminsecret";

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
      const token = jwt.sign({ id: admin._id.toString() }, JWT_ADMIN_sECRET);
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

module.exports = {
  adminRouter: adminRouter,
};
