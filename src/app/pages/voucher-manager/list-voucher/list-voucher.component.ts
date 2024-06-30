import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import {  } from 'src/app/@types';
import { AppService } from 'src/app/service/app.service';
import { differenceInCalendarDays, setHours } from 'date-fns';


@Component({
  selector: 'app-list-voucher',
  templateUrl: './list-voucher.component.html',
  styleUrls: ['./list-voucher.component.css']
})
export class ListVoucherComponent implements OnInit{
  constructor(
    private appService: AppService,
    private modal: NzModalService,
    private message: NzMessageService,
    private fb: NonNullableFormBuilder,

  ) { }

  listOfData: any[] = []
  pageIndex: number = 1
  pageSize: number = 5
  total: number = 0
  isDelete: boolean = false
  isConfirmLoading = false;
  isChangeInfo = false;
  inputSearch: string = '';
  code: string = '';
  isCreate = false;
  timeDefaultValue = setHours(new Date(), 0);
  validateFormRegister: FormGroup<{
    id: FormControl<string>;
    code: FormControl<string>;
    voucherId: FormControl<string>;
    type: FormControl<string>;
    discount: FormControl<string>;
    expirationDate: FormControl<string>;
    used: FormControl<string>;
    usageCount: FormControl<number>;
    maxUsage: FormControl<string>;
  }> = this.fb.group({
    id: ['', [Validators.required]],
    code: ['', [Validators.required]],
    voucherId: ['', [Validators.required]],
    type: ['', [Validators.required]],
    discount: ['', [Validators.required]],
    expirationDate: ['', [Validators.required]],
    used: ['', [Validators.required]],
    usageCount: [0, [Validators.required]],
    maxUsage: ['', [Validators.required]],
  });

  confirmDelete(data:any): void {
    this.modal.confirm({
      nzTitle: `Xác nhận xóa voucher ${data.code}?`,
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.deleteUser(data.code),
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
  cancelCreate(): void {
    this.isCreate = false;
  }

  deleteUser(id: any) {
    this.appService.deleteOption<any>(id, '/vouchers').subscribe(response => {
      if(!response.body){
        return
      }
      if (response.body.code == 200) {
        this.getVoucher()
        this.message.create('success', 'Xóa khoa thành công')
        this.isDelete = false
      }
    })
  }
  showModal(data: any) {
    this.isChangeInfo = true;
    this.validateFormRegister = this.fb.group({
      id: [data.id, [Validators.required]],
      voucherId: [{value: data.voucherId, disabled: true}, [Validators.required]],
      code: [{value: data.code, disabled: true}, [Validators.required]],
      type: [data.type, [Validators.required]], 
      discount: [data.discount, [Validators.required]],
      expirationDate: [data.expirationDate, [Validators.required]],
      used: [data.used, [Validators.required]],
      usageCount: [data.usageCount, [Validators.required]],
      maxUsage: [data.maxUsage, [Validators.required]],
    });
    this.code = data.code
    console.log(this.validateFormRegister.value)
  }

  showModelCreate() {
    this.isCreate = true;
  }

  changePageIndex(pageIndex: number) {
    this.pageIndex = pageIndex
    this.getVoucher()
  }

  searchVoucher() {
    if(this.inputSearch == ''){
      this.getVoucher()
      return
    }
    this.appService.getById<any>(this.inputSearch, '/vouchers').subscribe(response => {
      if(!response.body){
        return
      }
      if (response.body.code == 200) {
        this.listOfData = [response.body.data]
        this.total = 1
      }
    })
  }

  async changeUser(): Promise<void> {
    this.isConfirmLoading = true;
    const body = {
      type: this.validateFormRegister.value.type,
      discount: this.validateFormRegister.value.discount,
      expirationDate: this.validateFormRegister.value.expirationDate,
      maxUsage: this.validateFormRegister.value.maxUsage
    }
    this.appService.update<any, any>(body, `/vouchers/${this.code}`).subscribe(res => {
      if (!res.body) {
        return this.message.error('Đã có lỗi xảy ra vui lòng thử lại');
      }

      if (res.body.code == 200) {
        this.getVoucher();
        
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
    setTimeout(() => {
      this.validateFormRegister.reset();
      this.isChangeInfo = false;
      this.isConfirmLoading = false;
    }, 1000);
  }

  createVoucher() {
    const body = {
      code: this.validateFormRegister.value.code,
      type: this.validateFormRegister.value.type,
      discount: this.validateFormRegister.value.discount,
      expirationDate: this.validateFormRegister.value.expirationDate,
      // used: this.validateFormRegister.value.used,
      maxUsage: this.validateFormRegister.value.maxUsage,
      // maxUsage: this.validateFormRegister.value.maxUsage

    }
    this.appService.post<any, any>(body, '/vouchers').subscribe(res => {
      if(!res.body){
        return
      }
      if (res.body.code == 201) {
        this.getVoucher()
        this.isCreate = false
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
    this.validateFormRegister.reset();
  }

  getVoucher() {
    var body = {
      sortBy: ['createdAt:desc'],
      page: this.pageIndex,
      limit: this.pageSize
    }
    this.appService.query<any>(body, '/vouchers').subscribe(response => {
      if(!response.body){
        return
      }
      if (response.body.code == 200) {
        this.listOfData = response.body.data.results
        this.total = response.body.data.totalResults
      }
    })
  }

  ngOnInit(): void {
    this.getVoucher()
  }
}
