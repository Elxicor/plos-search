export interface PlosArticle {
  id: string; // DOI
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
  title_display?: string[];
  journal?: string;
  publication_date?: string;
}
