export type PaymentCurrency = 'USD' | 'EUR' | 'COP';
export type PaymentStatus = 'Pending' | 'Completed' | 'Failed';

export interface CreatePaymentCommand { correlationId: string; amount: number; currency: PaymentCurrency; accountId: string; }
export interface UpdatePaymentRequest { status: string; reason: string | null; }
export interface FailPaymentRequest { reason: string; }
export interface PaymentResponse { id: string; correlationId: string; amount: number; currency: string; accountId: string; status: string; createdAt: string; updatedAt: string | null; failureReason: string | null; }
export interface PaymentDetailsDto { id: string; correlationId: string; amount: number; currency: string; accountId: string; status: string; createdAt: string; updatedAt: string | null; failureReason: string | null; }