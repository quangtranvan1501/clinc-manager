import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { NzI18nService, vi_VN } from 'ng-zorro-antd/i18n';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AppService } from 'src/app/service/app.service';

@Component({
  selector: 'app-list-shedule',
  templateUrl: './list-shedule.component.html',
  styleUrls: ['./list-shedule.component.css']
})
export class ListSheduleComponent implements OnInit {
  constructor(
    private appService: AppService,
    private modal: NzModalService,
    private message: NzMessageService,
    private fb: NonNullableFormBuilder,
    private i18n: NzI18nService
  ) { }

  listOfData: any[] = []
  pageIndex: number = 1
  pageSize: number = 10
  total: number = 0
  isDelete: boolean = false
  isConfirmLoading = false;
  isChangeInfo = false;
  isStatus = false;
  userId: string = '';
  inputSearch: string = '';
  isDisabled = true;
  idDoctor: string = '';
  examinationScheduleId: string = '';
  date = null;

  validateFormRegister: FormGroup<{
    examinationScheduleId: FormControl<string>;
    doctor: FormControl<string>;
    doctorId: FormControl<string>;
    patient: FormControl<string>;
    patientId: FormControl<string>;
    service: FormControl<string>;
    day: FormControl<string>;
  }> = this.fb.group({
    examinationScheduleId: ['', [Validators.required]],
    doctor: ['', [Validators.required]],
    doctorId: ['', [Validators.required]],
    patient: ['', [Validators.required]],
    patientId: ['', [Validators.required]],
    service: ['', [Validators.required]],
    day: ['', [Validators.required]],
  });

  onChange(result: Date): void {
    if (!result) {
      this.getShedule()
    } else{
      var body = {
        day: this.date,
        sortBy: ['createdAt:desc'],
        page: this.pageIndex,
        limit: this.pageSize
      }
      this.appService.query<any>(body, '/examinationSchedules').subscribe(response => {
        if (!response.body) {
          return
        }
        if (response.body.code == 200) {
          this.listOfData = response.body.data.results
          this.total = response.body.data.totalResults
        }
      })
    }
  }

  confirmDelete(data: any): void {
    this.modal.confirm({
      nzTitle: `Xác nhận xóa lịch khám ${data.examinationScheduleId}?`,
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.deleteUser(data.examinationScheduleId),
      nzCancelText: 'No',
      nzOnCancel: () => this.handleCancel()
    });
  }

  handleCancel(): void {
    this.isDelete = false;
  }

  cancel(): void {
    this.isChangeInfo = false;
  }

  deleteUser(id: any) {
    this.appService.deleteOption<any>(id, '/examinationSchedules').subscribe(response => {
      if (!response.body) {
        return
      }
      if (response.body.code == 200) {
        this.getShedule()
        this.message.create('success', 'Xóa dịch vụ thành công')
        this.isDelete = false
      }
    })
  }
  showModal(data: any) {
    this.isChangeInfo = true;
    this.userId = data.userId
    this.examinationScheduleId = data.examinationScheduleId
    this.validateFormRegister = this.fb.group({
      examinationScheduleId: [{ value: data.examinationScheduleId, disabled: true }, [Validators.required]],
      doctor: [{ value: data.doctor.name, disabled: true }, [Validators.required]],
      doctorId: [data.doctor.userId, [Validators.required]],
      patient: [{ value: data.patient.name, disabled: true }, [Validators.required]],
      patientId: [data.patient.userId, [Validators.required]],
      service: [{ value: data.service.name, disabled: true }, [Validators.required]],
      day: [data.day, [Validators.required]],

    });
    console.log(this.validateFormRegister.value)
  }

  changePageIndex(pageIndex: number) {
    this.pageIndex = pageIndex
    if(this.date){
      this.onChange(this.date)
    }else{
      this.getShedule()
    }
  }

  searchShedule() {
    if (this.inputSearch == '') {
      this.getShedule()
      return
    }
    this.appService.getById<any>(this.inputSearch, '/examinationSchedules').subscribe(response => {
      if (!response.body) {
        return
      }
      if (response.body.code == 200) {
        this.listOfData = [response.body.data]
        this.total = 1
      }
    })
  }

  // onTimeChange(time: any): void {
  //   if (time && this.isDoctorTime) {
  //     this.isDisabled = false
  //   } else {
  //     this.isDisabled = true
  //     this.isDoctorTime = false
  //   }
  // }

  updateShedule(id: any) {
    const body: Partial<any> = {
      day: this.validateFormRegister.value.day,
      doctor: id,
    }
    this.appService.update<any, Partial<any>>(body, `/examinationSchedules/${this.examinationScheduleId}`).subscribe(res => {
      if (!res.body) {
        return this.message.error('Đã có lỗi xảy ra vui lòng thử lại');
      }

      if (res.body.code == 200) {
        this.getShedule();
        this.userId = ''
        return this.message.success(res.body.message)
      }

      if (res.body && res.body.message) {
        this.userId = ''
        return this.message.error(res.body.message)
      }

      return this.message.error('Đã có lỗi xảy ra vui lòng thử lại.')

    }, error => {
      if (error.error && error.error.message) {
        return this.message.error(error.error.message);
      }
      return this.message.error('Đã có lỗi xảy ra vui lòng thử lại');

    });
  }


  async changeUser(): Promise<void> {
    let id
    this.appService.getById<any>(this.validateFormRegister.value.doctorId ?? '', '/users').subscribe(response => {
      if (!response.body) {
        return
      }
      if (response.body.code == 200) {
        id = response.body.data.id
        this.updateShedule(id)
      }
    })


    setTimeout(() => {
      this.isChangeInfo = false;
      this.isConfirmLoading = false;
    }, 1000);
  }

  getShedule() {
    var body = {
      sortBy: ['createdAt:desc'],
      page: this.pageIndex,
      limit: this.pageSize
    }
    this.appService.query<any>(body, '/examinationSchedules').subscribe(response => {
      if (!response.body) {
        return
      }
      if (response.body.code == 200) {
        this.listOfData = response.body.data.results
        this.total = response.body.data.totalResults
      }
    })
  }

  ngOnInit(): void {
    this.i18n.setLocale(vi_VN);
    this.getShedule()
  }
}
