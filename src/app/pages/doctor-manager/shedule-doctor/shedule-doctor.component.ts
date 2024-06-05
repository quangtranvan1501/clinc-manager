import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { NzI18nService, vi_VN } from 'ng-zorro-antd/i18n';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { AppService } from 'src/app/service/app.service';

@Component({
  selector: 'app-shedule-doctor',
  templateUrl: './shedule-doctor.component.html',
  styleUrls: ['./shedule-doctor.component.css'],
  providers: [DatePipe]

})
export class SheduleDoctorComponent {
  sheduleDoctor: any = []
  filteredSheduleDoctor: any = []
  doctor: any
  isCreate = false;
  startTime: any;
  endTime: any;
  doctorId: any;
  pageIndex: number = 1
  pageSize: number = 3
  total: number = 0
  isChange: boolean = false;
  status: any;

  filterStatus = [
    { text: 'Từ chối', value: '-1' },
    { text: 'Đang duyệt', value: '0' },
    { text: 'Đã duyệt', value: '1' },
  ];

  sheduleForm: FormGroup<{
    doctorId: FormControl<string>;
    day: FormControl<string>;
    startTime: FormControl<Date>;
    endTime: FormControl<Date>;
  }> = this.fb.group({
    doctorId: ['', [Validators.required]],
    day: ['', [Validators.required]],
    startTime: [new Date(), [Validators.required]],
    endTime: [new Date(), [Validators.required]],
  });

  constructor(
    private appService: AppService,
    private modal: NzModalService,
    private message: NzMessageService,
    private datePipe: DatePipe,
    private fb: NonNullableFormBuilder,
    private i18n: NzI18nService
  ) { }

  isConfirmDelete = false;

  formatTime(time:Date) {
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  createSheduleDoctor() {
    this.isCreate = true;
    console.log('create')
  }

  closeEdit() {
    this.isCreate = false;
  }

  createShudele(){
    const body = {
      doctorId: this.doctor.id,
      day: this.sheduleForm.value.day? this.datePipe.transform(this.sheduleForm.value.day, 'yyyy-MM-dd') : '',
      startTime: this.sheduleForm.value.startTime? this.formatTime(this.sheduleForm.value.startTime) : '',
      endTime: this.sheduleForm.value.endTime? this.formatTime(this.sheduleForm.value.endTime) : '',
    }
    this.appService.post<any, any>(body, '/scheduleDoctors').subscribe(response => {
      if (!response.body) {
        return;
      }
      if (response.body.code == 201) {
        this.isCreate = false;
        this.sheduleForm.reset();
        this.message.success(response.body.message);
        this.getSheduleDoctor();
      } else {
        this.message.error(response.body.message);
      }
    }, error => {
      console.log(error)
    })
  }
  confirmDelete(data:any): void {
    const formattedDay = this.datePipe.transform(data.day, 'dd/MM/yyyy');
    this.modal.confirm({
      nzTitle: `Xác nhận xóa lịch làm việc ngày: ${ formattedDay } ?`,
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.delete(data.scheduleDoctorId),
      nzCancelText: 'No',
      nzOnCancel: () => this.handleCancel()
    });
  }

  rejectSheduleDoctor(data: any) {
    this.appService.update<any, any>({ status: '-1' }, `/scheduleDoctors/${data.scheduleDoctorId}`).subscribe(response => {
      if (!response.body) {
        return;
      }
      if (response.body.code == 200) {
        this.getSheduleDoctor();
        return this.message.success(response.body.message);
      }
      else{
        return this.message.error(response.body.message);
      }
    })
  }

  acceptSheduleDoctor(data: any) {
    this.appService.update<any, any>({ status: '1' }, `/scheduleDoctors/${data.scheduleDoctorId}`).subscribe(response => {
      if (!response.body) {
        return;
      }
      if (response.body.code == 200) {
        this.getSheduleDoctor();
        return this.message.success(response.body.message);
      }
      else{
        return this.message.error(response.body.message);
      }
    })
  }

  handleCancel(): void {
    this.isConfirmDelete = false;
  }

  delete(data: any) {
    this.appService.deleteOption<any>(data, '/scheduleDoctors').subscribe(response => {
      if (!response.body) {
        return;
      }
      if (response.body.code == 200) {
        this.getSheduleDoctor();
        this.isConfirmDelete = false;
        return this.message.success(response.body.message);
      }
      else{
        return this.message.error(response.body.message);
      }
    })
  };
  edit(data: any) {
    console.log('edit', data)
  }

  changePageIndex(pageIndex: number) {
    this.pageIndex = pageIndex
    if(this.isChange){
      this.sortSheduleDoctor(this.status)
    }else{
      this.getSheduleDoctor()
    }
  }

  sortSheduleDoctor(statuses: any) {
    if(!statuses){
      this.getSheduleDoctor()
    } else{
      var body = {
        doctorId: this.doctor.id,
        status: statuses,
        sortBy: ['day:desc'],
        page: this.pageIndex,
        limit: this.pageSize
      }
      this.appService.query<any>(body, '/scheduleDoctors').subscribe(response => {
        if (!response.body) {
          return;
        }
        if (response.body.code == 200) {
          this.sheduleDoctor = response.body.data.results;
          console.log(this.sheduleDoctor)
          // this.filteredSheduleDoctor = this.sheduleDoctor;
          this.total = response.body.data.totalResults
        }
      })
    }
  }

  onQueryParamsChange(value: any[]): void {
    this.isChange = true;
    this.status = value
    this.sortSheduleDoctor(value)
  }

  getDoctor() {
    this.isChange = false;
    this.sheduleDoctor = []
    this.doctor = []
    this.appService.getById<any>(this.doctorId, '/users').subscribe(response => {
      if (!response.body) {
        return;
      }
      if (response.body.code == 200) {
        this.doctor = response.body.data;
        this.getSheduleDoctor()
      }
    })
  }

  getSheduleDoctor() {
    this.isChange = false;
    var body = {
      doctorId: this.doctor.id,
      sortBy: ['day:desc'],
      page: this.pageIndex,
      limit: this.pageSize
    }
    this.appService.query<any>(body, '/scheduleDoctors/doctor').subscribe(response => {
      if (!response.body) {
        return;
      }
      if (response.body.code == 200) {
        this.sheduleDoctor = response.body.data.results;
        // this.filteredSheduleDoctor = this.sheduleDoctor;
        this.total = response.body.data.totalResults
      }
    })
  }

  ngOnInit(): void {
    this.i18n.setLocale(vi_VN);
  }
}
