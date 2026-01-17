import { Component } from '@angular/core';
import { ArticleSearchComponent } from './components/article-search/article-search.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ArticleSearchComponent],
  template: '<app-article-search></app-article-search>',
  styles: []
})
export class AppComponent {}
