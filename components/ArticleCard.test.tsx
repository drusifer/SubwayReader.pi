import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ArticleCard from './ArticleCard';
import { Article } from '../types';

// Declare Jest globals to fix TS errors when types are missing
declare const describe: any;
declare const it: any;
declare const expect: any;
declare const jest: any;

const mockArticle: Article = {
  id: '123',
  title: 'Test Article Title',
  url: 'https://example.com',
  category: 'Tech',
  source: 'Daily News',
  summary: 'This is a test summary',
  isDownloaded: false
};

describe('ArticleCard (Component)', () => {
  it('renders article information correctly', () => {
    render(<ArticleCard article={mockArticle} onClick={() => {}} />);
    
    expect(screen.getByText('Test Article Title')).toBeInTheDocument();
    expect(screen.getByText('This is a test summary')).toBeInTheDocument();
    expect(screen.getByText(/Daily News/)).toBeInTheDocument();
  });

  it('shows cloud icon when not downloaded', () => {
    render(<ArticleCard article={{...mockArticle, isDownloaded: false}} onClick={() => {}} />);
    expect(screen.getByTestId('status-cloud-123')).toBeInTheDocument();
  });

  it('shows check icon when downloaded', () => {
    render(<ArticleCard article={{...mockArticle, isDownloaded: true}} onClick={() => {}} />);
    expect(screen.getByTestId('status-downloaded-123')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<ArticleCard article={mockArticle} onClick={handleClick} />);
    
    fireEvent.click(screen.getByTestId('article-card-123'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});