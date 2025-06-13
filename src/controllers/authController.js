import Users from "../models/userSchema.js";
import { generateToken } from "../utils/generateToken.js";
import bcrypt from "bcryptjs";
import Accounts from "../models/accountSchema.js";
import Card from "../models/cardSchema.js";
import { generateRandom } from "../services/generateRandom.js";
import generateQrCode from "../services/generateQrCode.js";

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(404)
      .json({ message: "Please Filled Out in the form field." });
  }

  try {
    const validatorEmail = await Users.findOne({ email: email });
    if (!validatorEmail) {
      return res.status(404).json({
        message: "Email is wrong",
      });
    }
    if (validatorEmail) {
      const findAccount = await Accounts.findOne({
        customerName: validatorEmail._id,
      });
      if (findAccount.status === "Inactive") {
        return res
          .status(400)
          .json({
            message: "Your account is locked and Inactive User.Plz Contact to Admin.",
          });
      }
      const validatorPassword = await bcrypt.compare(
        password,
        validatorEmail.password
      );
      if (!validatorPassword) {
        return res.status(404).json({
          message: "Password is wrong",
        });
      }
      if (validatorPassword) {
        const token = await generateToken(validatorEmail._id, res);
        return res.status(200).json({
          message: "Login Successfully",
          email: validatorEmail.email,
          _id: validatorEmail._id,
          role: validatorEmail.role,
          token: token,
        });
      }
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const signupController = async (req, res) => {
  const { email, name, password, phoneNumber } = req.body;
  if (!email || !name || !password) {
    return res
      .status(404)
      .json({ message: "Please Filled Out in the form field." });
  }
  try {
    const findEmail = await Users.findOne({ email: email });
    if (findEmail) {
      return res.status(400).json({
        message: "Email is already exist.",
      });
    }
    const findName = await Users.findOne({ name: name });
    if (findName) {
      return res.status(400).json({
        message: "Name is already exist.",
      });
    }
    const findPhoneNumber = await Users.findOne({ phoneNumber: phoneNumber });
    if (findPhoneNumber) {
      return res.status(400).json({
        message: "PhoneNumber is already exist.",
      });
    }
    if (password.length <= 6) {
      return res
        .status(400)
        .json({ message: "Password should be greather than 6." });
    }

    if (phoneNumber.length > 11) {
      return res
        .status(400)
        .json({ message: "Phone Number should be less than 12." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await Users.create({
      name: name,
      email: email,
      password: hashPassword,
      phoneNumber: phoneNumber,
    });

    if (newUser) {
      const account = generateRandom(10);
      const qr = await generateQrCode(`Bank${account}`);
      const cardNo = generateRandom(20);
      await Accounts.create({
        accountNo: account,
        customerName: newUser._id,
        accountType: "savings",
        qrCode: qr,
      });

      const date = newUser.createdAt;
      const newDate = new Date(date);
      newDate.setFullYear(newDate.getFullYear() + 5);

      await Card.create({
        userId: newUser._id,
        cardNo: cardNo,
        cardType: "debit card",
        cardExpiryDate: newDate.toISOString(),
      });
      const token = await generateToken(newUser._id, res);
      return res.status(200).json({
        message: "Signup Successfully",
        email: newUser.email,
        _id: newUser._id,
        role: newUser.role,
        token: token,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const logoutController = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    maxAge: new Date(0),
  });
  return res.status(200).json({ message: "Logout Successfully." });
};
