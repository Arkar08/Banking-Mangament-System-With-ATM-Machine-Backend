import Transaction from "../models/transactionSchema.js";
import Users from "../models/userSchema.js";
import { generateRandom } from "../services/generateRandom.js";
import Accounts from "../models/accountSchema.js";
import Card from "../models/cardSchema.js";

export const getTransaction = async (req, res) => {
  try {
    const findTransaction = await Transaction.find({});

    const findFromCustomer = findTransaction.map(
      (transaction) => transaction.fromCustomerName
    );
    const findToCustomer = findTransaction.map(
      (transaction) => transaction.toCustomerName
    );
    const fromCustomer = await Users.find({ _id: findFromCustomer });
    const toCustomer = await Users.find({ _id: findToCustomer });

    const fromCustomerObject = {};
    fromCustomer.forEach((customer) => {
      return (fromCustomerObject[customer._id] = customer.name);
    });

    const toCustomerObject = {};
    toCustomer.forEach((customer) => {
      return (toCustomerObject[customer._id] = customer.name);
    });

    const pastData = findTransaction.map((transaction) => {
      const fromCustomerName =
        fromCustomerObject[transaction.fromCustomerName] || "Unknown";
      const toCustomerName =
        toCustomerObject[transaction.toCustomerName] || "Unknown";

      const list = {
        ...transaction.toObject(),
        fromCustomerName: fromCustomerName,
        toCustomerName: toCustomerName,
      };
      delete list.__v;
      return list;
    });

    return res.status(200).json({
      message: "Fetch Transaction Successfully.",
      length: pastData.length,
      data: pastData,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const postTransaction = async (req, res) => {
  const { fromCustomerName, toCustomerName, amount, transactionType } =
    req.body;
  if (!amount || !transactionType) {
    return res.status(404).json({
      message: "Please Filled Out in the form field.",
    });
  }
  if (amount < 500) {
    return res.status(400).json({
      message: "Amount is greater than 500",
    });
  }
  try {
    if(transactionType === 'Transfer'){
        const findfromUser = await Accounts.findOne({
            accountNo: fromCustomerName,
        });
        if (!findfromUser) {
        return res.status(404).json({
            message: "Account does not exist.",
        });
        }
        if (findfromUser) {

      if (findfromUser.balance >= amount) {
        const findToUser = await Accounts.findOne({
          accountNo: toCustomerName,
        });
        if (!findToUser) {
          return res.status(404).json({
            message: "Account does not exist.",
          });
        }
        if (findToUser) {
          const transactionNo = generateRandom(10);
          const newTransfer = await Transaction.create({
            transactionNo: transactionNo,
            fromCustomerName: findfromUser.customerName,
            toCustomerName: findToUser.customerName,
            transactionType: transactionType,
            amount: amount,
            status: "Pending",
          });

          if (newTransfer) {
            const withdraw = findfromUser.balance - amount;
            const updateFromAccount = await Accounts.findOneAndUpdate(
              { _id: findfromUser._id },
              { balance: withdraw }
            );
            if (updateFromAccount) {
              const plusAmount = findToUser.balance + amount;
              const updateToAccount = await Accounts.findOneAndUpdate(
                { _id: findToUser._id },
                { balance: plusAmount }
              );
              if (updateToAccount) {
                await Transaction.findOneAndUpdate(
                  { _id: newTransfer._id },
                  { status: "Completed" }
                );
                return res.status(201).json({
                  message: "Payment Successfully.",
                });
              }
            }
          } else {
            return res.status(400).json({
              message: "Payment Failed.",
            });
          }
        }
      } else {
        return res.status(404).json({
          message: `${findfromUser.name}'s amount is low.`,
        });
      }
    }
    }else{
        const findfromUser = await Accounts.findOne({
            accountNo: fromCustomerName,
            });
        if (!findfromUser) {
                return res.status(404).json({
                    message: "Account does not exist.",
            });
        }
        const findCard = await Card.findOne({userId:findfromUser.customerName})
        if(!findCard){
             return res.status(404).json({
                    message: "Card does not exist.",
            });
        }
        if(findCard){
            if(transactionType === 'Deposit'){
                if(findCard.cardBalance >= amount){
                        const transactionNo = generateRandom(10);
                        const newDeposit = await Transaction.create({
                        transactionNo: transactionNo,
                        fromCustomerName: findCard.userId,
                        transactionType: transactionType,
                        amount: amount,
                        status: "Pending",
                    });
                    if(newDeposit){
                        const deposit = findfromUser.balance + amount;
                        const updateAccount = await Accounts.findOneAndUpdate({
                          _id:findfromUser._id
                        },{balance:deposit})
                        const cardBalance = findCard.cardBalance - amount;
                        const updateCard = await Card.findOneAndUpdate(
                            { _id: findCard._id },
                            { cardBalance: cardBalance }
                          );
                         if (updateAccount && updateCard) {
                            await Transaction.findOneAndUpdate(
                            { _id: newDeposit._id },
                            { status: "Completed" }
                            );
                            return res.status(201).json({
                            message: "Payment Successfully.",
                            });
                        }
                    }
                }else{
                    return res.status(400).json({message:"Card Balance is low."})
                }
            }else{
              if(findfromUser.balance >= amount){
                const transactionNo = generateRandom(10);
                 const newWithdraw = await Transaction.create({
                        transactionNo: transactionNo,
                        fromCustomerName: findCard.userId,
                        transactionType: transactionType,
                        amount: amount,
                        status: "Pending",
                    });
                    if(newWithdraw){
                        const withdraw = findfromUser.balance - amount;
                         const updateAccount = await Accounts.findOneAndUpdate({
                          _id:findfromUser._id
                        },{balance:withdraw})
                        const cardBalance = findCard.cardBalance + amount;
                         const updateCard = await Card.findOneAndUpdate(
                            { _id: findCard._id },
                            { cardBalance: cardBalance }
                          );
                         if (updateAccount && updateCard) {
                            await Transaction.findOneAndUpdate(
                            { _id: newWithdraw._id },
                            { status: "Completed" }
                            );
                            return res.status(201).json({
                            message: "Payment Successfully.",
                            });
                        }
                    }
              }else{
                return res.status(400).json({message:"Your Balance is low."})
              }
                
            }
        }
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUserTransaction = async (req, res) => {
  const { userId } = req.params;
  if (!parseInt(userId)) {
    return res.status(404).json({ message: "Not Found" });
  }
  try {
    const findUser = await Transaction.find({ fromCustomerName: userId });
    const findToUser = await Transaction.find({ toCustomerName: userId });
    const userlist = [...findUser, ...findToUser];
    const findFromCustomer = userlist.map(
      (transaction) => transaction.fromCustomerName
    );
    const findToCustomer = userlist.map(
      (transaction) => transaction.toCustomerName
    );
    const fromCustomer = await Users.find({ _id: findFromCustomer });
    const toCustomer = await Users.find({ _id: findToCustomer });

    const fromCustomerObject = {};
    fromCustomer.forEach((customer) => {
      return (fromCustomerObject[customer._id] = customer.name);
    });

    const toCustomerObject = {};
    toCustomer.forEach((customer) => {
      return (toCustomerObject[customer._id] = customer.name);
    });

    const pastData = userlist.map((transaction) => {
        const isSender = transaction.fromCustomerName.toString() === userId;
      const transactionAmount = isSender ||transaction.transactionType === 'Withdraw'
        ? "-"+Number(transaction.amount)
        :"+"+Number(transaction.amount);
      const fromCustomerName =
        fromCustomerObject[transaction.fromCustomerName] || "Unknown";
      const toCustomerName =
        toCustomerObject[transaction.toCustomerName] || "Unknown";
      const list = {
        ...transaction.toObject(),
        fromCustomerName: fromCustomerName,
        toCustomerName: toCustomerName,
        amount:transactionAmount
      };
      delete list.__v;
      return list;
    });

    return res.status(200).json({
      message: "Fetch Transaction Successfully.",
      length: pastData.length,
      data: pastData,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
