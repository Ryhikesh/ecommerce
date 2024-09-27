import { Injectable } from '@angular/core';
import { environment } from './../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProjectserviceService {
  public root:any

  constructor(private http:HttpClient) { 
    this.root = environment.apiURL;
  }

  saveUsersDetail(bulkquery:any)
  {
    let body=bulkquery;
    let url=this.root+'/saveuserdetail';
    return this.http.post(url, body);
  }

  loginUser(loginDetails: any) {
    return this.http.post(`${this.root}/login`, loginDetails);
  }
  
  getUserList() {
    return this.http.get<any>(`${this.root}/users`); // Adjust the endpoint as needed
  }

  getProductList(role:any)
  {
    return this.http.get<any>(`${this.root}/getproductlist`+'/'+role);
  }

  saveCartProduct(bulkquery:any)
  {
    let body=bulkquery;
    let url=this.root+'/savecartproduct';
    return this.http.post(url, body);
  }

  getCartList(umail:any)
  {
    return this.http.get<any>(`${this.root}/getCartlist`+'/'+umail); 
  }

  deleteProduct(id:any)
  {
    return this.http.get<any>(`${this.root}/deleteproduct`+'/'+id);  
  }

  purchaseProduct(bulkquery:any)
  {
    let body=bulkquery;
    let url=this.root+'/purchaseproduct';
    return this.http.post(url, body);
  }
  
}
