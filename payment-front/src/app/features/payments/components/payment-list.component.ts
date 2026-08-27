import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, finalize } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { PaymentDetailsDto } from '../models/payment.model';
import { PaymentService } from '../services/payment.service';
import { PaymentFormComponent } from './payment-form.component';

@Component({ selector: 'app-payment-list', standalone: true, imports: [CommonModule, PaymentFormComponent], templateUrl: './payment-list.component.html', styleUrl: './payment-list.component.css', changeDetection: ChangeDetectionStrategy.OnPush })
export class PaymentListComponent implements OnInit {
  private readonly service = inject(PaymentService);
  private readonly router = inject(Router);
  readonly auth = inject(AuthService);
  readonly payments = signal<PaymentDetailsDto[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly workingId = signal<string | null>(null);
  readonly currentPage = signal(1);
  readonly pageSize = signal(5);
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.payments().length / this.pageSize())));
  readonly displayedRangeEnd = computed(() => Math.min(this.currentPage() * this.pageSize(), this.payments().length));
  readonly paginatedPayments = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.payments().slice(start, start + this.pageSize());
  });

  ngOnInit(): void { this.loadPayments(); }
  loadPayments(): void { this.isLoading.set(true); this.errorMessage.set(null); this.service.getPayments().pipe(finalize(() => this.isLoading.set(false))).subscribe({ next: (payments) => { this.payments.set(payments); this.currentPage.set(1); }, error: (error: Error) => this.errorMessage.set(error.message || 'Payments could not be loaded.') }); }
  setPage(page: number): void { this.currentPage.set(Math.min(Math.max(page, 1), this.totalPages())); }
  setPageSize(size: string): void { this.pageSize.set(Number(size)); this.currentPage.set(1); }
  complete(payment: PaymentDetailsDto): void { this.runAction(payment, () => this.service.completePayment(payment.id)); }
  cancel(payment: PaymentDetailsDto): void { this.runAction(payment, () => this.service.cancelPayment(payment.id)); }
  private runAction(payment: PaymentDetailsDto, action: () => Observable<PaymentDetailsDto>): void { if (this.workingId()) return; this.workingId.set(payment.id); action().pipe(finalize(() => this.workingId.set(null))).subscribe({ next: () => this.loadPayments(), error: (error: Error) => this.errorMessage.set(error.message || 'The payment action failed.') }); }
  logout(): void { this.auth.logout(); this.router.navigate(['/login']); }
}