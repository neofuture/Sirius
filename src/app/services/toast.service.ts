import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toastList: any = {};

  constructor() {
  }

  newToast(toastConfig: { title: any; body: any; type: any; autoClose: any; link?: any}): void {
    const uuid = this.uuidV4();
    this.toastList[uuid] = {
      uuid,
      title: toastConfig.title,
      body: toastConfig.body,
      type: toastConfig.type,
      autoClose: toastConfig.autoClose,
      link: toastConfig.link || null,
    };

    setTimeout(() => {
      this.toastList[uuid].open = true;
    }, 100);
  }

  uuidV4(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      // tslint:disable-next-line:no-bitwise
      const r = Math.random() * 16 | 0;
      // tslint:disable-next-line:no-bitwise
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  closeToast(uuid: string): void {
    if (typeof this.toastList[uuid] === 'undefined') {
      return;
    }
    this.toastList[uuid].open = false;
    setTimeout(() => {
      delete this.toastList[uuid];
    }, 300);
  }

  closeAllToasts(): void {
    for (const toastItem of Object.keys(this.toastList)) {
      this.closeToast(toastItem);
    }
  }
}
