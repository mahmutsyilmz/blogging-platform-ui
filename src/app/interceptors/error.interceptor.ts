import { inject } from '@angular/core';
import { 
  HttpInterceptorFn, 
  HttpRequest, 
  HttpHandlerFn, 
  HttpEvent, 
  HttpErrorResponse 
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

export const errorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const snackBar = inject(MatSnackBar);
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An error occured!';

      if (error.error && error.error.exception) {
        if (typeof error.error.exception.message === 'object') {
          const messages = Object.keys(error.error.exception.message)
            .map(key => error.error.exception.message[key])
            .flat()
            .join(' ');
          errorMessage = messages;
        } else if (typeof error.error.exception.message === 'string') {
          errorMessage = error.error.exception.message;
        }
      }

      snackBar.open(errorMessage, 'close', {
        duration: 3000
      });

      return throwError(() => error);
    })
  );
};
