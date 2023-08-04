import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-toast-content',
  templateUrl: './toast-content.component.html',
  styleUrls: ['./toast-content.component.scss'],
})
export class ToastContentComponent implements OnInit {
  @Input() toastId!: string;
  @Input() toastGroupId: string | undefined;

  ngOnInit(): void {
    if (!this.toastId) {
      throw Error('You must set the toastId attribute');
    }
  }
}
