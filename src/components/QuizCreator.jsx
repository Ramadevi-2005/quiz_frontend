import React, { useState } from "react";

export default function QuizCreator() {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([
    {
      questionText: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      type: "multiple",
    },
  ]);

  const handleTitleChange = (e) => setTitle(e.target.value);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        type: "multiple",
      },
    ]);
  };

  const saveQuiz = async () => {
    const quizData = { title, questions };

    try {
      const response = await fetch("http://localhost:8085/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quizData),
      });

      if (response.ok) {
        const savedQuiz = await response.json();
        alert("✅ Quiz saved successfully! ID: " + savedQuiz.id);

        // Reset form after saving
        setTitle("");
        setQuestions([
          {
            questionText: "",
            options: ["", "", "", ""],
            correctAnswer: 0,
            type: "multiple",
          },
        ]);
      } else {
        const errorText = await response.text();
        alert("❌ Error saving quiz: " + errorText);
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("⚠️ Backend not reachable. Make sure Spring Boot is running on port 8085.");
    }
  };

  return (
    <div className="quiz-creator">
      <h2>Create New Quiz</h2>

      {/* Quiz Title Input */}
      <div className="quiz-title">
        <label htmlFor="quiz-title" className="font-semibold">
          Quiz Title *
        </label>
        <input
          type="text"
          id="quiz-title"
          placeholder="Enter your quiz title"
          value={title}
          onChange={handleTitleChange}
          className="border rounded-md p-2 w-full mt-1"
        />
      </div>

      {/* Questions Section */}
      <div className="questions mt-6">
        {questions.map((q, index) => (
          <div key={index} className="question mb-4 border p-4 rounded-md">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Question {index + 1}</h3>
              <select
                value={q.type}
                onChange={(e) =>
                  setQuestions((prev) =>
                    prev.map((ques, i) =>
                      i === index ? { ...ques, type: e.target.value } : ques
                    )
                  )
                }
                className="border rounded-md p-1"
              >
                <option value="multiple">Multiple Choice</option>
                <option value="truefalse">True / False</option>
              </select>
            </div>

            <textarea
              placeholder="Enter your question..."
              value={q.questionText}
              onChange={(e) =>
                setQuestions((prev) =>
                  prev.map((ques, i) =>
                    i === index
                      ? { ...ques, questionText: e.target.value }
                      : ques
                  )
                )
              }
              className="border rounded-md p-2 w-full mt-2"
            />

            <div className="options mt-2">
              {q.options.map((opt, i) => (
                <div key={i} className="flex items-center mb-1">
                  <input
                    type={q.type === "multiple" ? "radio" : "checkbox"}
                    name={`question-${index}`}
                    checked={q.correctAnswer === i}
                    onChange={() =>
                      setQuestions((prev) =>
                        prev.map((ques, idx) =>
                          idx === index ? { ...ques, correctAnswer: i } : ques
                        )
                      )
                    }
                    className="mr-2"
                  />
                  <input
                    type="text"
                    placeholder={`Option ${i + 1}`}
                    value={opt}
                    onChange={(e) =>
                      setQuestions((prev) =>
                        prev.map((ques, idx) =>
                          idx === index
                            ? {
                                ...ques,
                                options: ques.options.map((o, j) =>
                                  j === i ? e.target.value : o
                                ),
                              }
                            : ques
                        )
                      )
                    }
                    className="border rounded-md p-1 w-full"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addQuestion}
        className="bg-purple-600 text-white px-4 py-2 rounded-md mt-4"
      >
        + Add Question
      </button>

      <div className="mt-6 flex justify-end gap-2">
        <button
          onClick={saveQuiz}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Save Quiz
        </button>
        <button
          onClick={() => {
            setTitle("");
            setQuestions([
              {
                questionText: "",
                options: ["", "", "", ""],
                correctAnswer: 0,
                type: "multiple",
              },
            ]);
          }}
          className="text-gray-500 px-4 py-2 rounded-md"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
