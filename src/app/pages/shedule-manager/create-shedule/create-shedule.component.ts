import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, NonNullableFormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Shedule, User } from 'src/app/@types';
import { AppService } from 'src/app/service/app.service';
import { AuthService } from 'src/app/service/auth.service';
import { differenceInCalendarDays, setHours } from 'date-fns';

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
  sheduleDay: Date = new Date();
  isDisabled = true;  
  today = new Date();
  timeDefaultValue = setHours(new Date(), 0);

  disabledDate = (current: Date): boolean =>
    differenceInCalendarDays(current, this.today) < 0;

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

  services:any =[]

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
        this.services = [response.body.data];
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

  createShedule(){
    const shedule: Partial<Shedule> = {
      patient: this.patients.id,
      service: this.services[0].id,
      day: this.sheduleDay.toISOString(),
      ...(this.doctors ? { doctor: this.doctors.id } : {})
    }
    console.log(shedule)
    this.appService.post<Shedule, Partial<Shedule>>(shedule, '/examinationSchedules').subscribe(response => {
      if (!response.body) {
        return;
      }
      if (response.body.code == 201) {
        this.isDisabled = false
        this.doctors = {
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
        this.patients = {
          id: '',
          name: '',
          userId: '',
          birthday: '',
          address: '',
        }
        this.services = []
        return this.message.success(response.body.message)
      }

      if (response.body && response.body.message) {
        return this.message.error(response.body.message)
      }
      return this.message.error('Đã có lỗi xảy ra vui lòng thử lại.')

    } , error => {
      if (error.error && error.error.message) {
        return this.message.error(error.error.message);
      }
      return this.message.error('Đã có lỗi xảy ra vui lòng thử lại');

    });
  }

  onTimeChange(time: any): void {
    if (time) {
      this.isDisabled = false
    } else {
      this.isDisabled = true
    }
  }

}
