import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();

  dtOptions: DataTables.Settings = {};
  persons: any;

  constructor(private authService: AuthService, private toastr: ToastrService) { }

  ngOnInit(): void {
    const that = this;

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.authService.getUserListForDT(dataTablesParameters).subscribe(resp => {
          that.persons = resp.data.data

          callback({
            recordsTotal: resp.data.recordsTotal,
            recordsFiltered: resp.data.recordsFiltered,
            data: []
          });
        })
      },
      columns: [{ data: 'name' }, { data: 'email' }, { data: 'userType' }]
    };
  }

  deleteUser(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this record ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {

        this.authService.deleteUser(id).subscribe(res => {
          this.toastr.success(res.message)
          this.rerender()
        }, err => {
          this.toastr.error(err.error.message)
        }, () => {

        })

      }
    })
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

}
