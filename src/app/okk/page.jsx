'use client'
import React, { useState } from 'react';

const jsonData = [
  {
    "id": 1,
    "question": "What is Next.js?",
    "answer": "Next.js is a React framework for building server-side rendered and statically generated web applications."
  },
  {
    "id": 2,
    "question": "What is React?",
    "answer": "React is a JavaScript library for building user interfaces."
  },
  {
    "id": 3,
    "question": "What is Node.js?",
    "answer": "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine."
  }
];

export default function MyComponent() {
  const [index, setIndex] = useState(0);

  const handleNext = () => {
    if (index < jsonData.length - 1) {
      setIndex(index + 1);
    }
  };

  const handlePrevious = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  return (
    <div>
      <h1>JSON Data:</h1>
      <div>
        <h2>{jsonData[index].question}</h2>
        <p>{jsonData[index].answer}</p>
      </div>
      <div>
        <button onClick={handlePrevious} disabled={index === 0}>Previous</button>
        <button onClick={handleNext} disabled={index === jsonData.length - 1}>Next</button>
      </div>
    </div>
  );
}
