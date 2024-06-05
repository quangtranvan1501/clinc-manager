import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Specialist } from 'src/app/@types';
import { AppService } from 'src/app/service/app.service';

@Component({
  selector: 'app-list-specialist',
  templateUrl: './list-specialist.component.html',
  styleUrls: ['./list-specialist.component.css']
})
export class ListSpecialistComponent implements OnInit{
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
  specialistId: string = '';
  isCreate = false;

  validateFormRegister: FormGroup<{
    id: FormControl<string>;
    name: FormControl<string>;
    specialistId: FormControl<string>;
  }> = this.fb.group({
    id: ['', [Validators.required]],
    name: ['', [Validators.required]],
    specialistId: ['', [Validators.required]],
  });

  confirmDelete(data:any): void {
    this.modal.confirm({
      nzTitle: `Xác nhận xóa ${data.name}?`,
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.deleteUser(data.specialistId),
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
    this.appService.deleteOption<any>(id, '/specialist').subscribe(response => {
      if(!response.body){
        return
      }
      if (response.body.code == 200) {
        this.getSpecialist()
        this.message.create('success', 'Xóa khoa thành công')
        this.isDelete = false
      }
    })
  }
  showModal(data: any) {
    this.isChangeInfo = true;
    this.validateFormRegister = this.fb.group({
      id: [data.id, [Validators.required]],
      name: [data.name, [Validators.required]],
      specialistId: [{value: data.specialistId, disabled: true}, [Validators.required]],
    });
    this.specialistId = data.specialistId
    console.log(this.validateFormRegister.value)
  }

  showModelCreate() {
    this.isCreate = true;
  }

  changePageIndex(pageIndex: number) {
    this.pageIndex = pageIndex
    this.getSpecialist()
  }

  searchSpecialist() {
    if(this.inputSearch == ''){
      this.getSpecialist()
      return
    }
    this.appService.getById<any>(this.inputSearch, '/specialist').subscribe(response => {
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
    const body: Partial<Specialist> = {
      name: this.validateFormRegister.value.name,
    }
    this.appService.update<Specialist, Partial<Specialist>>(body, `/specialist/${this.specialistId}`).subscribe(res => {
      if (!res.body) {
        return this.message.error('Đã có lỗi xảy ra vui lòng thử lại');
      }

      if (res.body.code == 200) {
        this.getSpecialist();
        
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

  createSpecialist() {
    const body: Partial<Specialist> = {
      name: this.validateFormRegister.value.name,
    }
    this.appService.post<Specialist, Partial<Specialist>>(body, '/specialist').subscribe(res => {
      if(!res.body){
        return
      }
      if (res.body.code == 201) {
        this.getSpecialist()
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

  getSpecialist() {
    var body = {
      sortBy: ['createdAt:desc'],
      page: this.pageIndex,
      limit: this.pageSize
    }
    this.appService.query<any>(body, '/specialist').subscribe(response => {
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
    this.getSpecialist()
  }
}
