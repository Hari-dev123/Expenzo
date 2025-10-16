const User = require("../Models/userModel.js");
const Income = require("../Models/incomeModel.js");
const Expense = require("../Models/expenseModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const nameRegex = /^[A-Za-z\s]+$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
const passwordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const amountRegex = /^\d+$/;

const generateToken = (email) => {
  const payload = {
    email: email,
  };

  const options = {
    expiresIn: "1d",
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, options);
  return token;
};

const createUser = async (req, res) => {
  try {
    const { name, password, email } = req.body;

    if (!nameRegex.test(name)) {
      return res
        .status(400)
        .json({ message: "Name must contain only letters" });
    }

    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: "Email must be a valid Gmail address" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already exists. Please use another email." });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 character,include uppercase,lowercase,number and special character",
      });
    }

    //hash password

    const hashedPassword = await bcrypt.hash(password, 10);

    //save user to Db
    const userDetails = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    // response with only token or email
    const token = generateToken(userDetails.email);
    res
      .status(201)
      .json({ message: "user created successfully", token: token });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const UserEmail = await User.findOne({ email: email });
    if (!UserEmail) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const Password = await bcrypt.compare(password, UserEmail.password);
    if (!Password) {
      return res.status(400).json({ message: "Password incorrect" });
    }
    const token = generateToken(UserEmail.email);
    res.json({
      message: "user logges in",
      token,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const createIncome = async (req, res) => {
  try {
    const { email } = req.user;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const { amount, description } = req.body;
    if (!amountRegex.test(amount)) {
      return res.status(400).json({ message: "Amount must be only  Numbers" });
    }
    const income = await Income.create({ user: user._id, amount, description });
    res
      .status(201)
      .json({ message: "Income added successfully", income: income });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const detailIncome = async (req, res) => {
  try {
    const id = req.params.id;
    const income = await Income.findById(id);
    if (!income) {
      res.status(404).json({ message: "No Income Found" });
    }
    res
      .status(200)
      .json({ message: "Selected income details", income: income })``;
  } catch (e) {
    res.status(500).json({ messaage: e.message });
  }
};

const detailExpense = async (req, res) => {
  try {
    const id = req.params.id;
    const expense = await Expense.findById(id);
    if (!expense) {
      res.status(404).json({ message: "No Expense Found" });
    }
    res
      .status(200)
      .json({ message: "Selected Expense details", Expense: expense });
  } catch (e) {
    res.status(500).json({ messaage: e.message });
  }
};

const getIncome = async (req, res) => {
  try {
    const { email } = req.user;
    const { page, limit } = req.query;
    const user = await User.findOne({ email });
    const userId = user._id;
    console.log("hereeeeeeeeee", email, page, limit, user);
    const skip = (page - 1) * limit;

    const total = await Income.countDocuments({ user: userId });

    const incomes = await Income.find({ user: userId }).skip(skip).limit(limit);

    return res.status(200).json({
      page: page,
      limit: limit,
      total: total,
      totalPages: Math.ceil(total / limit),
      response: incomes,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
const getExpense = async (req, res) => {
  try {
    const { email } = req.user;
    const { page, limit } = req.query;
    const user = await User.findOne({ email });
    const userId = user._id;

    const skip = (page - 1) * limit;
    const total = await Income.countDocuments({ user: userId });

    const expense = await Expense.find({ user: userId })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      page: page,
      limit: limit,
      total: total,
      totalPages: Math.ceil(total / limit),
      response: expense,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const Incomesearch = async (req, res) => {
  try {
    const id = req.params.id;
    const { page, limit, search } = req.query;
    const skip = (page - 1) * limit;

    const searchQuery = {
      user: id, // Filter by user ID
      ...(search && { description: { $regex: search, $options: "i" } }), // Case-insensitive search
    };

    const searchIncome = await Income.find(searchQuery).skip(skip).limit(limit);

    res.status(200).json({ page: page, limit: limit, Income: searchIncome });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const Expensesearch = async (req, res) => {
  try {
    const id = req.params.id;
    const { page, limit, search } = req.query;
    const skip = (page - 1) * limit;

    const searchQuery = {
      user: id, // Filter by user ID
      ...(search && { description: { $regex: search, $options: "i" } }), // Case-insensitive search
    };

    const searchExpense = await Expense.find(searchQuery)
      .skip(skip)
      .limit(limit);

    res.status(200).json({ page: page, limit: limit, Expense: searchExpense });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const createExpense = async (req, res) => {
  try {
    const { amount, description } = req.body;
    const { email } = req.user;
    const user = await User.findOne({ email });
    if (!amountRegex.test(amount)) {
      return res.status(400).json({ message: "Amount must be only numbers" });
    }
    const expense = await Expense.create({
      amount,
      description,
      user: user._id,
    });
    res
      .status(201)
      .json({ message: "Expenses Added successfully", expense: expense });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const totalIncome = async (req, res) => {
  try {
    const { email } = req.user;
    const user = await User.findOne({ email });
    const totalincome = await Income.aggregate([
      { $match: { user: user._id } },
      { $group: { _id: "$user", total: { $sum: "$amount" } } },
    ]);
    if (totalincome.length === 0) {
      return res.status(200).json({ message: "No income found", total: 0 });
    }
    res.status(200).json({ totalincome: totalincome[0].total });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const totalExpense = async (req, res) => {
  try {
    const { email } = req.user;
    const user = await User.findOne({ email });
    const totalexpense = await Expense.aggregate([
      { $match: { user: user._id } },
      { $group: { _id: "$user", total: { $sum: "$amount" } } },
    ]);
    if (totalexpense.length === 0) {
      return res.status(200).json({ message: "No Expense found", total: 0 });
    }
    res.status(200).json({ totalexpense: totalexpense[0].total });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const totalBalance = async (req, res) => {
  try {
    const { email } = req.user;
    const user = await User.findOne({ email });
    const totalIncome = await Income.aggregate([
      { $match: { user: user._id } },
      { $group: { _id: "$user", total: { $sum: "$amount" } } },
    ]);

    const totalExpense = await Expense.aggregate([
      { $match: { user: user._id } },
      { $group: { _id: "$user", total: { $sum: "$amount" } } },
    ]);
    // Get values or default to 0 if no data
    const income = totalIncome.length > 0 ? totalIncome[0].total : 0;
    const expense = totalExpense.length > 0 ? totalExpense[0].total : 0;
    // Calculate balance, ensure it doesn't go below 0
    const balance = Math.max(0, income - expense);

    res.status(200).json({
      totalIncome: income,
      totalExpense: expense,
      balance: balance,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const updateIncome = async (req, res) => {
  try {
    const updateid = req.params.id;
    const { amount, description } = req.body;

    if (!amountRegex.test(amount)) {
      return res
        .status(400)
        .json({ message: "Amount must be in numbers only" });
    }

    const updateIncome = await Income.findByIdAndUpdate(
      updateid,
      { amount, description },
      { new: true, runValidator: true }
    );
    if (!updateIncome) {
      return res.status(404).json({ message: "income not found" });
    }

    res.status(200).json({
      message: "income updated successfully",
      income: updateIncome,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const updateExpense = async (req, res) => {
  try {
    const updateid = req.params.id;
    const { amount, description } = req.body;

    if (!amountRegex.test(amount)) {
      return res
        .status(400)
        .json({ message: "Amount must be in numbers only" });
    }

    const updateExpense = await Expense.findByIdAndUpdate(
      updateid,
      { amount, description },
      { new: true, runValidator: true }
    );
    if (!updateExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json({
      message: "Expense updated successfully",
      expense: updateExpense,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const deleteIncome = async (req, res) => {
  try {
    const incomeid = req.params.id;
    const deleteincome = await Income.findByIdAndDelete(incomeid);
    if (!deleteincome) {
      res.status(404).json({ message: "Given income is not found" });
    }
    res
      .status(200)
      .json({ message: "Income deleted successfully", delete: deleteincome });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const expenseid = req.params.id;
    const deleteexpense = await Expense.findByIdAndDelete(expenseid);
    if (!deleteexpense) {
      res.status(404).json({ message: "Given expense is not found" });
    }
    res
      .status(200)
      .json({ message: "Expense deleted successfully", delete: deleteexpense });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteuser = await User.findByIdAndUpdate(
      id,
      { status: 0 },
      { new: true }
    );
    if (!deleteuser) {
      res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User Deleted successfully" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const IncomeByDate = async (req, res) => {
  try {
    const { date, id } = req.params;

    //converts date string into js object
    const parsedDate = new Date(date);

    //gettime give the give date timestamps
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "invlaid date format" });
    }

    //it change the jso date into iso format because in db it stores in iso format the spilt the date only
    const FindDate = parsedDate.toISOString().split("T")[0];
    //then find in Income collection by using this expression beacuse eq,gte query are run in expression
    const FindByDate = await Income.find({
      user: id,
      $expr: {
        $eq: [
          //it convert the created at into this format
          { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          FindDate,
        ],
      },
    });
    if (!FindByDate || FindByDate.length === 0) {
      return res.status(404).json({ message: "No income found on this date" });
    }
    return res
      .status(200)
      .json({ message: `${date} Income`, Income: FindByDate });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const ExpenseByDate = async (req, res) => {
  try {
    const { date, id } = req.params;
    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "invlaid date format" });
    }

    const FindDate = parsedDate.toISOString().split("T")[0];
    const FindByDate = await Expense.find({
      user: id,
      $expr: {
        $eq: [
          { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          FindDate,
        ],
      },
    });
    if (!FindByDate || FindByDate.length === 0) {
      res.status(404).json({ message: "No Expense  found on this date" });
    }
    res.status(200).json({ message: `${date} Expense`, Expense: FindByDate });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports = {
  createUser,
  createIncome,
  createExpense,
  Login,
  totalIncome,
  totalExpense,
  totalBalance,
  deleteIncome,
  deleteExpense,
  updateIncome,
  updateExpense,
  deleteUser,
  IncomeByDate,
  ExpenseByDate,
  getIncome,
  getExpense,
  Incomesearch,
  Expensesearch,
  detailIncome,
  detailExpense,
};
