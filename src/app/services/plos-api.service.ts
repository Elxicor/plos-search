import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PlosApiResponse, PlosArticle, PlosArticleRaw } from '../models/article.interface';

@Injectable({
  providedIn: 'root'
})
export class PlosApiService {
  private readonly baseUrl = 'https://api.plos.org/search';

  constructor(private http: HttpClient) {}

  searchArticles(query: string): Observable<PlosArticle[]> {
    const params = this.buildQueryParams(query);
    
    return this.http.get<PlosApiResponse>(this.baseUrl, { params })
      .pipe(
        map(response => this.transformArticles(response))
      );
  }

  private buildQueryParams(query: string): HttpParams {
    return new HttpParams()
      .set('q', `title:${query}`)
      .set('fl', 'id,title_display,journal,publication_date')
      .set('rows', '10')
      .set('wt', 'json');
  }

  private transformArticles(response: PlosApiResponse): PlosArticle[] {
    return response.response.docs.map(doc => this.mapArticle(doc));
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
    
    // Si es un array, toma el primer elemento
    if (Array.isArray(title)) {
      return title[0] || 'No title';
    }
    
    // Si es string, devuélvelo directamente
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
