import React from 'react';

function DocxPdfDiffTool() {
  const [fileA, setFileA] = React.useState(null);
  const [fileB, setFileB] = React.useState(null);
  const [diffResult, setDiffResult] = React.useState({});

  const handleFileChange = (event, setter) => {
    setter(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!fileA || !fileB) return;

    const formData = new FormData();
    formData.append('fileA', fileA);
    formData.append('fileB', fileB);

    try {
      const response = await fetch('http://localhost:3001/api/compare/docs', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setDiffResult({textDiff: data.diff});
    } catch (error) {
      console.error('Error comparing files:', error);
      setDiffResult({ error: 'An error occurred during comparison.' });
    }
  };

  return (
    <div>
      <input type="file" accept=".docx" onChange={(e) => handleFileChange(e, setFileA)} />
      <input type="file" accept=".docx" onChange={(e) => handleFileChange(e, setFileB)} />
      <button onClick={handleSubmit}>Compare Files</button>
      {diffResult && (
        <div>
          {diffResult.error ? (
            <p className="error-message">{diffResult.error}</p>
          ) : (
            <pre dangerouslySetInnerHTML={{ __html: diffResult.textDiff }}></pre>
          )}
        </div>
      )}
    </div>
  );
}

export default DocxPdfDiffTool;