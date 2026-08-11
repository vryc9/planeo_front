import { Component, computed, inject, signal } from '@angular/core';
import { form } from '@angular/forms/signals';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

const MOCK_ICONS: string[] = [
  'shopping_cart', 'restaurant', 'directions_car', 'home', 'fitness_center',
  'local_hospital', 'school', 'flight', 'movie', 'sports_esports',
  'pets', 'local_grocery_store', 'local_cafe', 'fastfood', 'local_gas_station',
  'phone_iphone', 'wifi', 'electrical_services', 'water_drop', 'checkroom',
  'spa', 'child_care', 'savings', 'credit_card', 'subscriptions',
  'category', 'festival', 'beach_access', 'local_bar', 'directions_bike',
  'train', 'apartment', 'build', 'brush', 'music_note',
  'camera_alt', 'pool', 'hiking', 'medical_services', 'receipt_long',
  'work', 'laptop', 'menu_book', 'palette', 'sports_soccer',
  'cake', 'redeem', 'local_laundry_service', 'cleaning_services', 'tv',
];


interface CategoryFormModel {
  name: string,
  icon: string
}

@Component({
  selector: 'app-modale-category',
  imports: [MatDialogModule, MatIconModule],
  templateUrl: './modale-category-component.html',
  styleUrl: './modale-category-component.css',
})
export class ModaleCategoryComponent {
  readonly dialogRef = inject(MatDialogRef<ModaleCategoryComponent>);

  protected readonly name = signal('');
  protected readonly iconSearch = signal('');
  protected readonly selectedIcon = signal<string | null>(null);

  protected readonly filteredIcons = computed(() => {
    const query = this.iconSearch().toLowerCase().trim();
    if (!query) {
      return MOCK_ICONS;
    }
    return MOCK_ICONS.filter((icon) => icon.replace(/_/g, ' ').includes(query));
  });

  protected readonly categoryModelForm = signal<CategoryFormModel>({
    name: '',
    icon: ''
  })

  protected readonly categoryForm = form(this.categoryModelForm)

  selectIcon(icon: string): void {
    this.selectedIcon.set(icon);
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    // TODO: wire up category creation submission
    this.dialogRef.close();
  }
}
