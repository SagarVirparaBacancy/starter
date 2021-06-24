import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    private socialAuthService: SocialAuthService
  ) { }

  ngOnInit(): void {
  }

  logout() {
    this.authService.clearLoggedUserData()

    this.socialAuthService.signOut()
    this.router.navigateByUrl('/');
  }

  gotoUserList() {
    this.router.navigateByUrl('/user-list');
  }
}
