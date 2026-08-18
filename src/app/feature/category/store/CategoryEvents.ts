import { type } from "@ngrx/signals";
import { eventGroup } from "@ngrx/signals/events";
import { CategoryDTO } from "../../../types/generated/category-dto";
import { CSP_NONCE } from "@angular/core";
import { emptyProps } from "@ngrx/store";

export const CategoryFetchEvents = eventGroup({
  source: '[Category] Fetching...',
  events: {
    loadCategory: type<void>(),
    loadCategorySuccess: type<{ categories: CategoryDTO[] }>(),
    loadCategoryFailure: type<{ error: unknown }>()
  }
})


export const CategoryAddEvents = eventGroup({
  source: '[Category] Adding category',
  events: {
    addCategory: type<{ name: string, icon: string }>(),
    addCategorySuccess: type<{ category: CategoryDTO }>(),
    addCategoryFailure: type<{ error: unknown }>()
  }
})


export const CategoryDeleteEvents = eventGroup({
  source: '[Category] Adding category',
  events: {
    deleteCategory: type<{ category: CategoryDTO }>(),
    deleteCategorySuccess: type<void>(),
  }
})

