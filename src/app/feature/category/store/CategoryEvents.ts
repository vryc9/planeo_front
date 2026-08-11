import { type } from "@ngrx/signals";
import { eventGroup } from "@ngrx/signals/events";
import { CategoryDTO } from "../../../types/generated/category-dto";

export const CategoryFetchEvents = eventGroup({
  source: '[Category] Fetching...',
  events: {
    loadCategory: type<void>(),
    loadCategorySuccess: type<{ categories: CategoryDTO[] }>(),
    loadCategoryFailure: type<{ error: unknown }>()
  }
})
