import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { AppService } from '../service/app.service';
import { MessagingService } from '../service/messaging.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  passwordVisible = false;
  isConfirmLoading = false;
  visible = false;
  textloading = 'Đang xử lý...';
  isLoading = false;
  deviceToken: string = '';
  user: any;

  validateForm: FormGroup<{
    userName: FormControl<string>;
    password: FormControl<string>;
    remember: FormControl<boolean>;
  }> = this.fb.group({
    userName: ['', [Validators.required]],
    password: ['', [Validators.required]],
    remember: [true],
  });

  async submitForm() {
    this.getDeviceToken();
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      const email = this.validateForm.value.userName;
      const password = this.validateForm.value.password;
      this.isLoading = true;
      let deviceToken = this.deviceToken;
      if (email && password) {
        this.appService
          .postOption<any, any>({ email, password }, '/auth/login')
          .subscribe(
            (response) => {
              if (!response.body) {
                return this.message.error('Unknown error occurred.');
              }
              if (response.body.code == 200) {
                if (response.body.data.user.role == 'admin') {
                  if (!response.body) {
                    return this.router.navigate(['/admin/login']);
                  }
                  if (response.body.data) {
                    this.user = response.body.data.user;
                    this.messagingService.requestPermission(this.user.userId);

                    sessionStorage.setItem(
                      'currentUser',
                      JSON.stringify(response.body.data.user)
                    );
                    sessionStorage.setItem(
                      'accesstoken',
                      JSON.stringify(response.body.data.tokens.access.token)
                    );
                    sessionStorage.setItem(
                      'expirestoken',
                      JSON.stringify(response.body.data.tokens.access.expires)
                    );
                    this.router.navigate(['/admin']);
                    return this.message.success(response.body.message);
                  }
                } else {
                  return this.message.error('Đăng nhập không thành công');
                }
                this.isLoading = false;
              }
              if (response.body.message) {
                this.isLoading = false;
                return this.message.error(response.body.message);
              }
              return this.message.error('Unknown error occurred.');
            },
            (error) => {
              // Handle network or other call failures
              if (error.error && error.error.message) {
                this.isLoading = false;
                return this.message.error(error.error.message);
              }
              return this.message.error('Đã có lỗi xảy ra vui lòng thử lại');
            }
          );
        // setTimeout(() => {
        this.isLoading = false;
        // }, 1000);
      }
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  getDeviceToken() {
    return (this.deviceToken = this.messagingService.getDeviceToken());
  }

  constructor(
    private fb: NonNullableFormBuilder,
    private appService: AppService,
    private authService: AuthService,
    private message: NzMessageService,
    private router: Router,
    private messagingService: MessagingService
  ) {}
  ngOnInit(): void {}
}
