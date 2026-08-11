import { signalStore, withComputed, withHooks, withProps, withState } from "@ngrx/signals"
import { CategoryDTO } from "../../../types/generated/category-dto"
import { CategoryFetchEvents } from "./CategoryEvents"
import { Events, injectDispatch, on, withEventHandlers, withReducer } from "@ngrx/signals/events"
import { computed, inject } from "@angular/core"
import { CategoryService } from "../services/category-servives.service"
import { switchMap } from "rxjs"
import { mapResponse } from "@ngrx/operators"

type CategoryState = {
  categories: CategoryDTO[]
}

const INITIAL_STATE: CategoryState = {
  categories: []
}

export const CategoryStore = signalStore(
  withState<CategoryState>(INITIAL_STATE),
  withProps((() => ({
    service: inject(CategoryService),
    events: inject(Events),
  }))),
  withComputed(({ categories }) => ({
    categoriesCount: computed<number>(() => categories().length)
  })),
  withEventHandlers(({ service, events }) => {
    return {
      loadCategory$: events.on(CategoryFetchEvents.loadCategory).pipe(
        switchMap(_ => service.getAllExpense().pipe(
          mapResponse({
            next: (categories) => CategoryFetchEvents.loadCategorySuccess({ categories }),
            error: (error: unknown) => CategoryFetchEvents.loadCategoryFailure({ error })
          })
        ))
      )
    }
  }),
  withReducer(
    on(CategoryFetchEvents.loadCategorySuccess, (({ payload: { categories } }) => ({ categories })))
  ),
  withHooks({
    onInit(_) {
      const dispatch = injectDispatch(CategoryFetchEvents);
      dispatch.loadCategory();
    },
  })
)
