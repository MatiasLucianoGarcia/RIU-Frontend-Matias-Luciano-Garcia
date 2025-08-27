import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private loading = signal(false);

  setLoading(value: boolean) {
    this.loading.set(value);
  }

  isLoading() {
    return this.loading();
  }
}
