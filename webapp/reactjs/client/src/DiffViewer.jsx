import React from 'react';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer';

function DiffViewer() {
    const [fileA, setFileA] = React.useState(null);
    const [fileB, setFileB] = React.useState(null);
    const [diff, setDiff] = React.useState({
      textA: 'hello\n\nHow are you? What are your plan?',
      textB: 'hello\n\nWhat are you? What are your plans?',
    });

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

            const data = await response.json();
            setDiff(data);
        };

        fetchData();
    }, [fileA, fileB]);

    const handleFileChange = (event, setter) => {
        setter(event.target.files[0]);
    };

    const newStyles = {
        variables: {
          dark: {
            highlightBackground: '#fefed5',
            highlightGutterBackground: '#ffcd3c',
          },
          light: {
            highlightBackground: '#fefed5',
            highlightGutterBackground: '#ffcd3c',
          },
        },
        line: {
          padding: '10px 2px',
          '&:hover': {
            background: '#a26ea1',
          },
        },
      };

    return (
        <div>
            <input type="file" accept=".docx" onChange={(e) => handleFileChange(e, setFileA)} />
            <input type="file" accept=".docx" onChange={(e) => handleFileChange(e, setFileB)} />
            {
                diff && 
                <ReactDiffViewer
                    oldValue={diff.textA}
                    newValue={diff.textB} 
                    hideLineNumbers={true}
                    splitView={false}
                    compareMethod={DiffMethod.CHARS}
                    styles={newStyles}
                    showDiffOnly={true}
                />
            }
        </div>
    );
}

export default DiffViewer;