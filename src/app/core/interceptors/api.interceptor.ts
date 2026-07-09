import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export const apiInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  
  // 1. Request Mutation: Prepend base API URL if the request is a relative path
  let clonedRequest = req;
  if (req.url.startsWith('/')) {
    clonedRequest = req.clone({
      url: `${environment.apiUrl}${req.url}`
    });
  }

  // 2. Pass-through to next handler with a foundational error catching block
  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      // structural marker for Section 26.5 Error Handling Logic
      // e.g., triggering global Toast notifications based on error.status
      
      console.error(`[API Interceptor] HTTP Error: ${error.status} - ${error.message}`);
      return throwError(() => error);
    })
  );
};