
"use client";

import type { Idea } from '@/types';
import { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

interface IdeasContextType {
  ideas: Idea[];
  addIdea: (content: string) => void;
  getIdeaById: (id: string) => Idea | undefined;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const IdeasContext = createContext<IdeasContextType | undefined>(undefined);

export const IdeasProvider = ({ children }: { children: ReactNode }) => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(false);

  const addIdea = (content: string) => {
    const newIdea: Idea = {
      id: uuidv4(),
      content,
      createdAt: new Date(),
    };
    setIdeas((prevIdeas) => [...prevIdeas, newIdea]);
  };

  const getIdeaById = (id: string) => {
    return ideas.find(idea => idea.id === id);
  };

  return (
    <IdeasContext.Provider value={{ ideas, addIdea, getIdeaById, loading, setLoading }}>
      {children}
    </IdeasContext.Provider>
  );
};

export const useIdeas = (): IdeasContextType => {
  const context = useContext(IdeasContext);
  if (context === undefined) {
    throw new Error('useIdeas must be used within an IdeasProvider');
  }
  return context;
};
