import React,{ useEffect } from 'react';

const useDocumentTitle = (title, dependencies = []) => {
  useEffect(() => {
    document.title = title;
    return () => {
      document.title = 'CDB - Code Debugging Battle';
    };
  }, [title, ...dependencies]);
};

export default useDocumentTitle;