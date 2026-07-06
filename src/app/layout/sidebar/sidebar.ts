import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterModule, RouterLink } from '@angular/router';
import { IconComponent } from "../../shared/components/icons/icon.component";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, RouterLink, IconComponent],
  templateUrl: './sidebar.html'
})
export class SidebarComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
}