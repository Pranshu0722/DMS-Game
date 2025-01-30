const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Initialize Express app
const app = express();
const PORT = 5000; // This allows it to fallback to 5000 or any other available port

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/discreta")
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Define Student Schema
const studentSchema = new mongoose.Schema({
  SName: { type: String, required: true },
  SEmail: { type: String, required: true, unique: true },
  SPassword: { type: String, required: true },
});

// Create Student Model
const Student = mongoose.model("Student", studentSchema);

// Define Admin Schema
const adminSchema = new mongoose.Schema({
  AEmail: { type: String, required: true, unique: true },
  APassword: { type: String, required: true },
});

// Create Admin Model
const Admin = mongoose.model("Admin", adminSchema);

// Define Game Schema
const gameSchema = new mongoose.Schema({
  GID: { type: String, required: true, unique: true },
  GName: { type: String, required: true },
});

const Game = mongoose.model("Game", gameSchema);

// Define Question Schema
const questionSchema = new mongoose.Schema({
  GID: { type: String, required: true, ref: "Game" },
  QID: { type: Number, required: true, unique: true },
  Question: { type: String, required: true },
  QDifficulty: { type: String, required: true },
  QDesc: { type: String },
});

const QuestionModel = mongoose.model("Question", questionSchema);

// Define Option Schema
const optionSchema = new mongoose.Schema({
  QID: { type: Number, required: true, ref: "QuestionModel" },
  OID: { type: String, required: true },
  Option: { type: String, required: true },
  IsCorrect: { type: Boolean, required: true },
});

const OptionModel = mongoose.model("Option", optionSchema);


// API to handle student login
app.post("/student-login", async (req, res) => {
  const { SEmail, SPassword } = req.body;

  if (!SEmail || !SPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const student = await Student.findOne({ SEmail });

    if (!student) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(SPassword, student.SPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: student._id }, "your_jwt_secret_key", { expiresIn: "1h" });
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "An error occurred during login" });
  }
});

// API to add a new student (with hashed password)
app.post("/students", async (req, res) => {
  const { SName, SEmail, SPassword } = req.body;

  if (!SName || !SEmail || !SPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingStudent = await Student.findOne({ SEmail: SEmail.toLowerCase() });
    if (existingStudent) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    const hashedPassword = await bcrypt.hash(SPassword, 10);

    const newStudent = new Student({ SName, SEmail: SEmail.toLowerCase(), SPassword: hashedPassword });
    await newStudent.save();
    res.status(201).json({ message: "Student added successfully" });
  } catch (error) {
    console.error("Error during student registration:", error);
    res.status(400).json({ message: error.message });
  }
});

// API to handle admin login
app.post("/admin-login", async (req, res) => {
  const { AEmail, APassword } = req.body;

  if (!AEmail || !APassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const admin = await Admin.findOne({ AEmail: AEmail.trim().toLowerCase() });

    if (!admin) {
      return res.status(401).json({ message: "Invalid email" });
    }

    if (APassword.trim() !== admin.APassword.trim()) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: admin._id }, "your_jwt_secret_key", { expiresIn: "1h" });
    res.status(200).json({ message: "Login successful", token });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "An error occurred during login" });
  }
});

// API to get all games
app.get("/games", async (req, res) => {
  try {
    const games = await Game.find();
    res.status(200).json(games);
  } catch (error) {
    console.error("Error fetching games:", error);
    res.status(500).json({ message: error.message });
  }
});

// API to add a new question
app.post("/questions/:gid", async (req, res) => {
  const { Question, QDesc, QDifficulty, Options } = req.body;
  const { gid } = req.params;

  if (!Question || !QDifficulty || !Options || Options.length !== 4) {
    return res.status(400).json({ message: "All fields are required and Options must have 4 answers." });
  }

  try {
    // Find the highest QID used across all GIDs in the database
    const highestQuestion = await QuestionModel.findOne().sort({ QID: -1 }).limit(1);
    
    // If there's no previous question, start with QID = 1
    const newQID = highestQuestion ? highestQuestion.QID + 1 : 1;

    const newQuestion = new QuestionModel({
      GID: gid,
      QID: newQID,
      Question,
      QDifficulty,
      QDesc,
    });

    await newQuestion.save();

    for (let i = 0; i < Options.length; i++) {
      const { OID, Option, IsCorrect } = Options[i];
      const newOption = new OptionModel({

        QID: newQID,
        OID,
        Option,
        IsCorrect,
      });

      await newOption.save();
    }

    res.status(201).json({ message: "Question added successfully" });
  } catch (error) {
    console.error("Error adding question:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});



// API to get all questions for a specific game
app.get("/questions/:gid", async (req, res) => {
  const { gid } = req.params;

  try {
    const questions = await QuestionModel.find({ GID: gid });
    res.status(200).json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: error.message });
  }
});

// API to add a new option
app.post("/options", async (req, res) => {
  const { QID, OID, Option, IsCorrect } = req.body;

  if (!QID || !OID || !Option || IsCorrect === undefined) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newOption = new OptionModel({ QID, OID, Option, IsCorrect });
    await newOption.save();
    res.status(201).json({ message: "Option added successfully" });
  } catch (error) {
    console.error("Error adding option:", error);
    res.status(400).json({ message: error.message });
  }
});

// API to get all options for a specific question
app.get("/options/:qid", async (req, res) => {
  const { qid } = req.params;

  try {
    const options = await OptionModel.find({ QID: qid });
    res.status(200).json(options);
  } catch (error) {
    console.error("Error fetching options:", error);
    res.status(500).json({ message: error.message });
  }
});

// API to get all students
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: error.message });
  }
});

app.get("/game/:GName", async (req, res) => {
  const { GName } = req.params; // Retrieve the game name from URL params
  try {
    const game = await Game.findOne({ GName }); // Query the game based on GName
    if (!game) {
      return res.status(404).json({ message: "Game not found" }); // If no game found, send 404
    }
    res.json({ GID: game.GID }); // Return the GID of the found game
  } catch (error) {
    console.error("Error fetching GID by GName:", error);
    res.status(500).json({ message: "Error fetching GID" }); // Internal server error
  }
});


// Start the server with fallback port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});