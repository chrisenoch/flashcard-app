import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-toast-content',
  templateUrl: './toast-content.component.html',
  styleUrls: ['./toast-content.component.scss'],
})
export class ToastContentComponent {
  @Input() toastId!: string;
}
