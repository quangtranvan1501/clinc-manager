import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { NzI18nService, vi_VN } from 'ng-zorro-antd/i18n';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Order } from 'src/app/@types';
import { AppService } from 'src/app/service/app.service';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent {
  constructor(
    private appService: AppService,
    private message: NzMessageService,
    private i18n: NzI18nService
  ) { }

  listOfData: any[] = []
  pageIndex: number = 1
  pageSize: number = 5
  total: number = 0
  isDelete: boolean = false
  isConfirmLoading = false;
  isChangeInfo = false;
  inputSearch: string = '';
  serviceSearch: string = '';
  orderItem: Order = {
    orderId: '',
    orderDate: '',
    orderService: [
      {
        service: {
          id: '',
          serviceId: '',
          name: '',
          price: 0
        },
        quantity: 0
      }
    ],
    patient: {
      name: '',
      userId: '',
      gender: '',
      birthday: '',
      address: '',
      id: ''
    },
    totalAmount: 0,
    discount: 0,
    status: ''
  };


  cancel(data: any): void {
    const index = this.listOfData.filter(item => item.id !== data.id)
    this.listOfData = index
  }

  deleteUser(id: any) {
    this.appService.deleteOption<any>(id, '/orders').subscribe(response => {
      if (!response.body) {
        return
      }
      if (response.body.code == 200) {
        // this.getShedule()
        this.message.create('success', 'Xóa hóa đơn thành công')
        this.isDelete = false
      }
    })
  }

  searchUser() {
    this.appService.getById<any>(this.inputSearch, '/users').subscribe(response => {
      if (!response.body) {
        return
      }
      if (response.body.code == 200) {
        this.orderItem.patient = {
          name: response.body.data.name,
          userId: response.body.data.userId,
          gender: response.body.data.gender,
          birthday: response.body.data.birthday,
          address: response.body.data.address,
          id: response.body.data.id
        }
      }
    })
  }
  searchService() {
    this.appService.getById<any>(this.serviceSearch, '/services').subscribe(response => {
      if (!response.body) {
        return
      }
      if (response.body.code == 200) {
        this.listOfData = [
          ...this.listOfData,
          {
            ...response.body.data,
            quantity: 1
          }
        ]
        this.orderItem.totalAmount = this.totalAmount()
        console.log(this.listOfData)
      }
    })
  }

  totalAmount() {
    return this.listOfData.reduce((acc, cur) => acc + cur.price * cur.quantity, 0)
  }

  createOrder() {
    if (this.orderItem.patient.id && this.listOfData.length != 0) {
      const body = {
        totalAmount: this.orderItem.totalAmount,
        discount: this.orderItem.discount,
        orderService: this.listOfData.map(item => ({
          service: item.id,
          quantity: item.quantity
        })),
        patient: this.orderItem.patient.id,
      }
      console.log(body)
      this.appService.post<any, any>(body, '/orders').subscribe(response => {
        if (!response.body) {
          return
        }
        if (response.body.code == 201) {
          this.message.create('success', 'Tạo hóa đơn thành công')
          this.isChangeInfo = false;
        }
      })
    } else{
      this.message.create('error', 'Vui lòng nhập đầy đủ thông tin')
    
    }
  }

  ngOnInit(): void {
    this.i18n.setLocale(vi_VN);
    // this.getShedule()
  }
}
