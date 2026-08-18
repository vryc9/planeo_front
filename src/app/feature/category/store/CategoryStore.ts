import { ConfirmDialogService } from './../../../shared/confirm-dialog/confirm-dialog.service';
import { signalStore, withComputed, withHooks, withProps, withState } from "@ngrx/signals"
import { CategoryDTO } from "../../../types/generated/category-dto"
import { CategoryAddEvents, CategoryDeleteEvents, CategoryFetchEvents } from "./CategoryEvents"
import { Events, injectDispatch, on, withEventHandlers, withReducer } from "@ngrx/signals/events"
import { computed, inject } from "@angular/core"
import { CategoryService } from "../services/category-servives.service"
import { exhaustMap, filter, map, switchMap } from "rxjs"
import { mapResponse } from "@ngrx/operators"
import { ErrorEvents } from '../../../shared/error/store/error-events';
import { ErrorDetail } from '../../../shared/error/error';
import { ErrorStore } from '../../../shared/error/store/errorStore';

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
    confirmationDialog: inject(ConfirmDialogService)
  }))),
  withComputed(({ categories }) => ({
    categoriesCount: computed<number>(() => categories().length)
  })),
  withEventHandlers(({ service, events, confirmationDialog }) => {
    return {
      loadCategory$: events.on(CategoryFetchEvents.loadCategory, CategoryAddEvents.addCategorySuccess, CategoryDeleteEvents.deleteCategorySuccess).pipe(
        switchMap(_ => service.getAllExpense().pipe(
          mapResponse({
            next: (categories) => CategoryFetchEvents.loadCategorySuccess({ categories }),
            error: (error: unknown) => CategoryFetchEvents.loadCategoryFailure({ error })
          })
        ))
      ),
      delete: events.on(CategoryDeleteEvents.deleteCategory).pipe(
        switchMap(({ payload: { category } }) =>
          confirmationDialog.confirm({
            title: 'Supprimer la catégorie ?',
            message: `Voulez-vous vraiment supprimer "${category.name}" ? Cette action est irréversible.`,
            confirmLabel: 'Supprimer',
            variant: 'danger',
          }).pipe(
            filter((confirmed): confirmed is true => confirmed),
            map(() => category),
          ),
        ),
        exhaustMap((category) =>
          service.delete(category).pipe(
            mapResponse({
              next: () => CategoryDeleteEvents.deleteCategorySuccess(),
              error: (error: ErrorDetail) => ErrorEvents.error({ error })
            }),
          ),
        ),
      ),
      createCategory$: events.on(CategoryAddEvents.addCategory).pipe(
        switchMap(({ payload }) => service.createCategory(payload).pipe(
          mapResponse({
            next: (category) => CategoryAddEvents.addCategorySuccess({ category }),
            error: (error: unknown) => CategoryAddEvents.addCategoryFailure({ error })
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
