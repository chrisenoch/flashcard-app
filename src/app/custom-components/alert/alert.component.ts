import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { KeyboardListenerService } from 'src/app/custom-directives/keyboard-listener/keyboard-listener.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnInit {
  constructor(private keyboardListenerService: KeyboardListenerService) {}

  ngOnInit(): void {
    this.keyboardListenerService.keyboardEvent$.subscribe((e) => {
      console.log('sub received ' + e);
      if (e === 'ESCAPE') {
        this.close.emit();
      }
    });
  }

  @Input({ required: true }) message: string = '';
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
