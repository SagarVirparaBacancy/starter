import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  setLoggedUserData(data) {
    localStorage.setItem('data', JSON.stringify(data))
  }

  clearLoggedUserData() {
    localStorage.removeItem('data')
  }

  isLoggedIn() {
    let isDataAvailable = localStorage.getItem('data')

    if (isDataAvailable) {
      return true;
    } else {
      return false;
    }
  }

  login(data) {
    return this.http.post<any>(`${environment.APIURL}/auth/login`, data)
  }

  registerUser(data) {
    return this.http.post<any>(`${environment.APIURL}/auth/createUser`, data)
  }

  googleLogin(data) {
    return this.http.post<any>(`${environment.APIURL}/auth/googleLogin`, data)
  }

  getUserListForDT(dataTablesParameters) {
    return this.http.post<any>(`${environment.APIURL}/user/getUserForDT`, dataTablesParameters)
  }

  deleteUser(id) {
    return this.http.delete<any>(`${environment.APIURL}/user/${id}`)
  }

  updateUser(id, data) {
    return this.http.put<any>(`${environment.APIURL}/user/${id}`, data)
  }

  getUserById(id) {
    return this.http.get<any>(`${environment.APIURL}/user/${id}`)
  }

}
