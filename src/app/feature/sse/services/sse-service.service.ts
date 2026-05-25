import { inject, Injectable } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { retry } from 'rxjs/operators';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { TokenService } from '../../auth/service/token.service';
import { MessageEventEnum } from '../enum/messageEvent';
import { environment } from '../../../../environments/environment';

export interface SseMessage {
  type: string;
  data: string;
  lastEventId: string;
}

@Injectable({ providedIn: 'root' })
export class SseService {
  private readonly tokenService = inject(TokenService);

  getServerSentEvent(): Observable<SseMessage> {
    return new Observable<SseMessage>(observer => {
      const token = this.tokenService.getToken();
      const url = `${environment.apiUrl}/api/sse`;

      const eventSource = new EventSourcePolyfill(url, {
        headers: { Authorization: `Bearer ${token}` },
        heartbeatTimeout: 60_000,
      });

      const onMessage = (event: { type: string; data: string; lastEventId: string }) =>
        observer.next({
          type: event.type,
          data: event.data,
          lastEventId: event.lastEventId,
        });

      const onError = (error: any) => {
        eventSource.close();
        observer.error(error);
      };

      eventSource.onmessage = onMessage as never;
      eventSource.addEventListener(MessageEventEnum.UPDATED_EXPENSE, onMessage as never);
      eventSource.onerror = onError as never;

      return () => {
        eventSource.removeEventListener(MessageEventEnum.UPDATED_EXPENSE, onMessage as never);
        eventSource.close();
      };
    });
  }
}
