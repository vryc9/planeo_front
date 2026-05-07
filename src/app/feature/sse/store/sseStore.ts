import { inject } from "@angular/core";
import { signalStore, withProps } from "@ngrx/signals";
import { SseService } from "../services/sse-service.service";
import { Events, on, withEventHandlers, withReducer } from "@ngrx/signals/events";
import { SseEvent } from "./withSseEvent";
import { switchMap, tap } from "rxjs";
import { mapResponse } from "@ngrx/operators";
import { AuthEvent } from "../../auth/store/AuthEvent";
import { AuthStore } from "../../auth/store/AuthStore";

export const SseStore = signalStore(
  withProps(() => ({
    service: inject(SseService),
    events: inject(Events),
  })),
)
