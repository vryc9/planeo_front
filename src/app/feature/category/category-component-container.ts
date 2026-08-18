import { Component, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CategoryStore } from './store/CategoryStore';
import { ModaleCategoryComponent } from './components/modale-category-component/modale-category-component';
import { CategoryDTO } from '../../types/generated/category-dto';
import { injectDispatch } from '@ngrx/signals/events';
import { CategoryDeleteEvents } from './store/CategoryEvents';

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
  private readonly dispatch = injectDispatch(CategoryDeleteEvents)

  openCreateCategoryModal(): void {
    this.dialog.open(ModaleCategoryComponent, { width: '480px' });
  }

  protected delete(category : CategoryDTO) : void {
    this.dispatch.deleteCategory({category});
  }
}
