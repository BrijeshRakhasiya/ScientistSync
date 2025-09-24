import React, { useState } from "react";

export default function UploadForm() {
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Research Uploaded: ${title}`);
  };

  return (
    <div className="card">
      <h3>Upload Research</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        /><br /><br />
        <textarea
          placeholder="Abstract"
          value={abstract}
          onChange={(e) => setAbstract(e.target.value)}
          required
        /><br /><br />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}
