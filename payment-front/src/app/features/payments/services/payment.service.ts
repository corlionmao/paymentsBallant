import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreatePaymentCommand, FailPaymentRequest, PaymentDetailsDto, PaymentResponse, UpdatePaymentRequest } from '../models/payment.model';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly url = '/api/payments';
  constructor(private readonly http: HttpClient) {}
  getPayments() { return this.http.get<PaymentDetailsDto[]>(this.url); }
  getPaymentById(id: string) { return this.http.get<PaymentDetailsDto>(`${this.url}/${encodeURIComponent(id)}`); }
  createPayment(command: CreatePaymentCommand) { return this.http.post<PaymentResponse>(this.url, command); }
  updatePayment(id: string, request: UpdatePaymentRequest) { return this.http.put<PaymentDetailsDto>(`${this.url}/${encodeURIComponent(id)}`, request); }
  completePayment(id: string) { return this.http.post<PaymentDetailsDto>(`${this.url}/${encodeURIComponent(id)}/complete`, null); }
  failPayment(id: string, request: FailPaymentRequest) { return this.http.post<PaymentDetailsDto>(`${this.url}/${encodeURIComponent(id)}/fail`, request); }
  cancelPayment(id: string) { return this.http.delete<PaymentDetailsDto>(`${this.url}/${encodeURIComponent(id)}`); }
}