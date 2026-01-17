import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { PlosApiService } from '../../services/plos-api.service';
import { PlosArticle, PaginatedResult } from '../../models/article.interface';
import { ArticleTableComponent } from '../article-table/article-table.component';

@Component({
  selector: 'app-article-search',
  standalone: true,
  imports: [CommonModule, ArticleTableComponent],
  templateUrl: './article-search.component.html',
  styleUrls: ['./article-search.component.css']
})
export class ArticleSearchComponent implements OnDestroy {
  articles: PlosArticle[] = [];
  isLoading = false;
  errorMessage = '';
  currentPage = 1;
  totalPages = 0;
  totalResults = 0;
  currentQuery = '';
  
  private searchTerms = new Subject<string>();
  private subscription?: Subscription;

  constructor(private plosApiService: PlosApiService) {
    this.initializeSearch();
  }

  onSearchChange(term: string): void {
    this.currentPage = 1;
    this.currentQuery = term;
    this.searchTerms.next(term);
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    
    this.currentPage = page;
    this.performDirectSearch(this.currentQuery, page);
  }

  private initializeSearch(): void {
    this.subscription = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.performSearch(term, 1))
    ).subscribe({
      next: (result) => this.handleSuccess(result),
      error: (error) => this.handleError(error)
    });
  }

  private performSearch(term: string, page: number): Observable<PaginatedResult> {
    if (!term.trim()) {
      this.resetResults();
      return new Observable(observer => observer.complete());
    }

    this.isLoading = true;
    this.errorMessage = '';
    return this.plosApiService.searchArticles(term, page);
  }

  private performDirectSearch(term: string, page: number): void {
    if (!term.trim()) {
      this.resetResults();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    this.plosApiService.searchArticles(term, page).subscribe({
      next: (result) => this.handleSuccess(result),
      error: (error) => this.handleError(error)
    });
  }

  private handleSuccess(result: PaginatedResult): void {
    this.articles = result.articles;
    this.totalResults = result.totalResults;
    this.totalPages = result.totalPages;
    this.currentPage = result.currentPage;
    this.isLoading = false;
  }

  private handleError(error: any): void {
    this.errorMessage = 'Error searching articles. Please try again.';
    this.isLoading = false;
    console.error('Error:', error);
  }

  private resetResults(): void {
    this.articles = [];
    this.totalResults = 0;
    this.totalPages = 0;
    this.currentPage = 1;
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
