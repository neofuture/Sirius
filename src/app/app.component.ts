import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {HttpClientModule} from "@angular/common/http";
import {ToastComponent} from "./components/toast/toast.component";
import {ToastService} from "./services/toast.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule, ToastComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Sirius';
  toastList = {};
  objectValues = Object.values;
  constructor(
    private toastService: ToastService,
  ) {
    this.toastList = this.toastService.toastList;
  }
}
