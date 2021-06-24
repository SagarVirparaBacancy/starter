import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm = this.fb.group({
    name: ['', Validators.required],
    pic: ['', Validators.required],
    userType: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    const formData = new FormData()
    formData.append('pic', this.registerForm.get('pic').value)
    formData.append('name', this.registerForm.value.name)
    formData.append('userType', this.registerForm.value.userType)
    formData.append('email', this.registerForm.value.email)
    formData.append('password', this.registerForm.value.password)

    if (this.registerForm.valid) {
      this.authService.registerUser(formData).subscribe(data => {
        this.toastr.success(data.message)
        // console.log(data)
      }, err => {
        this.toastr.error(err.error.message)
      }, () => {

      })
    }

  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.registerForm.patchValue({
        pic: file
      });
    }
  }

}
