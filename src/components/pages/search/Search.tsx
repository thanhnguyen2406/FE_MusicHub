import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTodo } from '../../../redux/slices/todoSlicer';
import type { AppDispatch } from '../../../redux/store';

const Search = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { isLoading, data, error } = useSelector((state: any) => state.todo);
  
    useEffect(() => {
      dispatch(fetchTodo());
    }, [dispatch]);
  
    if (isLoading) return <h1>Loading...</h1>;
    if (error) return <h1>Something went wrong</h1>;
  
    return (
      <div>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    );
  };

export default Search