import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Specialist } from 'src/app/@types';
import { AppService } from 'src/app/service/app.service';

@Component({
  selector: 'app-create-service',
  templateUrl: './create-service.component.html',
  styleUrls: ['./create-service.component.css']
})
export class CreateServiceComponent implements OnInit{
  constructor(
    private appService: AppService,
    private message: NzMessageService,
    private fb: NonNullableFormBuilder,
  ) { }

  listOfData: any[] = []

  specialistList: Specialist[] = [
    {
      specialistId: '1',
      name: 'Tất cả',
      id: '1',
    }
  ];

  validateFormRegister: FormGroup<{
    name: FormControl<string>;
    unit: FormControl<string>;
    price: FormControl<number>;
    specialist: FormControl<string>;
  }> = this.fb.group({
    name: ['', [Validators.required]],
    unit: ['', [Validators.required]],
    price: [0, [Validators.required]],
    specialist: ['', [Validators.required]],
  });

  createService() {
    if (this.validateFormRegister.valid) {
      const body = {
        name: this.validateFormRegister.value.name,
        unit: this.validateFormRegister.value.unit,
        price: this.validateFormRegister.value.price,
        specialist: this.validateFormRegister.value.specialist
      }
      this.appService.post<any, any>(body, '/services').subscribe(response => {
        if (!response.body) {
          return this.message.error('Đã có lỗi xảy ra, vui lòng thử lại.');
        }
        if (response.body.code == 201) {
          return this.message.success(response.body.message)
        }
        if (response.body && response.body.message) {
          return this.message.error(response.body.message);
        }
        return this.message.error('Đã có lỗi xảy ra, vui lòng thử lại.');
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

  ngOnInit() {
    this.appService.find<any>('/specialist').subscribe(response => {
      if (!response.body) {
        return;
      }
      if (response.body.code == 200) {
        this.specialistList.push(...response.body.data.results);
      }
    });
  }
}
