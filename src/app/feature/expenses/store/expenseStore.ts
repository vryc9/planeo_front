import { inject } from "@angular/core";
import { signalStore } from "@ngrx/signals";
import { Events, withEventHandlers } from "@ngrx/signals/events";
import { ExpenseService } from "../services/expense-service.service";
import { ExpenseEvents } from "./expenseEvents";
import { switchMap } from "rxjs";
import { mapResponse } from "@ngrx/operators";
import { withExpenseFeature } from "./withExpenseFeature";


export const ExpenseStore = signalStore(
  withExpenseFeature()
)
