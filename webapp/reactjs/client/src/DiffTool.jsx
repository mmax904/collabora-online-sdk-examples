import React from 'react';

function DiffTool() {
  const [fileA, setFileA] = React.useState(null);
  const [fileB, setFileB] = React.useState(null);
  const [diffHtml, setDiffHtml] = React.useState(null);

  const handleFileChange = (event, setter) => {
    setter(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!fileA || !fileB) return;

    const formData = new FormData();
    formData.append('fileA', fileA);
    formData.append('fileB', fileB);

    const response = await fetch('http://localhost:3001/api/compare/docs', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    setDiffHtml(data.diff);
  };

  return (
    <div>
      <input type="file" accept=".docx" onChange={(e) => handleFileChange(e, setFileA)} />
      <input type="file" accept=".docx" onChange={(e) => handleFileChange(e, setFileB)} />
      <button onClick={handleSubmit}>Compare</button>
      <div dangerouslySetInnerHTML={{ __html: diffHtml }}></div>
    </div>
  );
}

export default DiffTool;