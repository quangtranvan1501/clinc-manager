import { NgModule } from '@angular/core';

import { WelcomeRoutingModule } from './welcome-routing.module';

import { WelcomeComponent } from './welcome.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CommonModule } from '@angular/common';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { UserListComponent } from '../user-manager/user-list/user-list.component';
import { CreateUserComponent } from '../user-manager/create-user/create-user.component';
import { UserRoleComponent } from '../user-manager/user-role/user-role.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NZ_I18N, vi_VN } from 'ng-zorro-antd/i18n';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { CreateDoctorComponent } from '../doctor-manager/create-doctor/create-doctor.component';
import { ListDoctorComponent } from '../doctor-manager/list-doctor/list-doctor.component';
import { SheduleDoctorComponent } from '../doctor-manager/shedule-doctor/shedule-doctor.component';
import { ListMedicalRecordComponent } from '../record-manager/list-medical-record/list-medical-record.component';
import { CreateMedicalRecordComponent } from '../record-manager/create-medical-record/create-medical-record.component';
import { ChangeMedicalRecordComponent } from '../record-manager/change-medical-record/change-medical-record.component';
import { ListServiceComponent } from '../service-manager/list-service/list-service.component';
import { CreateServiceComponent } from '../service-manager/create-service/create-service.component';
import { PriceFormatPipe } from 'src/app/@types/price-format.pipe';
import { ListSheduleComponent } from '../shedule-manager/list-shedule/list-shedule.component';
import { CreateSheduleComponent } from '../shedule-manager/create-shedule/create-shedule.component';
import { ListOrderComponent } from '../order-manager/list-order/list-order.component';
import { CreateOrderComponent } from '../order-manager/create-order/create-order.component';
import { ChangeOrderComponent } from '../order-manager/change-order/change-order.component';
import { ListSpecialistComponent } from '../specialist-manager/list-specialist/list-specialist.component';
import { NgChartsModule } from 'ng2-charts';
import { HighchartsChartModule } from 'highcharts-angular';
@NgModule({
  imports: [
    WelcomeRoutingModule,
    NzLayoutModule,
    NzIconModule,
    CommonModule,
    NzMenuModule,
    FormsModule,
    HttpClientModule,
    NzFormModule,
    NzInputModule,
    NzIconModule,
    NzButtonModule,
    ReactiveFormsModule,
    NzCheckboxModule,
    NzGridModule,
    NzModalModule,
    NzMessageModule,
    NzDatePickerModule,
    NzRadioModule,
    NzSpinModule,
    NzDescriptionsModule,
    NzAvatarModule,
    NzDropDownModule,
    NzTableModule,
    NzPaginationModule,
    NzTagModule,
    NzSelectModule,
    NzTimePickerModule,
    NgChartsModule,
    HighchartsChartModule
  ],
  declarations: [
    WelcomeComponent,
    PriceFormatPipe,
    UserListComponent,
    CreateUserComponent,
    UserRoleComponent,
    NavBarComponent,
    CreateDoctorComponent,
    ListDoctorComponent,
    SheduleDoctorComponent,
    ListMedicalRecordComponent,
    CreateMedicalRecordComponent,
    ChangeMedicalRecordComponent,
    ListServiceComponent,
    CreateServiceComponent,
    ListSheduleComponent,
    CreateSheduleComponent,
    ListOrderComponent,
    CreateOrderComponent,
    ChangeOrderComponent,
    ListSpecialistComponent
  ],
  exports: [WelcomeComponent],
  providers: [
    { provide: NZ_I18N, useValue: vi_VN },
  ]
})
export class WelcomeModule { }
