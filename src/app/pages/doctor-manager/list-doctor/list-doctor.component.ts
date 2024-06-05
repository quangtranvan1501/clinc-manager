import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Specialist, User } from 'src/app/@types';
import { AppService } from 'src/app/service/app.service';

@Component({
  selector: 'app-list-doctor',
  templateUrl: './list-doctor.component.html',
  styleUrls: ['./list-doctor.component.css']
})
export class ListDoctorComponent implements OnInit{

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
  userId: string = '';
  inputSearch: string = '';
  specialistList: Specialist[] = [
    {
      specialistId: '1',
      name: 'Tất cả',
      id: '1',
    }  
  ];

  validateFormRegister: FormGroup<{
    id: FormControl<string>;
    username: FormControl<string>;
    phoneNumber: FormControl<string>;
    userId: FormControl<string>;
    email: FormControl<string>;
    gender: FormControl<string>;
    birthday: FormControl<string>;
    address: FormControl<string>;
    name: FormControl<string>;
    isEmailVerified: FormControl<string>;
    specialist: FormControl<string>;
    positon: FormControl<string>;
  }> = this.fb.group({
    id: ['', [Validators.required]],
    username: ['', [Validators.required]],
    phoneNumber: ['', [Validators.required]],
    email: ['', [Validators.email, Validators.required]],
    userId: [{ value: '', disabled: true }, [Validators.required]],
    gender: ['', [Validators.required]],
    birthday: ['', [Validators.required]],
    address: ['', [Validators.required]],
    name: ['', [Validators.required]],
    isEmailVerified: ['', [Validators.required]],
    specialist: ['', [Validators.required]],
    positon: ['', [Validators.required]],
  });

  confirmDelete(data:any): void {
    this.modal.confirm({
      nzTitle: `Xác nhận xóa tài khoản ${data.username}?`,
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.deleteUser(data.userId),
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
    this.appService.deleteOption<any>(id, '/users').subscribe(response => {
      if(!response.body){
        return
      }
      if (response.body.code == 200) {
        this.getUsers()
        this.message.create('success', 'Xóa tài khoản thành công')
        this.isDelete = false
      }
    })
  }
  showModal(data: any) {
    this.isChangeInfo = true;
    this.userId = data.userId
    this.validateFormRegister = this.fb.group({
      id: [data.id, [Validators.required]],
      username: [data.username, [Validators.required]],
      phoneNumber: [data.phoneNumber, [Validators.required]],
      email: [data.email, [Validators.email, Validators.required]],
      userId: [data.userId, [Validators.required]],
      gender: [data.gender, [Validators.required]],
      birthday: [data.birthday, [Validators.required]],
      address: [data.address, [Validators.required]],
      name: [data.name, [Validators.required]],
      isEmailVerified: [data.isEmailVerified.toString(), [Validators.required]],
      specialist: [data.specialist, [Validators.required]],
      positon: [data.positon, [Validators.required]],
    });
    console.log(this.validateFormRegister.value)
  }

  changePageIndex(pageIndex: number) {
    this.pageIndex = pageIndex
    this.getUsers()
  }

  async changeUser(): Promise<void> {
    this.isConfirmLoading = true;
    let isEmailVerified = this.validateFormRegister.value.isEmailVerified == 'true' ? true : false
    const body: Partial<User> = {
      name: this.validateFormRegister.value.name,
      phoneNumber: this.validateFormRegister.value.phoneNumber,
      address: this.validateFormRegister.value.address,
      birthday: this.validateFormRegister.value.birthday,
      gender: this.validateFormRegister.value.gender,
      email: this.validateFormRegister.value.email,
      username: this.validateFormRegister.value.username,
      isEmailVerified: isEmailVerified,
      specialist: this.validateFormRegister.value.specialist,
      positon: this.validateFormRegister.value.positon,
    }
    this.appService.update<User, Partial<User>>(body, `/manager/${this.validateFormRegister.value.userId}`).subscribe(res => {
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

  getUsers() {
    var body = {
      role: 'doctor',
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
    this.appService.query<any>(body, '/users/search-doctor').subscribe(response => {
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
    this.getSpectialist()
  }
}
