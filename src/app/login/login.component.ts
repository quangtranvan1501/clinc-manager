import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  passwordVisible = false;
  isConfirmLoading = false;
  visible = false;
  textloading = 'Đang xử lý...';
  isLoading = false;

  validateForm: FormGroup<{
    userName: FormControl<string>;
    password: FormControl<string>;
    remember: FormControl<boolean>;
  }> = this.fb.group({
    userName: ['', [Validators.required]],
    password: ['', [Validators.required]],
    remember: [true]
  });

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      const userName = this.validateForm.value.userName;
      const password = this.validateForm.value.password;
      if (userName && password) {
        this.isLoading = true;
        this.authService.login(userName, password).subscribe(response => {
          if (!response.body) {
            this.isLoading = false;
            return this.message.error('Unknown error occurred.');
          }
          if (response.body.code == 200) {
            this.isLoading = false;
            if(response.body.data.user.role == 'admin'){
              this.router.navigate(['/admin']);
              return this.message.success(response.body.message)
            } else{
              return this.message.error('Đăng nhập không thành công')
            
            }
          }
          if (response.body.message) {
            this.isLoading = false;
            return this.message.error(response.body.message)
          }
          return this.message.error('Unknown error occurred.')
        },
          error => {
            // Handle network or other call failures
            if (error.error && error.error.message) {
              this.isLoading = false;
              return this.message.error(error.error.message);
            }
            return this.message.error('Đã có lỗi xảy ra vui lòng thử lại');
          }
        );
        this.isLoading = false;
      }
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  constructor(
    private fb: NonNullableFormBuilder,
    private authService: AuthService,
    private message: NzMessageService,
    private router: Router,
  ) { }
}
