import React from 'react';
import { Article } from '../types';
import { Download, CheckCircle, ChevronRight } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  onClick: () => void;
}

// Explicitly typing as React.FC ensures TypeScript correctly handles intrinsic attributes like 'key'
const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick }) => {
  return (
    <div 
      onClick={onClick}
      data-testid={`article-card-${article.id}`}
      className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 active:scale-[0.99] transition-transform cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
          {article.source} • {article.category}
        </span>
        {article.isDownloaded ? (
          <CheckCircle className="w-5 h-5 text-green-500" data-testid={`status-downloaded-${article.id}`} />
        ) : (
          <Download className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-indigo-500 transition-colors" data-testid={`status-cloud-${article.id}`} />
        )}
      </div>
      
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
        {article.title}
      </h3>
      
      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">
        {article.summary || "No summary available."}
      </p>

      {article.isDownloaded && (
        <div className="mt-3 flex items-center text-xs text-gray-400 dark:text-gray-500">
           <span>Read Offline</span>
           <ChevronRight className="w-3 h-3 ml-1" />
        </div>
      )}
    </div>
  );
};

export default ArticleCard;