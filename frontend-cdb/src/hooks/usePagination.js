import React,{ useState, useMemo } from 'react';

const usePagination = (items = [], defaultItemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);

  const totalPages = useMemo(() => 
    Math.ceil(items.length / itemsPerPage),
    [items.length, itemsPerPage]
  );

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }, [currentPage, itemsPerPage, items]);

  const pageNumbers = useMemo(() => 
    Array.from({ length: totalPages }, (_, i) => i + 1),
    [totalPages]
  );

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedItems,
    pageNumbers,
    setCurrentPage,
    setItemsPerPage,
    canPrevious: currentPage > 1,
    canNext: currentPage < totalPages
  };
};

export default usePagination;