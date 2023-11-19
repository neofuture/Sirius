import {Component, EventEmitter, Input, Output, ViewChild} from "@angular/core";
import {HttpClient, HttpClientModule, HttpEventType} from "@angular/common/http";
import {NgIf} from "@angular/common";
import {ToastService} from "../../services/toast.service";

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.css'],
  standalone: true,
  imports: [
    HttpClientModule,
    NgIf
  ]
})

export class FileManagerComponent {
  selectedFile: File | null = null;
  @Input() previewImageUrl: string | ArrayBuffer | null | undefined = null;
  uploadProgress = -1;
  @ViewChild('fileInput') avatarInput: any;
  @Output() filename = new EventEmitter<any>();
  private file: unknown;

  constructor(
    private http: HttpClient,
    private toastService: ToastService
  ) {
  }

  onFileSelected(event: any): void {
    this.uploadProgress = -1;
    this.selectedFile = event.target.files[0] as File;
  }

  async convertBase64(file: any) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  }

  isDragOver = false;

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: MouseEvent) {
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      this.handleDroppedFile(file);
    }
  }

  async handleDroppedFile(file: File) {
    this.selectedFile = file;
    await this.sendFile(file);
  }

  async uploadFile(event: any) {
    this.onFileSelected(event);
    this.selectedFile = event.target.files[0];
    await this.sendFile(this.selectedFile);
  }

  async sendFile(file: any) {
    file = await this.convertBase64(file);
    this.avatarInput.nativeElement.blur();
    this.avatarInput.nativeElement.value = '';
    if(this.previewImageUrl) {
      this.removeImage(new Event('click'), true);
    }
    let requestBody = {
      file: file,
      name: this.selectedFile?.name,
    }
    this.uploadProgress = 0;
    this.http.post('https://sirius.carlfearby.co.uk/api/v1/listing/image', requestBody, {
      reportProgress: true,
      observe: 'events'
    }).subscribe((event: any) => {
      if (event.type === HttpEventType.UploadProgress) {
        this.uploadProgress = Math.round((event.loaded / event.total) * 100);
      } else if (event.type === HttpEventType.Response) {
        this.previewImageUrl = event.body.path;
        this.filename.emit(this.previewImageUrl);
        const toastConfig = {
          title: 'Success',
          body: ['Image uploaded successfully'],
          autoClose: 5000,
          type: 'success'
        };
        this.toastService.newToast(toastConfig);
        setTimeout(() => {
          this.uploadProgress = -1;
        }, 1000);
      }
    });
  }

  removeImage(event: Event, slient = false) {
    event.stopPropagation();
    this.http.delete('https://sirius.carlfearby.co.uk/api/v1/listing/image?path=' + this.previewImageUrl, {
      reportProgress: true,
      observe: 'events'
    }).subscribe((event: any) => {
      if (event.type === HttpEventType.Response && !slient) {
        this.previewImageUrl = null;
        const toastConfig = {
          title: 'Success',
          body: ['File removed successfully'],
          autoClose: 5000,
          type: 'success'
        };
        this.toastService.newToast(toastConfig);
      }
      this.filename.emit(null);
    });
  }
}
