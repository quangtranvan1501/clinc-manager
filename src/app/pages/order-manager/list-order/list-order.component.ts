import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { NzI18nService, vi_VN } from 'ng-zorro-antd/i18n';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AppService } from 'src/app/service/app.service';

@Component({
  selector: 'app-list-order',
  templateUrl: './list-order.component.html',
  styleUrls: ['./list-order.component.css']
})
export class ListOrderComponent implements OnInit {
  constructor(
    private appService: AppService,
    private modal: NzModalService,
    private message: NzMessageService,
    private fb: NonNullableFormBuilder,
    private i18n: NzI18nService
  ) { }

  listOfData: any[] = []
  pageIndex: number = 1
  pageSize: number = 5
  total: number = 0
  isDelete: boolean = false
  isConfirmLoading = false;
  isChangeInfo = false;
  isStatus = false;
  inputSearch: string = '';
  examinationScheduleId: string = '';
  date = null;
  status: any;
  orderItem: any;

  filterStatus = [
    { text: 'Đã hủy', value: '-1' },
    { text: 'Đang thanh toán', value: '0' },
    { text: 'Đã thanh toán', value: '1' },
  ];

  validateFormRegister: FormGroup<{
    orderId: FormControl<string>;
    ordeDate: FormControl<string>;
    orderService: FormControl<string>;
    patient: FormControl<string>;
    patientId: FormControl<string>;
    totalAmount: FormControl<string>;
    discount: FormControl<string>;
    status: FormControl<string>;
  }> = this.fb.group({
    orderId: ['', [Validators.required]],
    ordeDate: ['', [Validators.required]],
    orderService: ['', [Validators.required]],
    patient: ['', [Validators.required]],
    patientId: ['', [Validators.required]],
    totalAmount: ['', [Validators.required]],
    discount: ['', [Validators.required]],
    status: ['', [Validators.required]],
  });

  onChange(result: Date): void {
    if (!result) {
      this.getShedule()
    } else{
      var body = {
        orderDate: this.date,
        sortBy: ['createdAt:desc'],
        page: this.pageIndex,
        limit: this.pageSize
      }
      this.appService.query<any>(body, '/orders').subscribe(response => {
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
      nzTitle: `Xác nhận xóa hóa đơn ${data.orderId}?`,
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.deleteUser(data.orderId),
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
    this.appService.deleteOption<any>(id, '/orders').subscribe(response => {
      if (!response.body) {
        return
      }
      if (response.body.code == 200) {
        this.getShedule()
        this.message.create('success', 'Xóa hóa đơn thành công')
        this.isDelete = false
      }
    })
  }
  showModal(data: any) {
    this.isChangeInfo = true;

    this.orderItem = data
    
    this.examinationScheduleId = data.examinationScheduleId
    this.validateFormRegister = this.fb.group({
      orderId: [data.orderId, [Validators.required]],
      ordeDate: [data.orderDate, [Validators.required]],
      orderService: [data.orderService, [Validators.required]],
      patient: [data.patient.name, [Validators.required]],
      patientId: [data.patientId, [Validators.required]],
      totalAmount: [data.totalAmount, [Validators.required]],
      discount: [data.discount, [Validators.required]],
      status: [data.status, [Validators.required]],
    });
    console.log(this.validateFormRegister.value)
  }

  changePageIndex(pageIndex: number) {
    this.pageIndex = pageIndex
    if(this.isStatus){
      this.sortShedule(this.status)
    } else if(this.date){
      this.onChange(this.date)
    } else{
      this.getShedule()
    }
  }

  searchShedule() {
    if (this.inputSearch == '') {
      this.getShedule()
      return
    }
    this.appService.getById<any>(this.inputSearch, '/orders').subscribe(response => {
      if (!response.body) {
        return
      }
      if (response.body.code == 200) {
        this.listOfData = [response.body.data]
        this.total = 1
      }
    })
  }

  sortShedule(statuses: any) {
    console.log(statuses)
    if (!statuses){
      this.getShedule()
    } else{
      var body = {
        status: statuses,
        sortBy: ['createAt:desc'],
        page: this.pageIndex,
        limit: this.pageSize
      }
      this.appService.query<any>(body, '/orders').subscribe(response => {
        if (!response.body) {
          return;
        }
        if (response.body.code == 200) {
          this.listOfData = response.body.data.results;
          this.total = response.body.data.totalResults
        }
      })
    }
  }

  onQueryParamsChange(value: any[]): void {
    this.isStatus = true;
    this.status = value
    this.sortShedule(value)
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
      day: this.validateFormRegister.value,
      doctor: id,
    }
    this.appService.update<any, Partial<any>>(body, `/examinationSchedules/${this.examinationScheduleId}`).subscribe(res => {
      if (!res.body) {
        return this.message.error('Đã có lỗi xảy ra vui lòng thử lại');
      }

      if (res.body.code == 200) {
        this.getShedule();

        return this.message.success(res.body.message)
      }

      if (res.body && res.body.message) {

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
    // let id
    // this.appService.getById<any>(this.validateFormRegister.value.doctorId ?? '', '/users').subscribe(response => {
    //   if (!response.body) {
    //     return
    //   }
    //   if (response.body.code == 200) {
    //     id = response.body.data.id
    //     this.updateShedule(id)
    //   }
    // })
    // setTimeout(() => {
    //   this.isChangeInfo = false;
    //   this.isConfirmLoading = false;
    // }, 1000);
  }

  getShedule() {
    var body = {
      sortBy: ['createdAt:desc'],
      page: this.pageIndex,
      limit: this.pageSize
    }
    this.appService.query<any>(body, '/orders').subscribe(response => {
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
