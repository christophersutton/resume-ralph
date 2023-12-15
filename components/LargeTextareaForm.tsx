import React, { useState } from 'react';

interface LargeTextareaFormProps {
  onSubmit: (content: string) => void; // Placeholder for submit action
}

const LargeTextareaForm: React.FC<LargeTextareaFormProps> = ({ onSubmit }) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setError('The textarea cannot be empty.');
      return;
    }

    setError('');
    onSubmit(content); // Placeholder action on submit
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-1/2 h-3/4">
      <textarea
        className="w-full text-black p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Type your text here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>

      {error && <p className="text-red-500">{error}</p>}

      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Submit
      </button>
    </form>
  );
};

export default LargeTextareaForm;
