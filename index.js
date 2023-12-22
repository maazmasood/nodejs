const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Serve static files (images)
app.use("/images", express.static(path.join(__dirname, "images")));

// Your questions array
const questions = [
  {
    page: 1,
    question: "Wie viele Räume sollen klimatisiert werden?",
    options: [
      { text: "1 Raum", image: "/images/room-1.png" },
      { text: "2 Räume", image: "/images/room-2.png" },
      { text: "3 Räume", image: "/images/room-3.png" },
      { text: "4 Räume", image: "/images/room-4.png" },
    ],
  },

  {
    page: 2,
    question: "Wie groß sind die zu klimatisierenden Gesamtflächen?",
    options: [
      { text: "30 m2", image: "/images/30.png" },
      { text: "45 m2", image: "/images/45.png" },
      { text: "60 m2", image: "/images/60.png" },
      { text: "über 60+", image: "/images/60plus.png" },
    ],
  },

  {
    page: 3,
    question: "Welche Art der Inneneinheit möchten sie haben ?",
    options: [
      { text: "Wandgerät", image: "/images/wall.png" },
      { text: "Deckengerät", image: "/images/ceiling.png" },
      { text: "Truhengerät", image: "/images/chest.png" },
      { text: "Nicht sicher", image: "/images/other.png" },
    ],
  },
  {
    page: 4,
    question: "wie lang is der weg zum Außengerät:",
    options: [], // No options for a text box
    textbox: true, // Indicates the presence of a text box
  },
  {
    page: 5,
    question: "Fill in your contact details:",
    options: [], // No options for a text box
    textbox: true, // Indicates the presence of a text box
  },
  // ... (other questions)
];

app.get("/", (req, res) => {
  res.render("form", { questionData: getQuestionData(1), page: 1 });
});

let formData = {};

// app.js

app.post("/submit", (req, res) => {
  const currentPage = parseInt(req.body.page);

  // Filter out unwanted fields (e.g., page, nextPage, comments, etc.)
  const formSubmissionData = {
    ...req.body,
  };

  if (currentPage === 5) {
    // Handle form 6 data
    formData[currentPage] = {
      name: req.body.name,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      inquiry: req.body.inquiry,
      privacy: req.body.privacy === "on", // Convert checkbox value to boolean
    };
  } else if (currentPage === 4) {
    // Handle form 4 data
    formData[currentPage] = {
      comments: req.body.comments,
    };
  } else {
    // Handle other pages
    formData[currentPage] = {
      option: req.body.option,
    };
  }

  if (currentPage === 5) {
    // Display result page for form 6
    res.render("result", { formData });
  } else {
    const nextPage = parseInt(req.body.nextPage) || currentPage + 1;
    res.render("form", {
      questionData: getQuestionData(nextPage),
      page: nextPage,
      formData,
    });
  }
});

function getQuestionData(page) {
  // Implement your logic to get question data based on the page
  // Return an object with question and options properties
  return questions.find((question) => question.page === page);
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
