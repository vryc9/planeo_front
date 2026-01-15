import { BalanceEvents } from './../../balance/store/balanceEvents';
import { inject, Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { TokenService } from '../../auth/service/token.service';
import { MessageEventEnum } from '../enum/messageEvent';
import { injectDispatch } from '@ngrx/signals/events';

@Injectable({
  providedIn: 'root',
})
export class SseService {
  private zone = inject(NgZone);
  private tokenService = inject(TokenService);
  readonly dispatch = injectDispatch(BalanceEvents);

  getServerSentEvent(userId: number): Observable<MessageEvent> {
    return new Observable(observer => {

      const token = this.tokenService.getToken();
      console.log(token);

      const url = `http://localhost:8080/api/sse/${userId}`;

      const eventSource = new EventSourcePolyfill(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        heartbeatTimeout: 120000,
      });

      eventSource.onmessage = (event: any) => {
        this.zone.run(() => {
          console.log("Message recu dans le front");
          observer.next(event);
        });
      };

      eventSource.addEventListener(MessageEventEnum.UPDATED_EXPENSE, (event: any) => {
        this.zone.run(() => {
          console.log(event.data);
          observer.next(event);
          this.dispatch.loadBalance()
        });
      });

      eventSource.onerror = error => {
        this.zone.run(() => {
          console.error("Erreur SSE:", error);
          observer.error(error);
        });
      };

      return () => eventSource.close();
    });
  }
}
