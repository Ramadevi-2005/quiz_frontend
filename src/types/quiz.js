// quiz.js

const API_BASE_URL = "http://localhost:8085/api/quizzes";

// ✅ Fetch all quizzes
export async function getQuizzes() {
  const res = await fetch(API_BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch quizzes");
  return res.json();
}

// ✅ Create a new quiz
export async function createQuiz(quizData) {
  const res = await fetch(API_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(quizData),
  });
  if (!res.ok) throw new Error("Failed to create quiz");
  return res.json();
}

// ✅ Get a quiz by ID
export async function getQuizById(id) {
  const res = await fetch(`${API_BASE_URL}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch quiz");
  return res.json();
}

// ✅ Update a quiz
export async function updateQuiz(id, quizData) {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(quizData),
  });
  if (!res.ok) throw new Error("Failed to update quiz");
  return res.json();
}

// ✅ Delete a quiz
export async function deleteQuiz(id) {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete quiz");
  return true;
}
