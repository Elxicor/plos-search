import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { PlosApiService } from '../../services/plos-api.service';
import { PlosArticle } from '../../models/article.interface';
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
  private searchTerms = new Subject<string>();
  private subscription?: Subscription;

  constructor(private plosApiService: PlosApiService) {
    this.initializeSearch();
  }

  onSearchChange(term: string): void {
    this.searchTerms.next(term);
  }

  private initializeSearch(): void {
    this.subscription = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.performSearch(term))
    ).subscribe({
      next: (articles) => this.handleSuccess(articles),
      error: (error) => this.handleError(error)
    });
  }

  private performSearch(term: string): Observable<PlosArticle[]> {
    if (!term.trim()) {
      this.articles = [];
      this.isLoading = false;
      return new Observable(observer => observer.complete());
    }

    this.isLoading = true;
    this.errorMessage = '';
    return this.plosApiService.searchArticles(term);
  }

  private handleSuccess(articles: PlosArticle[]): void {
    this.articles = articles;
    this.isLoading = false;
  }

private handleError(error: any): void {
  this.errorMessage = 'Error searching articles. Please try again.';
  this.isLoading = false;
  console.error('Error:', error);
}


  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
