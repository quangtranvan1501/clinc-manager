import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, NonNullableFormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { User } from 'src/app/@types';
import { AppService } from 'src/app/service/app.service';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-create-shedule',
  templateUrl: './create-shedule.component.html',
  styleUrls: ['./create-shedule.component.css']
})
export class CreateSheduleComponent{
  constructor(
    private appService: AppService,
    private fb: NonNullableFormBuilder,
    private message: NzMessageService,
    private authService: AuthService
  ) { }

  idPatient: string = '';
  idDoctor: string = '';
  idService: string = '';

  doctors:any ={
    id: '',
    name: '',
    userId: '',
    gender: '',
    birthday: '',
    address: '',
    specialist: {
      id: '',
      name: '',
    }
  };

  patients:any ={
    id: '',
    name: '',
    userId: '',
    gender: '',
    birthday: '',
    address: '',
  };

  services:any ={
    id: '',
    name: '',
    price: '',
    unit: '',
  };

  getPatiens() {
    this.appService.getById(this.idPatient, '/users').subscribe(response => {
      if (response.body && response.body.code == 200) {
        this.patients = response.body.data;
      }
    });
  }

  getDoctors() {
    this.appService.getById(this.idDoctor, '/users').subscribe(response => {
      if (response.body && response.body.code == 200) {
        this.doctors = response.body.data;
      }
    });
  }

  getServices() {
    this.appService.getById(this.idService, '/services').subscribe(response => {
      if (response.body && response.body.code == 200) {
        this.services = response.body.data;
      }
    });
  }

  validateFormRegister: FormGroup<{
    doctor: FormControl<string>;
    doctorId: FormControl<string>;
    patient: FormControl<string>;
    patientId: FormControl<string>;
    service: FormControl<string>;
    serviceId: FormControl<string>;
    day: FormControl<string>;
  }> = this.fb.group({
    doctor: ['', [Validators.required]],
    doctorId: ['', [Validators.required]],
    patient: ['', [Validators.required]],
    patientId: ['', [Validators.required]],
    service: ['', [Validators.required]],
    serviceId: ['', [Validators.required]],
    day: ['', [Validators.required]],
  });


  register() {
    if (this.validateFormRegister.valid) {
      const formData: { [key: string]: any } = Object.keys(this.validateFormRegister.controls)
        .filter(key => key !== 'confirm')
        .reduce((acc: any, key) => {
          acc[key] = (this.validateFormRegister.controls as { [key: string]: any })[key].value;
          return acc;
        }, {});
      this.authService.register(formData).subscribe(response => {
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
}
