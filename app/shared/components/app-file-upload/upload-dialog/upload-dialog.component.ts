import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef } from '@angular/material';
import { FileUploadService } from '@services/file-upload/file-upload.service';
import { AuthService } from '@services/auth/auth.service';
import { UserService } from '@services/user/user.service';
import { BrandNames } from '@enums/brand.enum';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'underscore';
@Component({
  selector: 'app-upload-dialog',
  templateUrl: './upload-dialog.component.html',
  styleUrls: ['./upload-dialog.component.css']
})
export class UploadDialogComponent implements OnInit {
  brands = BrandNames;
  brand: string;

  constructor(
    private http: HttpClient,
    private dialogRef: MatDialogRef<UploadDialogComponent>,
    private authService: AuthService,
    public userService: UserService,
    private fileUploadService: FileUploadService,
    private readonly translate: TranslateService
  ) {
    this.translate.setDefaultLang('en');
  }

  onCancel(): void {
    this.dialogRef.close();
  }
  fileChange(event) {
    const fileList: FileList = event.target.files;
    this.sendDatatoBackend(fileList);
  }
  sendDatatoBackend(fileList) {
    if (fileList.length > 0) {
      this.onCancel();
      const fileListFromObj = _.values(fileList);
      fileListFromObj.forEach(element => {
        const file: File = element;
        const formData: FormData = new FormData();
        formData.append('files', file, file.name);
        this.fileUploadService.uploadFile(formData, file.name);
      });
    }
  }
  onFilesChange(fileList: Array<File>) {
    this.sendDatatoBackend(fileList);
  }
  onFileInvalids(fileList: Array<File>) {}
  ngOnInit() {
    this.brand = this.userService.getBrand();
    this.translate.use(this.userService.getUserPreferredLang());
  }
  onConfirm() {
    this.http.post('api/account/logout', {}).subscribe(resp => {
      if (resp['logout'] === 'success') {
        this.authService.logout();
      }
    });
  }
}
