import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-toast-content',
  templateUrl: './toast-content.component.html',
  styleUrls: ['./toast-content.component.scss'],
})
export class ToastContentComponent implements OnInit {
  @Input() elementId!: string;
  @Input() elementGroupId: string | undefined;

  ngOnInit(): void {
    if (!this.elementId) {
      throw Error('You must set the elementId attribute');
    }
  }
}
