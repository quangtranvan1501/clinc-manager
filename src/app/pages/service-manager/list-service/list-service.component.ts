import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Service, Specialist } from 'src/app/@types';
import { AppService } from 'src/app/service/app.service';

@Component({
  selector: 'app-list-service',
  templateUrl: './list-service.component.html',
  styleUrls: ['./list-service.component.css']
})
export class ListServiceComponent implements OnInit{
  constructor(
    private appService: AppService,
    private modal: NzModalService,
    private message: NzMessageService,
    private fb: NonNullableFormBuilder,

  ) { }

  filteredService: Service[] = [];
  specialistList: Specialist[] = [
    {
      specialistId: '1',
      name: 'Tất cả',
      id: '1',
    }  
  ];
  specialistItem: Specialist = {
    specialistId: '',
    name: '',
    id: '',
  }

  listOfData: any[] = []
  pageIndex: number = 1
  pageSize: number = 5
  total: number = 0
  isDelete: boolean = false
  isConfirmLoading = false;
  isChangeInfo = false;
  serviceName: string = '';
  specialist: string = '';
  inputSearch: string = '';
  specialistEmty: string = '1';

  validateFormRegister: FormGroup<{
    id: FormControl<string>;
    serviceId: FormControl<string>;
    name: FormControl<string>;
    unit: FormControl<string>;
    price: FormControl<string>;
    specialist: FormControl<string>;
  }> = this.fb.group({
    id: ['', [Validators.required]],
    serviceId: ['', [Validators.required]],
    name: ['', [Validators.required]],
    unit: ['', [Validators.required]],
    price: ['', [Validators.required]],
    specialist: ['', [Validators.required]],
  });


  confirmDelete(data:any): void {
    this.modal.confirm({
      nzTitle: `Xác nhận xóa dịch vụ ${data.name}?`,
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.deleteUser(data.serviceId),
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
    this.appService.deleteOption<any>(id, '/services').subscribe(response => {
      if(!response.body){
        return
      }
      if (response.body.code == 200) {
        this.getService()
        this.message.create('success', 'Xóa dịch vụ thành công')
        this.isDelete = false
      }
    })
  }

  showModal(data: any) {
    this.isChangeInfo = true;
    this.validateFormRegister = this.fb.group({
      id: [data.id, [Validators.required]],
      serviceId: [data.serviceId, [Validators.required]],
      name: [data.name, [Validators.required]],
      unit: [data.unit, [Validators.required]],
      price: [data.price, [Validators.required]],
      specialist: [data.specialist.id, [Validators.required]],
    });
    console.log(this.validateFormRegister.value)
  }

  changePageIndex(pageIndex: number) {
    this.pageIndex = pageIndex
    if(!this.specialistEmty){
      this.getService()
      return
    } else{
      if(this.specialistEmty == '1'){
        this.getService()
        return
      }
      else{
        this.onSpecialistChange(this.specialistEmty)
      }
    }
  }

  onSpecialistChange(value: string): void {
    this.specialistEmty = value;
    if(value == '1'){
      this.getService()
      return;
    }
    var body = {
      specialist: value,
      sortBy: ['createdAt:desc'],
      page: this.pageIndex,
      limit: this.pageSize
    }
    this.appService.query<any>(body, '/services/specialist').subscribe(response => {
      if (!response.body) {
        return;
      }
      if (response.body.code == 200) {
        console.log(response.body)
        this.listOfData = response.body.data.results;
        this.filteredService = this.listOfData;
        this.total = response.body.data.totalResults;
        this.pageSize = response.body.data.limit;
        this.pageIndex = response.body.data.page;
        // return this.message.success(res.body.message)
      }
    })
  }

  filterSchedule(): void {
    const searchTerm = this.serviceName.toLowerCase();
    if (!searchTerm) {
      this.filteredService = this.listOfData;
    } else {
      this.filteredService = this.listOfData.filter((service: any) => {
        const serviceId = service.serviceId.toString().toLowerCase();
        const serviceNames = service.name?.toLowerCase() || '';
        return serviceId.includes(searchTerm) || serviceNames.includes(searchTerm);
      });
    }
  }

  searchUser() {
    if(this.inputSearch == ''){
      this.getService()
      return
    }
    var body = {
      searchText: this.inputSearch,
      sortBy: ['createdAt:desc'],
      page: this.pageIndex,
      limit: this.pageSize
    }
    this.appService.query<any>(body, '/services/search').subscribe(response => {
      if(!response.body){
        return
      }
      if (response.body.code == 200) {
        this.listOfData = response.body.data.results
        this.total = response.body.data.totalResults
      }
    })
  }

  async changeService(): Promise<void> {
    this.isConfirmLoading = true;
    const body: Partial<Service> = {
      name: this.validateFormRegister.value.name,
      unit: this.validateFormRegister.value.unit,
      price: parseInt(this.validateFormRegister.value.price ?? ''),
      specialist: this.validateFormRegister.value.specialist,
    }
    this.appService.update<Service, Partial<Service>>(body, `/services/${this.validateFormRegister.value.serviceId}`).subscribe(res => {
      if (!res.body) {
        return this.message.error('Đã có lỗi xảy ra vui lòng thử lại');
      }

      if (res.body.code == 200) {
        this.getService();
        
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
      this.isChangeInfo = false;
      this.isConfirmLoading = false;
    }, 1000);
  }

  getService() {
    var body = {
      sortBy: ['createdAt:desc'],
      page: this.pageIndex,
      limit: this.pageSize
    }
    this.appService.query<any>(body,'/services').subscribe(response => {
      if (!response.body) {
        return;
      }
      if (response.body.code == 200) {
        this.listOfData = response.body.data.results;
        this.filteredService = this.listOfData;
        this.total = response.body.data.totalResults;
        this.pageSize = response.body.data.limit;
        this.pageIndex = response.body.data.page;
        // return this.message.success(res.body.message)
      }
    });
  }

  ngOnInit() {
    this.getService();
    this.appService.find<any>('/specialist').subscribe(response => {
      if (!response.body) {
        return;
      }
      if (response.body.code == 200) {
        this.specialistList.push(...response.body.data.results);
        // return this.message.success(res.body.message)
      }
    });
  }
}
