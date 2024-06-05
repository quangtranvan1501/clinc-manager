import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit, OnChanges {
  @Input() routerNav: string = '';
  @Input() isSub: string = '';

  constructor(
    private authService: AuthService,
  ) { }

  selectedNavItem: string = '';
  isOpen: string = '';
  isLogin: boolean = false

  ngOnChanges(changes: SimpleChanges) {
    if (changes['routerNav']) {
      this.setSelectedItem(changes['routerNav'].currentValue);
    }
    if (changes['isSub']) {
      this.seSubItem(changes['isSub'].currentValue);
    }
  }

  logOut() {
    this.authService.logout()
    window.location.reload();
  }
  ngOnInit(): void {
    this.isLogin = this.authService.isLoggedIn()
  }

  setSelectedItem(nav: string) {
    this.selectedNavItem = nav;
  }
  seSubItem(nav: string) {
    this.isOpen = nav;
  }
}
