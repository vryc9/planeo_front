import { inject } from "@angular/core";
import { signalStore, withProps } from "@ngrx/signals";
import { SseService } from "../services/sse-service.service";
import { Events, injectDispatch, withEventHandlers } from "@ngrx/signals/events";
import { SseEvent } from "./withSseEvent";
import { retry, switchMap, tap, timer } from "rxjs";
import { mapResponse } from "@ngrx/operators";
import { appInitialized, AuthEvent } from "../../auth/store/AuthEvent";
import { ToastEvents } from "../../../shared/toast/store/toastEvents";
import { BalanceEvents } from "../../balance/store/balanceEvents";
import { MessageEventEnum } from "../enum/messageEvent";

export const SseStore = signalStore(
  withProps(() => ({
    service: inject(SseService),
    events: inject(Events),
    toast: injectDispatch(ToastEvents),
    balanceEvents: injectDispatch(BalanceEvents)
  })),
  withEventHandlers(({ events, service, toast, balanceEvents }) => {
    return {
      connectToSse$: events.on(AuthEvent.authentificationSuccess, appInitialized.appReady).pipe(
        switchMap(_ =>
          service.getServerSentEvent().pipe(
            tap((message) => {
              if (message.type === MessageEventEnum.UPDATED_EXPENSE) {
                balanceEvents.loadBalance();
              }
            }),
            retry({
              count: 10,
              delay: (error, attempt) => {
                const delay = Math.min(1000 * Math.pow(2, attempt), 30_000);
                console.warn(`SSE reconnexion tentative ${attempt}, dans ${delay}ms`, error);
                return timer(delay);
              },
            }),
            mapResponse({
              next: (_) => SseEvent.subscribeSucces(),
              error: (error) => SseEvent.subscribeFailure({ error })
            })
          )
        )
      ),
      onSseConnected$: events.on(SseEvent.subscribeSucces).pipe(
        tap(() => toast.show({
          variant: "success",
          description: "La connexion avec le SSE a été établie",
          title: "Connexion SSE"
        })),
      )
    };
  })
)
