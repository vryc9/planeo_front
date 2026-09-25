import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { InvitationCreatedDTO, InvitationPreviewDTO, RegisterFromInvitationDTO } from '../../../types/generated';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private readonly baseUrl = environment.apiUrl + '/admin';
  private readonly http = inject(HttpClient);

  validateInvitation(token: string): Observable<InvitationPreviewDTO> {
    return this.http.get<InvitationPreviewDTO>(`${this.baseUrl}/invitations/validate/${token}`);
  }

  register(payload: RegisterFromInvitationDTO): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/register`, payload);
  }

  createInvitation(role: string): Observable<InvitationCreatedDTO> {
    return this.http.post<InvitationCreatedDTO>(`${this.baseUrl}/invitations`, { role });
  }
}
