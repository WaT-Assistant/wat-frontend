import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export interface Toast {
  id: string;
  message: string;
  subMessage: string;
  actionLabel: string;
  action: () => void;
  isVisible: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService implements OnDestroy {
  private toast$ = new BehaviorSubject<Toast | null>(null);
  private destroy$ = new Subject<void>();
  private toastTimeout: any;

  toast = this.toast$.asObservable();

  showUndo(
    message: string,
    subMessage: string,
    action: () => void,
    duration: number = 5000
  ) {
    this.clearTimeout();

    const toast: Toast = {
      id: `toast-${Date.now()}`,
      message,
      subMessage,
      actionLabel: 'Undo',
      action,
      isVisible: true
    };

    this.toast$.next(toast);

    this.toastTimeout = setTimeout(() => {
      this.hide();
    }, duration);
  }

  hide() {
    const current = this.toast$.value;
    if (current) {
      current.isVisible = false;
      this.toast$.next(current);
    }
  }

  execute() {
    const current = this.toast$.value;
    if (current) {
      this.hide();
      this.clearTimeout();
      current.action();
    }
  }

  private clearTimeout() {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
      this.toastTimeout = null;
    }
  }

  ngOnDestroy() {
    this.clearTimeout();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
