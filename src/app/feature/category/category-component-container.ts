import { Component, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CategoryStore } from './store/CategoryStore';
import { ModaleCategoryComponent } from './components/modale-category-component/modale-category-component';

@Component({
  selector: 'app-category-component-container',
  imports: [MatIconModule],
  providers: [CategoryStore],
  templateUrl: './category-component-container.html',
  styleUrl: './category-component-container.css',
})

export class CategoryComponentContainer {
  protected readonly store = inject(CategoryStore);
  private readonly dialog = inject(MatDialog);

  openCreateCategoryModal(): void {
    this.dialog.open(ModaleCategoryComponent, { width: '480px' });
  }
}
