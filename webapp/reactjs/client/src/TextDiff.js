import React from 'react';
import { diffWords } from 'diff';

const TextDiff = () => {
  const [text1, setText1] = React.useState('');
  const [text2, setText2] = React.useState('');
  const [fileA, setFileA] = React.useState(null);
  const [fileB, setFileB] = React.useState(null);
  const [diffResult, setDiffResult] = React.useState([]);

  const handleText1Change = (e) => {
    setText1(e.target.value);
    computeDiff(e.target.value, text2);
  };

  const handleText2Change = (e) => {
    setText2(e.target.value);
    computeDiff(text1, e.target.value);
  };

  const computeDiff = (text1, text2) => {
    const diff = diffWords(text1, text2);
    setDiffResult(diff);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      if (!fileA || !fileB) return;

      const formData = new FormData();
      formData.append('fileA', fileA);
      formData.append('fileB', fileB);

      const response = await fetch('http://localhost:3001/api/compare/docs', {
        method: 'POST',
        body: formData,
      });

      const { textA, textB } = await response.json();
      setText1(textA);
      setText2(textB);
      computeDiff(textA, textB);
    };

    fetchData();
  }, [fileA, fileB]);

  const handleFileChange = (event, setter) => {
    setter(event.target.files[0]);
  };

  return (
    <div>
      <input type="file" accept=".docx" onChange={(e) => handleFileChange(e, setFileA)} />
      <input type="file" accept=".docx" onChange={(e) => handleFileChange(e, setFileB)} />
      <textarea
        value={text1}
        onChange={handleText1Change}
        placeholder="Enter first text"
      ></textarea>
      <textarea
        value={text2}
        onChange={handleText2Change}
        placeholder="Enter second text"
      ></textarea>
      <pre>
        {diffResult.map((part, index) => (
          <span
            key={index}
            style={{
              color: part.added ? 'green' : part.removed ? 'red' : 'black',
              textDecoration: part.removed ? 'line-through' : 'none',
            }}
          >
            {part.value}
          </span>
        ))}
      </pre>
    </div>
  );
};

export default TextDiff;
