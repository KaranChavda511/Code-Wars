import './TestCaseViewer.css';

const TestCaseViewer = ({ results }) => {
    if (!results || results.length === 0) return null;
  
    return (
      <div className="test-case-viewer">
        {results.map((test, index) => (
          <div 
            key={index} 
            className={`test-case ${test.passed ? 'passed' : 'failed'}`}
          >
            <div className="test-header">
              <strong>Test Case {index + 1}</strong>
              <span className="status">
                {test.passed ? '✓ Passed' : '✗ Failed'}
              </span>
              <span className="runtime">{test.runtime.toFixed(2)}ms</span>
            </div>
            
            {!test.passed && (
              <div className="test-details">
                <div className="input">
                  <label>Input:</label>
                  <pre>{JSON.stringify(test.input, null, 2)}</pre>
                </div>
                <div className="expected">
                  <label>Expected:</label>
                  <pre>{JSON.stringify(test.expected, null, 2)}</pre>
                </div>
                <div className="output">
                  <label>Output:</label>
                  <pre>{JSON.stringify(test.output, null, 2)}</pre>
                </div>
                {test.error && (
                  <div className="error">
                    <label>Error:</label>
                    <pre>{test.error}</pre>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };
  
  export default TestCaseViewer;