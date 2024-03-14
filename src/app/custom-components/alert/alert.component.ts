import { DOCUMENT } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { KeyboardListenerService } from 'src/app/custom-directives/keyboard-listener/keyboard-listener.service';
import { LocalStorageId } from 'src/app/models/types/localStorageId';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnInit, OnDestroy {
  @Input({ required: true }) id: LocalStorageId | undefined = undefined;
  @Input({ required: true }) message: string = '';
  @Output() close = new EventEmitter<void>();
  private documentInjected!: Document;
  private removeOverflowHidden = false;
  constructor(
    private keyboardListenerService: KeyboardListenerService,
    @Inject(DOCUMENT) document: Document
  ) {
    this.documentInjected = document;
  }

  ngOnInit(): void {
    this.keyboardListenerService.keyboardEvent$.subscribe((e) => {
      console.log('sub received ' + e);
      if (e === 'Escape') {
        this.onClose();
      }
    });

    if (!document.body.classList.contains('overflow-hidden')) {
      this.removeOverflowHidden = true;
      this.documentInjected.body.classList.add('overflow-hidden');
    }
  }

  onClose() {
    this.close.emit();
    this.removeOverflowHiddenIfNeeded();
  }

  ngOnDestroy(): void {
    this.removeOverflowHiddenIfNeeded();
  }

  private removeOverflowHiddenIfNeeded() {
    if (this.removeOverflowHidden) {
      this.documentInjected.body.classList.remove('overflow-hidden');
    }
  }
}
