import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlosArticle } from '../../models/article.interface';

@Component({
  selector: 'app-article-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './article-table.component.html',
  styleUrls: ['./article-table.component.css']
})
export class ArticleTableComponent {
  @Input() articles: PlosArticle[] = [];

  trackByDoi(index: number, article: PlosArticle): string {
    return article.id;
  }
}
