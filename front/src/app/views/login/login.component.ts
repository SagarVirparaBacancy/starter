import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  socialUser: SocialUser;
  isLoggedin: boolean;

  loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private socialAuthService: SocialAuthService
  ) { }

  ngOnInit(): void {

    // this.socialAuthService.authState.subscribe((user) => {
    //   this.socialUser = user;
    //   this.isLoggedin = (user != null);
    //   console.log("this.socialUser", this.socialUser);
    // });

  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(data => {
        this.toastr.success(data.message)
        this.authService.setLoggedUserData(data.data)
        this.router.navigateByUrl('/dashboard');
      }, err => {
        console.log(err)
        this.toastr.error(err.error.message)
      }, () => {

      })
    }
  }

  gotoRegister() {
    this.router.navigateByUrl('/register');
  }

  loginWithGoogle() {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);

    this.socialAuthService.authState.subscribe((user) => {
      // console.log("this.socialUser login", user);

      if (user) {
        let socialObjToBeSent = {
          email: user['email'],
          name: user['name'],
          socialid: user['id'],
          provider: user['provider']
        }

        this.authService.googleLogin(socialObjToBeSent).subscribe(res => {
          this.toastr.success(res.message)
          this.authService.setLoggedUserData(res.data)
          this.router.navigateByUrl('/dashboard');
        }, err => {
          this.toastr.error(err.error.message)
        }, () => {

        })

      }

    });

  }


  loginWithFB(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);

    this.socialAuthService.authState.subscribe((user) => {
      if (user) {
        let socialObjToBeSent = {
          email: user['email'],
          name: user['name'],
          socialid: user['id'],
          provider: user['provider']
        }

        this.authService.googleLogin(socialObjToBeSent).subscribe(res => {
          this.toastr.success(res.message)
          this.authService.setLoggedUserData(res.data)
          this.router.navigateByUrl('/dashboard');
        }, err => {
          this.toastr.error(err.error.message)
        }, () => {

        })

      }
    });

  }

  logOut(): void {
    this.socialAuthService.signOut();
  }

}
