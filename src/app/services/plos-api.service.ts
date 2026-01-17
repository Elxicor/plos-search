import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PlosApiResponse, PlosArticle, PlosArticleRaw, PaginatedResult } from '../models/article.interface';

@Injectable({
  providedIn: 'root'
})
export class PlosApiService {
  private readonly baseUrl = 'https://api.plos.org/search';
  private readonly resultsPerPage = 10;

  constructor(private http: HttpClient) {}

  searchArticles(query: string, page: number = 1): Observable<PaginatedResult> {
    const params = this.buildQueryParams(query, page);
    
    return this.http.get<PlosApiResponse>(this.baseUrl, { params })
      .pipe(
        map(response => this.transformResponse(response, page))
      );
  }

  private buildQueryParams(query: string, page: number): HttpParams {
    const start = (page - 1) * this.resultsPerPage;
    
    return new HttpParams()
      .set('q', `title:${query}`)
      .set('fl', 'id,title_display,journal,publication_date')
      .set('rows', this.resultsPerPage.toString())
      .set('start', start.toString())
      .set('wt', 'json');
  }

  private transformResponse(response: PlosApiResponse, page: number): PaginatedResult {
    const totalResults = response.response.numFound;
    const totalPages = Math.ceil(totalResults / this.resultsPerPage);
    
    return {
      articles: response.response.docs.map(doc => this.mapArticle(doc)),
      totalResults,
      currentPage: page,
      totalPages
    };
  }

  private mapArticle(raw: PlosArticleRaw): PlosArticle {
    return {
      id: raw.id,
      title_display: this.extractTitle(raw.title_display),
      journal: raw.journal || 'No journal',
      publication_date: this.formatDate(raw.publication_date)
    };
  }

  private extractTitle(title?: string[] | string): string {
    if (!title) return 'No title';
    
    if (Array.isArray(title)) {
      return title[0] || 'No title';
    }
    
    return title;
  }

  private formatDate(date?: string): string {
    if (!date) return 'No date';
    
    const parsedDate = new Date(date);
    return parsedDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
