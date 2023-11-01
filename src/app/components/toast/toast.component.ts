import {Component, HostBinding, Input, OnDestroy, OnInit} from '@angular/core';
import {ToastService} from "../../services/toast.service";
import {RouterLink} from "@angular/router";
import {NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
  imports: [
    RouterLink,
    NgClass,
    NgIf,
    NgStyle,
    NgForOf
  ],
  standalone: true
})
export class ToastComponent implements OnInit, OnDestroy {
  @Input() toastItem: any = {};
  remaining: any;
  round = Math.ceil;
  timer: any;
  pauseTimer: boolean | undefined;
  classes: any = {
    success: 'p-button-success',
    info: 'p-button-info',
    warn: 'p-button-warning',
    error: 'p-button-danger'
  };

  @HostBinding('class.toasts')
  protected readonly hbClass = true;

  constructor(
    private toastService: ToastService,
  ) {
  }

  ngOnInit(): void {

    if (this.toastItem.autoClose) {
      this.remaining = this.toastItem.autoClose;
      this.timer = setInterval(() => {
        if (!this.pauseTimer) {
          this.remaining -= 100;
        }
        if (this.remaining < 1) {
          this.toastService.closeToast(this.toastItem.uuid);
        }
      }, 100);
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  closeToast(): void {
    this.toastService.closeToast(this.toastItem.uuid);
  }
}
