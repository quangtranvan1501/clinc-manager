import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzI18nService, vi_VN } from 'ng-zorro-antd/i18n';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Order } from 'src/app/@types';
import { AppService } from 'src/app/service/app.service';

@Component({
  selector: 'app-change-order',
  templateUrl: './change-order.component.html',
  styleUrls: ['./change-order.component.css']
})
export class ChangeOrderComponent {
  constructor(
    private appService: AppService,
    private message: NzMessageService,
    private i18n: NzI18nService,
    private route: ActivatedRoute
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

  searchOrder() {
    this.appService.getById<any>(this.inputSearch, '/orders').subscribe(response => {
      if (!response.body) {
        return
      }
      if (response.body.code == 200) {
        console.log(response.body.data)
        this.orderItem = response.body.data
        this.listOfData = response.body.data.orderService.map((item: { service: any; quantity: any; })=> ({
          ...item.service,
          quantity: item.quantity
        }))
        console.log(this.listOfData)
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
    this.route.params.subscribe(params => {
      console.log(params['orderId']);
      this.inputSearch = params['orderId'];
      this.searchOrder();
    });
    // this.getShedule()
  }
}
