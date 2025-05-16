import React,{ useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { toast } from 'react-hot-toast';
import API from '../../services/api.js';
import TestCaseViewer from './TestCaseViewer.jsx';
import './ChallengeEditor.css'

const ChallengeEditor = ({ challenge }) => {
  const [code, setCode] = useState(challenge?.starterCode || '');
  const [results, setResults] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRunCode = async () => {
    if (!code.trim()) {
      toast.error('Please write some code first');
      return;
    }

    setIsExecuting(true);
    try {
      const { data } = await API.post('/code/run', {
        challengeId: challenge._id,
        code,
      });
      setResults(data);
      if (data.success) {
        toast.success('All test cases passed!');
      } else {
        toast.error(`${data.passedCount} of ${data.totalTests} test cases passed`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Execution failed');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSubmitSolution = async () => {
    setIsSubmitting(true);
    try {
      const { data } = await API.post('/submissions/submit', {
        challengeId: challenge._id,
        code,
      });
      if (data.success) {
        toast.success(`Solution submitted! +${data.score} points`);
      } else {
        toast.error('Solution needs more work');
      }
    } catch (error) {
      toast.error('Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="challenge-editor">
      <div className="editor-header">
        <h3>{challenge.title}</h3>
        <div className="editor-actions">
          <button 
            onClick={handleRunCode} 
            disabled={isExecuting}
            className="run-btn"
          >
            {isExecuting ? 'Running...' : 'Run Code'}
          </button>
          <button 
            onClick={handleSubmitSolution}
            disabled={isSubmitting || !results?.success}
            className="submit-btn"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Solution'}
          </button>
        </div>
      </div>

      <div className="editor-wrapper">
        <Editor
          height="60vh"
          defaultLanguage="javascript"
          theme="vs-dark"
          value={code}
          onChange={setCode}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
          }}
        />
      </div>

      {results && (
        <div className="test-results">
          <h4>Test Results ({results.passedCount}/{results.totalTests})</h4>
          <TestCaseViewer results={results.testResults} />
        </div>
      )}
    </div>
  );
};

export default ChallengeEditor;