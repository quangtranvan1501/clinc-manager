import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { User } from 'src/app/@types';
import { AppService } from 'src/app/service/app.service';

@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.css']
})
export class UserRoleComponent implements OnInit{
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
  isStatus = false;
  userId: string = ''
  inputSearch: string = ''

  validateFormRegister: FormGroup<{
    id: FormControl<string>;
    userId: FormControl<string>;
    role: FormControl<string>;
  }> = this.fb.group({
    id: ['', [Validators.required]],
    userId: [{ value: '', disabled: true }, [Validators.required]],
    role: ['', [Validators.required]],
  });

  confirmStatus(data:any): void {
    if(data.status == '1'){
      this.modal.confirm({
        nzTitle: `Xác nhận vô hiệu hóa tài khoản ${data.username}?`,
        nzOkText: 'Yes',
        nzOkType: 'primary',
        nzOkDanger: true,
        nzOnOk: () => this.disableUser(data.userId),
        nzCancelText: 'No',
        nzOnCancel: () => this.handleCancel()
      });
    }
    if(data.status == '0'){
      this.modal.confirm({
        nzTitle: `Xác nhận kích hoạt tài khoản ${data.username}?`,
        nzOkText: 'Yes',
        nzOkType: 'primary',
        nzOkDanger: true,
        nzOnOk: () => this.activateUser(data.userId),
        nzCancelText: 'No',
        nzOnCancel: () => this.handleCancel()
      });
    }
  }

  handleCancel(): void {
    this.isDelete = false;
  }

  cancel(): void {
    this.isChangeInfo = false;
  }

  disableUser(id: any) {
    this.updateUser({status: '0'}, id)
  }

  activateUser(id: any) {
    this.updateUser({status: '1'}, id)
  }

  showModal(data: any) {
    this.isChangeInfo = true;
    this.userId = data.userId
    this.validateFormRegister = this.fb.group({
      id: [data.id, [Validators.required]],
      userId: [data.userId, [Validators.required]],
      role: [data.role, [Validators.required]],
    });
    console.log(this.validateFormRegister.value)
  }

  changePageIndex(pageIndex: number) {
    this.pageIndex = pageIndex
    this.getUsers()
  }

  updateUser(body: any, id:any){
    this.appService.update<User, Partial<User>>(body, `/manager/${id}`).subscribe(res => {
      if (!res.body) {
        return this.message.error('Đã có lỗi xảy ra vui lòng thử lại');
      }

      if (res.body.code == 200) {
        this.getUsers();
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
    setTimeout(() => {
      this.isChangeInfo = false;
      this.isConfirmLoading = false;
    }, 1000);
  }

  searchUser() {
    if(this.inputSearch == ''){
      this.getUsers()
      return
    }
    var body = {
      searchText: this.inputSearch,
      sortBy: ['createdAt:desc'],
      page: this.pageIndex,
      limit: this.pageSize
    }
    this.appService.query<any>(body, '/users/search').subscribe(response => {
      if(!response.body){
        return
      }
      if (response.body.code == 200) {
        this.listOfData = response.body.data.results
        this.total = response.body.data.totalResults
      }
    })
  }

  async changeUser(): Promise<void> {
    this.isConfirmLoading = true;
    const body: Partial<User> = {
      role: this.validateFormRegister.value.role,
    }
    this.updateUser(body, this.validateFormRegister.value.userId)
  }

  getUsers() {
    var body = {
      sortBy: ['createdAt:desc'],
      page: this.pageIndex,
      limit: this.pageSize
    }
    this.appService.query<any>(body, '/users').subscribe(response => {
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
    this.getUsers()
  }
}
