import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Article, FontFamily } from '../types';
import { ArrowLeft } from 'lucide-react';

interface ReaderViewProps {
  article: Article;
  onBack: () => void;
  fontSize: number;
  fontFamily: FontFamily;
}

export default function ReaderView({ article, onBack, fontSize, fontFamily }: ReaderViewProps) {
  const fontClass = fontFamily === 'serif' ? 'font-serif' : 'font-sans';

  return (
    <div className={`min-h-screen bg-paper dark:bg-paper-dark text-ink dark:text-ink-dark transition-colors duration-200 animate-in fade-in slide-in-from-bottom-4 duration-300`}>
      
      {/* Sticky Header */}
      <div className="sticky top-0 bg-paper/95 dark:bg-paper-dark/95 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-800/50 p-4 flex items-center gap-4 z-20">
        <button 
          onClick={onBack}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-bold truncate text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {article.source}
          </h2>
        </div>
      </div>

      {/* Content */}
      <article className={`max-w-2xl mx-auto px-6 py-8 ${fontClass}`}>
        <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
          {article.title}
        </h1>
        
        {article.content ? (
          <div 
            className="prose dark:prose-invert prose-lg prose-indigo max-w-none"
            style={{ fontSize: `${fontSize}px` }}
          >
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <p>Content not downloaded.</p>
            <p className="text-sm">Sync feed to read offline.</p>
          </div>
        )}
      </article>
      
      <div className="h-32"></div> {/* Bottom padding for thumb zone */}
    </div>
  );
}