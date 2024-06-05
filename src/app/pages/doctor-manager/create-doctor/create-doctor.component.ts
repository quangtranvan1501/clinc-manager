import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, NonNullableFormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Specialist } from 'src/app/@types';
import { AppService } from 'src/app/service/app.service';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-create-doctor',
  templateUrl: './create-doctor.component.html',
  styleUrls: ['./create-doctor.component.css']
})
export class CreateDoctorComponent implements OnInit {
  constructor(
    private appService: AppService,
    private fb: NonNullableFormBuilder,
    private message: NzMessageService,
    private authService: AuthService
  ) { }

  specialistList: Specialist[] = [
    {
      specialistId: '1',
      name: 'Tất cả',
      id: '1',
    }
  ];

  confirmationValidator: ValidatorFn = (control: AbstractControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateFormRegister.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };
  validateFormRegister: FormGroup<{
    username: FormControl<string>;
    phoneNumber: FormControl<string>;
    email: FormControl<string>;
    password: FormControl<string>;
    confirm: FormControl<string>;
    gender: FormControl<string>;
    birthday: FormControl<string>;
    address: FormControl<string>;
    name: FormControl<string>;
    specialist: FormControl<string>;
    positon: FormControl<string>;
  }> = this.fb.group({
    username: ['', [Validators.required]],
    phoneNumber: ['', [Validators.required]],
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required]],
    confirm: ['', [Validators.required, this.confirmationValidator]],
    gender: ['', [Validators.required]],
    birthday: ['', [Validators.required]],
    address: ['', [Validators.required]],
    name: ['', [Validators.required]],
    specialist: ['', [Validators.required]],
    positon: ['', [Validators.required]],
  });

  validateConfirmPassword(): void {
    setTimeout(() => this.validateFormRegister.controls.confirm.updateValueAndValidity());
  }

  register() {
    if (this.validateFormRegister.valid) {
      const formData: { [key: string]: any } = Object.keys(this.validateFormRegister.controls)
        .filter(key => key !== 'confirm')
        .reduce((acc: any, key) => {
          acc[key] = (this.validateFormRegister.controls as { [key: string]: any })[key].value;
          return acc;
        }, {});

      formData['role'] = 'doctor';

      console.log(formData);

      this.appService.post<any, any>(formData, '/users/createDoctor').subscribe(response => {
        if (!response.body) {
          return this.message.error('Unknown error occurred.');
        }
        if (response.body.code == 201) {
          return this.message.success(response.body.message)
        }
        if (response.body && response.body.message) {
          return this.message.error(response.body.message);
        }
        return this.message.error('Unknown error occurred.');
      })
    } else {
      Object.values(this.validateFormRegister.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  getSpectialist() {
    this.appService.find<any>('/specialist').subscribe(response => {
      if (!response.body) {
        return;
      }
      if (response.body.code == 200) {
        this.specialistList.push(...response.body.data.results);
      }
    });
  }

  ngOnInit(): void {
    this.getSpectialist();
  }

}
