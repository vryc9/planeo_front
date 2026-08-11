import {
  Component,
  DestroyRef,
  ElementRef,
  Signal,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { injectDispatch } from '@ngrx/signals/events';
import { debouncedSignal } from '../../../expenses/utils/debounce';
import { CategoryAddEvents } from '../../store/CategoryEvents';
import { MATERIAL_ICONS } from '../../../../shared/icons/material-icons.data';

interface CategoryFormModel {
  name: string;
}

const SEARCH_DEBOUNCE_MS = 300;
const ICON_SIZE_PX = 42;
const ICON_GAP_PX = 8;
const ROW_HEIGHT_PX = 56;

@Component({
  selector: 'app-modale-category',
  imports: [MatDialogModule, MatIconModule, FormField, ScrollingModule],
  templateUrl: './modale-category-component.html',
  styleUrl: './modale-category-component.css',
})
export class ModaleCategoryComponent {
  protected readonly dialogRef = inject(MatDialogRef<ModaleCategoryComponent>);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly iconSearch = signal('');
  protected readonly selectedIcon = signal<string | null>(null);

  private readonly dispatch = injectDispatch(CategoryAddEvents);
  private readonly debouncedQuery: Signal<string> = debouncedSignal(this.iconSearch, SEARCH_DEBOUNCE_MS, '');

  protected readonly viewportRef = viewChild.required('viewport', { read: ElementRef });
  private readonly viewportWidth = signal(0);

  protected readonly filteredIcons = computed(() => {
    const query = this.debouncedQuery().toLowerCase().trim();
    if (!query) {
      return MATERIAL_ICONS;
    }
    return MATERIAL_ICONS.filter((icon) => icon.replace(/_/g, ' ').includes(query));
  });

  // Nombre de colonnes réellement rendues, dérivé de la largeur mesurée du viewport
  protected readonly iconsPerRow: Signal<number> = computed(() => {
    const width = this.viewportWidth();
    if (width === 0) {
      return 1; // avant la première mesure ResizeObserver
    }
    return Math.max(1, Math.floor((width + ICON_GAP_PX) / (ICON_SIZE_PX + ICON_GAP_PX)));
  });

  protected readonly iconRows: Signal<readonly string[][]> = computed(() => {
    const icons = this.filteredIcons();
    const perRow = this.iconsPerRow();
    const rows: string[][] = [];
    for (let i = 0; i < icons.length; i += perRow) {
      rows.push(icons.slice(i, i + perRow));
    }
    return rows;
  });

  protected readonly categoryModelForm = signal<CategoryFormModel>({ name: '' });

  protected readonly categoryForm = form(this.categoryModelForm, ({ name }) => {
    required(name, { message: 'Le nom de la catégorie est obligatoire' });
  });

  protected readonly canDisplayError: Signal<boolean> = computed(
    () => this.categoryForm.name().touched() && this.categoryForm.name().invalid(),
  );

  constructor() {
    afterNextRender(() => {
      const element = this.viewportRef().nativeElement as HTMLElement;
      const observer = new ResizeObserver(([entry]) => {
        this.viewportWidth.set(entry.contentRect.width);
      });
      observer.observe(element);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  protected trackRow(index: number): number {
    return index;
  }

  protected selectIcon(icon: string): void {
    this.selectedIcon.set(icon);
  }

  protected onSearch(query: string): void {
    this.iconSearch.set(query);
  }

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    await submit(this.categoryForm, async (f) => {
      const icon = this.selectedIcon();
      if (!icon) {
        return undefined;
      }

      this.dispatch.addCategory({ name: f().value().name, icon });
      this.dialogRef.close();
      return undefined;
    });
  }
}
