import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  userEditForm = this.fb.group({
    name: ['', Validators.required],
    userType: ['', Validators.required],
    email: ['', Validators.required]
  });

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.getUserById(this.route.snapshot.paramMap.get('id')).subscribe(res => {
      // console.log(res)
      this.userEditForm.patchValue({
        name: res.data.name,
        userType: res.data.userType,
        email: res.data.email
      })
      // this.toastr.success(res.message)
    }, err => {
      this.toastr.error(err.error.message)
    }, () => {

    })

  }

  onSubmit() {
    if (this.userEditForm.valid) {
      this.authService.updateUser(this.route.snapshot.paramMap.get('id'), this.userEditForm.value).subscribe(data => {
        this.toastr.success(data.message)
        this.router.navigateByUrl('/user-list')
        // console.log(data)
      }, err => {
        this.toastr.error(err.error.message)
      }, () => {

      })
    }
  }

}
