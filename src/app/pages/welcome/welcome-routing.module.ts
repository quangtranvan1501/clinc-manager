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

const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'list-user', component: UserListComponent},
  { path: 'create-user', component: CreateUserComponent},
  { path: 'user-role', component: UserRoleComponent},
  { path: 'list-doctor', component: ListDoctorComponent},
  { path: 'create-doctor', component: CreateDoctorComponent},
  { path: 'shedule-doctor', component: SheduleDoctorComponent},
  { path: 'change-medical-record', component: ChangeMedicalRecordComponent},
  { path: 'list-medical-record', component: ListMedicalRecordComponent},
  { path: 'create-medical-record', component: CreateMedicalRecordComponent},
  { path: 'list-service', component: ListServiceComponent},
  { path: 'create-service', component: CreateServiceComponent},
  { path: 'list-shedule', component: ListSheduleComponent},
  { path: 'create-shedule', component: CreateSheduleComponent},
  { path: 'list-order', component: ListOrderComponent},
  { path: 'create-order', component: CreateOrderComponent},
  { path: 'change-order', component: ChangeOrderComponent},
  { path: 'change-order/:orderId', component: ChangeOrderComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WelcomeRoutingModule { }
