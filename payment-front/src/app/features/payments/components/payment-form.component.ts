import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { PaymentService } from '../services/payment.service';
import { PaymentCurrency } from '../models/payment.model';

@Component({ selector: 'app-payment-form', standalone: true, imports: [ReactiveFormsModule], templateUrl: './payment-form.component.html', styleUrl: './payment-form.component.css', changeDetection: ChangeDetectionStrategy.OnPush })
export class PaymentFormComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly paymentService = inject(PaymentService);
  @Output() readonly created = new EventEmitter<void>();
  readonly currencies: PaymentCurrency[] = ['USD', 'EUR', 'COP'];
  readonly form = this.formBuilder.nonNullable.group({ correlationId: [{ value: '', disabled: true }], amount: [0, [Validators.required, Validators.min(0.01)]], currency: ['USD' as PaymentCurrency, Validators.required], accountId: ['', Validators.required] });
  isSubmitting = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  ngOnInit(): void { this.prepareNextPayment(); }
  submit(): void { if (this.form.invalid || this.isSubmitting) { this.form.markAllAsTouched(); return; } this.errorMessage = null; this.successMessage = null; this.isSubmitting = true; const value = this.form.getRawValue(); this.paymentService.createPayment({ correlationId: value.correlationId, amount: value.amount, currency: value.currency, accountId: value.accountId }).pipe(finalize(() => this.isSubmitting = false)).subscribe({ next: () => { this.successMessage = 'Payment created successfully.'; this.created.emit(); this.prepareNextPayment(); }, error: (error: Error) => this.errorMessage = error.message || 'Payment could not be created.' }); }
  private prepareNextPayment(): void { this.form.controls.correlationId.setValue(crypto.randomUUID()); this.form.controls.accountId.setValue(crypto.randomUUID()); this.form.controls.amount.setValue(0); this.form.controls.currency.setValue('USD'); this.form.markAsPristine(); this.form.markAsUntouched(); }
}