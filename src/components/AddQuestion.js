import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function AddQuestion() {
  const { gid } = useParams(); // Get GID from URL
  const navigate = useNavigate();
  const [questionData, setQuestionData] = useState({
    Question: "",
    QDesc: "",
    QDifficulty: "",
    Options: [
      { OID: "A", Option: "", IsCorrect: false },
      { OID: "B", Option: "", IsCorrect: false },
      { OID: "C", Option: "", IsCorrect: false },
      { OID: "D", Option: "", IsCorrect: false },
    ],
  });

  // Handle input changes
  const handleChange = (e, index) => {
    const { name, value } = e.target;

    if (name === "Option" || name === "IsCorrect") {
      const updatedOptions = [...questionData.Options];
      updatedOptions[index] = {
        ...updatedOptions[index],
        [name]: name === "IsCorrect" ? JSON.parse(value) : value, // Ensure IsCorrect is treated as boolean
      };
      setQuestionData({ ...questionData, Options: updatedOptions });
    } else {
      setQuestionData({ ...questionData, [name]: value });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate that all fields are filled out
    if (!questionData.Question || !questionData.QDifficulty || !questionData.Options.every(option => option.Option)) {
      alert("Please fill in all fields.");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/questions/${gid}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Question: questionData.Question,
          QDesc: questionData.QDesc,
          QDifficulty: questionData.QDifficulty,
          Options: questionData.Options,
        }),
      });
  
      // Check if response is OK (status 200-299)
      if (!response.ok) {
        // If not OK, check the response body (HTML or other)
        const text = await response.text(); 
        console.error('Server responded with:', text);
        alert('Server Error: ' + text);
        return;
      }
  
      const data = await response.json();
      alert("Question added successfully!");
      navigate("/admin-dashboard"); // Redirect to admin dashboard
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while adding the question.");
    }
  };
  

  return (
    <>
    <Navbar title="Discrete Mathematics Game" showBackButton={true} />
    <div className="add-question-container">
      
      <form onSubmit={handleSubmit} className="common-form ques-form">
      <h2>Add New Question</h2>
        <div>
          <label>Question:</label>
          <input
            type="text"
            name="Question"
            value={questionData.Question}
            onChange={(e) => handleChange(e, null)}
            required
          />
          <label>Q Description:</label>
          <textarea
            name="QDesc"
            value={questionData.QDesc}
            onChange={(e) => handleChange(e, null)}
          />
          <label>Difficulty:</label>
          <select
            name="QDifficulty"
            value={questionData.QDifficulty}
            onChange={(e) => handleChange(e, null)}
            required
          >
            <option value="">Select Difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        {questionData.Options.map((option, index) => (
          <div key={index}>
            <label>{`Option ${option.OID}:`}</label>
            <input
              type="text"
              name="Option"
              value={option.Option}
              onChange={(e) => handleChange(e, index)}
              required
            />
            <label>Correct:</label>
            <select
              name="IsCorrect"
              value={option.IsCorrect}
              onChange={(e) => handleChange(e, index)}
              required
            >
              <option value={false}>False</option>
              <option value={true}>True</option>
            </select>
          </div>
        ))}

        <button type="submit">Add Question</button>
      </form>
    </div>
    </>
  );
}

export default AddQuestion;
