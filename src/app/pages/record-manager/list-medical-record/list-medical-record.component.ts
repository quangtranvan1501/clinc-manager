import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AppService } from 'src/app/service/app.service';

@Component({
  selector: 'app-list-medical-record',
  templateUrl: './list-medical-record.component.html',
  styleUrls: ['./list-medical-record.component.css']
})
export class ListMedicalRecordComponent implements OnInit {
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
  isView: boolean = false;
  isConfirmDelete = false;
  medicalRecordId: string = '';
  isEdit: boolean = false;

  recordView: any ={
    medicalRecordId: '',
    patient: {
      name: '',
      address: '',
      gender: '',
      birthday: '',
    },
    doctor: '',
    service: '',
    diagnose: '',
    prescription: '',
    symptom: '',
    note: '',
    testResults: '',
    day: ''
  }

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
  });

  recordForm: FormGroup<{
    diagnose: FormControl<string>;
    prescription: FormControl<string>;
    symptom: FormControl<string>;
    note: FormControl<string>;
    testResults: FormControl<string>;
    day: FormControl<string>;
  }> = this.fb.group({
    diagnose: ['', [Validators.required]],
    prescription: [' ', [Validators.required]],
    symptom: ['', [Validators.required]],
    note: [' ', [Validators.required]],
    testResults: ['', [Validators.required]],
    day: ['', [Validators.required]],
  });

  okView(): void {
    console.log('Button ok clicked!');
    this.isView = false;
  }

  closeView(): void {
    console.log('Button close clicked!');
    this.isView = false;
  }

  viewPrescription(data: any) {
    this.appService.getById<any>(data, '/medicalRecords').subscribe(response => {
      if (!response.body) {
        return;
      }
      if (response.body.code == 200) {
        this.recordView = response.body.data;
        console.log(this.recordView);
        this.isView = true;
      }
    })
  }

  editMedicalRecord(data: any) {
    this.recordView = data;
    this.medicalRecordId = data.medicalRecordId;
    this.recordForm.patchValue({
      // medicalRecordId: data.medicalRecordId,
      diagnose: data.diagnose,
      prescription: data.prescription,
      symptom: data.symptom,
      note: data.note,
      testResults: data.testResults,
      day: data.day,
    })
    this.isEdit = true;
  }

  confirmDelete(data:any): void {
    // const formattedDay = this.datePipe.transform(data.day, 'dd/MM/yyyy');
    this.modal.confirm({
      nzTitle: `Xác nhận xóa bệnh án: ${ data.medicalRecordId } ?`,
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.delete(data.medicalRecordId),
      nzCancelText: 'No',
      nzOnCancel: () => this.handleCancel()
    });
  }

  handleCancel(): void {
    this.isConfirmDelete = false;
  }

  cancel(): void {
    this.isChangeInfo = false;
  }

  delete(data: any) {
    this.appService.deleteOption<any>(data, '/medicalRecords').subscribe(response => {
      if (!response.body) {
        return;
      }
      if (response.body.code == 200) {
        this.getMedicalRecord();
        return this.message.success(response.body.message);
      }
      return this.message.error(response.body.message);
    }, error => {
      return this.message.error('Xóa không thành công');
    })
  };
  closeEdit(): void {
    console.log('Button close clicked!');
    this.isEdit = false;
  }

  editRecord(): void {
    console.log('Button edit clicked!');
    this.appService.update<any, any>(this.recordForm.value, `/medicalRecords/${this.medicalRecordId}`).subscribe(response => {
      if (!response.body) {
        return;
      }
      if (response.body.code == 200) {
        this.getMedicalRecord();
        this.isEdit = false;
        return this.message.success(response.body.message);
      }
      return this.message.error(response.body.message);
    })
    this.isEdit = true;
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
    });
    console.log(this.validateFormRegister.value)
  }

  changePageIndex(pageIndex: number) {
    this.pageIndex = pageIndex
    this.getMedicalRecord()
  }

  searchUser() {
    if(this.inputSearch == ''){
      this.getMedicalRecord()
      return
    }
    // var body = {
    //   : this.inputSearch,
    // }
    this.appService.getById<any>(this.inputSearch, '/medicalRecords').subscribe(response => {
      if(!response.body){
        return
      }
      if (response.body.code == 200) {
        this.listOfData = response.body.data
        // this.total = response.body.data.totalResults
      }
      this.listOfData = response.body.data
    }, error => {
      this.listOfData = []
      return this.message.error('Không tìm thấy bệnh án')
    })
  }

  getMedicalRecord() {
    var body = {
      sortBy: ['createdAt:desc'],
      page: this.pageIndex,
      limit: this.pageSize
    }
    this.appService.query<any>(body, '/medicalRecords').subscribe(response => {
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
    this.getMedicalRecord()
  }
}
