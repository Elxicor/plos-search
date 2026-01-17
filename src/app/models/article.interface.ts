export interface PlosArticle {
  id: string; 
  title_display: string;
  journal: string;
  publication_date: string;
}

export interface PlosApiResponse {
  response: {
    numFound: number;
    start: number;
    docs: PlosArticleRaw[];
  };
}

export interface PlosArticleRaw {
  id: string;
  title_display?: string[] | string;
  journal?: string;
  publication_date?: string;
}

export interface PaginatedResult {
  articles: PlosArticle[];
  totalResults: number;
  currentPage: number;
  totalPages: number;
}
