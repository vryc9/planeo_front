import { type } from "@ngrx/signals";
import { eventGroup } from "@ngrx/signals/events";
import { CategoryDTO } from "../../../types/generated/category-dto";
import { CSP_NONCE } from "@angular/core";

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
