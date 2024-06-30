import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome.component';
import { UserListComponent } from '../user-manager/user-list/user-list.component';
import { CreateUserComponent } from '../user-manager/create-user/create-user.component';
import { UserRoleComponent } from '../user-manager/user-role/user-role.component';
import { ListDoctorComponent } from '../doctor-manager/list-doctor/list-doctor.component';
import { CreateDoctorComponent } from '../doctor-manager/create-doctor/create-doctor.component';
import { SheduleDoctorComponent } from '../doctor-manager/shedule-doctor/shedule-doctor.component';
import { ChangeMedicalRecordComponent } from '../record-manager/change-medical-record/change-medical-record.component';
import { ListMedicalRecordComponent } from '../record-manager/list-medical-record/list-medical-record.component';
import { CreateMedicalRecordComponent } from '../record-manager/create-medical-record/create-medical-record.component';
import { ListServiceComponent } from '../service-manager/list-service/list-service.component';
import { CreateServiceComponent } from '../service-manager/create-service/create-service.component';
import { ListSheduleComponent } from '../shedule-manager/list-shedule/list-shedule.component';
import { CreateSheduleComponent } from '../shedule-manager/create-shedule/create-shedule.component';
import { ListOrderComponent } from '../order-manager/list-order/list-order.component';
import { CreateOrderComponent } from '../order-manager/create-order/create-order.component';
import { ChangeOrderComponent } from '../order-manager/change-order/change-order.component';
import { ListSpecialistComponent } from '../specialist-manager/list-specialist/list-specialist.component';
import { ChatComponent } from '../chat/chat.component';
import { authGuard } from 'src/app/auth.guard';
import { ListVoucherComponent } from '../voucher-manager/list-voucher/list-voucher.component';

const routes: Routes = [
  { path: '', component: WelcomeComponent , canActivate: [authGuard]},
  { path: 'list-user', component: UserListComponent, canActivate: [authGuard]},
  { path: 'create-user', component: CreateUserComponent, canActivate: [authGuard]},
  { path: 'user-role', component: UserRoleComponent, canActivate: [authGuard]},
  { path: 'list-doctor', component: ListDoctorComponent, canActivate: [authGuard]},
  { path: 'create-doctor', component: CreateDoctorComponent, canActivate: [authGuard]},
  { path: 'shedule-doctor', component: SheduleDoctorComponent, canActivate: [authGuard]},
  { path: 'change-medical-record', component: ChangeMedicalRecordComponent, canActivate: [authGuard]},
  { path: 'list-medical-record', component: ListMedicalRecordComponent, canActivate: [authGuard]},
  { path: 'create-medical-record', component: CreateMedicalRecordComponent, canActivate: [authGuard]},
  { path: 'list-service', component: ListServiceComponent, canActivate: [authGuard]},
  { path: 'create-service', component: CreateServiceComponent, canActivate: [authGuard]},
  { path: 'list-shedule', component: ListSheduleComponent, canActivate: [authGuard]},
  { path: 'create-shedule', component: CreateSheduleComponent, canActivate: [authGuard]},
  { path: 'list-order', component: ListOrderComponent, canActivate: [authGuard]},
  { path: 'create-order', component: CreateOrderComponent, canActivate: [authGuard]},
  { path: 'change-order', component: ChangeOrderComponent, canActivate: [authGuard]},
  { path: 'change-order/:orderId', component: ChangeOrderComponent, canActivate: [authGuard]},
  { path: 'list-specialist', component: ListSpecialistComponent, canActivate: [authGuard]},
  { path: 'chat', component: ChatComponent, canActivate: [authGuard]},
  { path: 'chat/:userId', component: ChatComponent, canActivate: [authGuard]},
  { path: 'voucher', component: ListVoucherComponent, canActivate: [authGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WelcomeRoutingModule { }
