import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const token = localStorage.getItem('payment_access_token');
  const authorizedRequest = token ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : request;
  return next(authorizedRequest).pipe(
    catchError((error: { error?: { detail?: string }; message?: string }) => {
      const detail = error.error?.detail;
      return throwError(() => new Error(detail || error.message || 'The request could not be completed.'));
    })
  );
};