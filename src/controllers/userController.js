import Accounts from "../models/accountSchema.js";
import Branch from "../models/branchSchema.js";
import Card from "../models/cardSchema.js";
import Users from "../models/userSchema.js";
import generateQrCode from "../services/generateQrCode.js";
import { generateRandom } from "../services/generateRandom.js";
import { generateToken } from "../utils/generateToken.js";
import bcrypt from "bcryptjs";

export const getUserController = async (req, res) => {
  try {
    const findUser = await Users.find({});
    const findBranch = findUser.map((user) => user.branchName);
    const findUserId = findUser.map((user) => user._id);
    const branch = await Branch.find({ _id: findBranch });
    const findCard = await Card.find({ userId: findUserId });

    const branchObject = {};
    branch.forEach((branches) => {
      return (branchObject[branches._id] = branches.branchName);
    });

    const cardObject = {};
    findCard.forEach((card) => {
      return (cardObject[card.userId] = card);
    });

    const data = findUser.map((user) => {
      const branch = branchObject[user.branchName] || "Unknown";
      const cardNo = cardObject[user._id] || "Unknown";
      const list = { ...user.toObject(), branch: branch, cardNo };
      delete list.__v;
      delete list.branchName;
      delete list.password;
      return list;
    });

    return res.status(200).json({
      message: "Fetch User successfully.",
      length: findUser.length,
      data: data,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const postUserController = async (req, res) => {
  const {
    name,
    email,
    password,
    phoneNumber,
    branchName,
    role,
    address,
    profile,
    balance,
    cardBalance
  } = req.body;
  if (!name || !email || !password) {
    return res
      .status(404)
      .json({ message: "Please Filled out in the form field." });
  }

  try {
    const findEmail = await Users.findOne({ email: email });
    if (findEmail) {
      return res.status(400).json({ message: "Email is already exist." });
    }
    const findName = await Users.findOne({ name: name });
    if (findName) {
      return res.status(400).json({ message: "Name is already exist." });
    }
    if (password.length <= 6) {
      return res
        .status(400)
        .json({ message: "Password should be greather than 6." });
    }
    const findPhoneNumber = await Users.findOne({ phoneNumber: phoneNumber });
    if (findPhoneNumber) {
      return res.status(400).json({ message: "PhoneNumber is already exist." });
    }
    if (phoneNumber.length > 11) {
      return res
        .status(400)
        .json({ message: "Phone Number should be less than 12." });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);


    if (role !== "Customer") {
      const findBranch = await Branch.findById({ _id: branchName });

      if (!findBranch) {
        return res.status(400).json({ message: "Branch Name does not exist." });
      }
      const newUsers = await Users.create({
        profile: profile,
        name: name,
        email: email,
        password: hash,
        phoneNumber: phoneNumber,
        role: role,
        branchName: findBranch._id,
        address: address,
      });

      if (newUsers) {
        const findAccount = await Accounts.findOne({customerName:newUsers._id})
        if (findAccount) {
            return res.status(400).json({ message: "Account is already exist." });
        }

        const findCard = await Card.findOne({userId:newUsers._id})
         if (findCard) {
            return res.status(400).json({ message: "Card is already exist." });
        }

        const account = generateRandom(10);
        const qr = await generateQrCode(`Bank${account}`);
        const cardNo = generateRandom(20);
        await Accounts.create({
          accountNo: account,
          customerName: newUsers._id,
          balance:balance,
          accountType: "checking",
          qrCode: qr,
        });

        const date = newUsers.createdAt;
                    const newDate = new Date(date)
                    newDate.setFullYear(newDate.getFullYear()+ 5)

        await Card.create({
          userId: newUsers._id,
          cardNo: cardNo,
          cardType: "debit card",
          cardExpiryDate:newDate.toISOString(),
          cardBalance:cardBalance
        });
        const token = await generateToken(newUsers._id, res);

        return res.status(201).json({
          message: "Create User Successfully.",
          token: token,
          email: newUsers.email,
          _id: newUsers._id,
        });
      }
    } else {
      const newUsers = await Users.create({
        profile: profile,
        name: name,
        email: email,
        password: hash,
        phoneNumber: phoneNumber,
        role: role,
        address: address,
      });

      if (newUsers) {
        const account = generateRandom(10);
        const qr = await generateQrCode(`Bank${account}`);
        const cardNo = generateRandom(20);
        await Accounts.create({
          accountNo: account,
          customerName: newUsers._id,
          accountType: "checking",
          qrCode: qr,
        });

        await Card.create({
          userId: newUsers._id,
          cardNo: cardNo,
          cardType: "debit card",
          cardExpiryDate: new Date(
            newUsers.createdAt.getDate() + 360 * 60 * 60 * 1000
          ),
        });
        const token = await generateToken(newUsers._id, res);

        return res.status(201).json({
          message: "Create User Successfully.",
          token: token,
          email: newUsers.email,
          _id: newUsers._id,
        });
      }
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUserIdController = async (req, res) => {
  const { id } = req.params;
  if (!parseInt(id)) {
    return res.status(404).json({ message: "Not Found" });
  }
  try {
    const findUser = await Users.findById({ _id: id });
    if (!findUser) {
      return res.status(404).json({
        message: "User Id does not exist.",
      });
    }
    if (findUser) {
      if (findUser.role !== "Customer") {
        const findBranch = await Branch.findById({ _id: findUser.branchName });

        if (findBranch) {
          const findUserId = { ...findUser.toObject() };
          delete findUserId.__v;
          delete findUserId.password;

          return res.status(200).json({
            message: "Fetch UserId Successfully.",
            data: findUserId,
          });
        }
      } else {
        const findCard = await Card.findOne({ userId: findUser._id });
        const findUserId = { ...findUser.toObject(), findCard };
        delete findUserId.__v;
        delete findUserId.password;

        return res.status(200).json({
          message: "Fetch UserId Successfully.",
          data: findUserId,
        });
      }
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const patchUserController = async (req, res) => {
  const { id } = req.params;
  if (!parseInt(id)) {
    return res.status(404).json({ message: "Not Found" });
  }
  try {
    const findUser = await Users.findById({ _id: id });
    if (!findUser) {
      return res.status(404).json({
        message: "User Id does not exist.",
      });
    }
    if (findUser) {
      const updateUser = await Users.findOneAndUpdate(
        { _id: id },
        { ...req.body }
      );
      if (updateUser) {
        if (updateUser.role !== "Customer") {
          const findBranch = await Branch.findById({
            _id: updateUser.branchName,
          });
          const findUserId = await Users.findById({ _id: updateUser._id });
          const patchUser = {
            ...findUserId.toObject(),
            branch: findBranch.branchName,
          };
          delete patchUser.branchName;
          delete patchUser.__v;
          delete patchUser.password;

          return res.status(200).json({
            message: "Update User Successfully.",
            data: patchUser,
          });
        } else {
          const findUserId = await Users.findById({ _id: updateUser._id });
          const patchUser = { ...findUserId.toObject() };
          delete patchUser.__v;
          delete patchUser.password;

          return res.status(200).json({
            message: "Update User Successfully.",
            data: patchUser,
          });
        }
      }
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteUserController = async (req, res) => {
  const { id } = req.params;
  if (!parseInt(id)) {
    return res.status(404).json({ message: "Not Found" });
  }
  try {
    const findUser = await Users.findById({ _id: id });
    if (!findUser) {
      return res.status(404).json({
        message: "User Id does not exist.",
      });
    }
    if (findUser) {
      const deleteUser = await Users.findOneAndDelete({ _id: id });
      if (deleteUser) {
        return res.status(200).json({
          message: "Delete User Successfully.",
        });
      }
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
