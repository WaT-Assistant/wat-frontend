import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';
import { IconComponent } from '../icons/icon.component';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: `./toast.component.html`,
  styles: []
})
export class ToastComponent {
  private toastService = inject(ToastService);
  toast$ = this.toastService.toast;

  onAction() {
    this.toastService.execute();
  }
}
