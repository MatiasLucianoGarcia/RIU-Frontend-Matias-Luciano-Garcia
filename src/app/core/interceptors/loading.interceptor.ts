import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private loadingService: LoadingService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Solo activa loading para peticiones GET de héroes
    if (req.url.includes('/heroes') && req.method === 'GET') {
      this.loadingService.setLoading(true);
      return next.handle(req).pipe(
        finalize(() => this.loadingService.setLoading(false))
      );
    }
    return next.handle(req);
  }
}
