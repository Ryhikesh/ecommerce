import { Component } from '@angular/core';
import { ProjectserviceService } from './projectservice.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
declare var $:any

declare var $:any

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Task';
  public showeyeIcon: any;
  public type: any;
  public showPage: any;
  public user: any;

  public first_name: any;
  public last_name: any;
  public email_id: any;
  public mobile_number: any;
  public user_role: any;
  public user_password: any;
  public password: string = '';
  public showUserList: boolean = false;
  userList:any;
  emailPattern = "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$"; 
  public product_purchased:any=[]

  public product_list:any=[];
  public cart_list:any=[];
  public user_name:any;
  public user_mail:any;
  public product_page:any;
  public role:any;
  public view:any;
  public searchProduct:any;
  public total_purchasedcost:any;

  constructor( private projectservice : ProjectserviceService,private router: Router,private toastr: ToastrService)
  {

    this.type='password';
    this.showPage='login';
    this.user_role=['Admin','Customer'];
     this.view='grid'
     const storedUser = sessionStorage.getItem('user');

     if (storedUser) {
       this.user = JSON.parse(storedUser);
       this.user_name=this.user.firstName;
       this.user_mail=this.user.email
       this.showPage = 'dashboard';
        this.role=this.user.role;
     }

     this.product_page='list';

     
    this.getdatas(this.role)


     this.projectservice.getCartList(this.user_mail).subscribe(
      (data: any) => {
        this.cart_list=data.cart_list
      })
  }
 
  hideShow() 
  {
    if (this.type === 'text') 
    {
      this.type = 'password';
      this.showeyeIcon = false;
    } 
    else 
    {
      this.type = 'text';
      this.showeyeIcon = true;
    }
  }

  signUp()
  {
    this.showPage='signin'
  }

  saveDetails(registerForm: NgForm) {
    const userDetail = {
        firstName: this.first_name, 
        lastName: this.last_name, 
        email: this.email_id, 
        phone: this.mobile_number, 
        password: this.user_password,
        user_role:this.user_role
    };

    this.projectservice.saveUsersDetail(userDetail).subscribe(
        (data: any) => {
            if (data.status === 'saved') {
                this.showPage = 'login';
                this.resetProperties();
            }
        },
        (error) => {
          if (error.status === 400 && error.error.title === 'Email already registered') {
              alert('The provided email is already associated with an existing account.');
          } else {
              console.error('Error saving user:', error); // Log other errors
          }
      }
    );
  }

  onLogin(form: NgForm) {
    if (form.valid) {
      const loginDetails = {
        email: this.email_id,
        password: this.password
      };

      this.projectservice.loginUser(loginDetails).subscribe(
        (response: any) => {
          console.log('Login successful:', response);

          const user = response.user;

          this.user = {
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.user_role,
            email: user.email
          };
          
          this.role=this.user.role;

          this.getdatas(this.role)

          // Store user in sessionStorage
          sessionStorage.setItem('user', JSON.stringify(this.user));

          // Navigate to dashboard
          this.showPage = 'dashboard';
        },
        (error) => {
          console.error('Login failed:', error);
          alert('Login failed: ' + (error.error.message || 'An error occurred. Please try again.'));
        }
      );
    }
  }

  logout() {
    sessionStorage.clear();
    this.showPage = 'login';
    this.user = null;
    this.showUserList = false;

  }

  resetProperties(): void {
    this.first_name = '';
    this.last_name = '';
    this.email_id = '';
    this.mobile_number = '';
    this.user_password = '';
  
  }

  MoveToLogin()
  {
    this.showPage='login'
  }

  productsCount(field:any,index:any)
  {
      if(field=='+')
      {
        this.product_list[index].count++;
      }
      else if(field=='-')
      {
        var counter=this.product_list[index].count--;
        if(counter>0)
        {
          this.product_list[index].count=this.product_list[index].count--;
        }
        else
        {
          this.product_list[index].count=0;
          alert('your product can decreased less than this')
        }
      }
  }

  addToCart(index:any)
  {
    var cart_list={
      'purchaser_name':this.user_name,
      'purchaser_mail':this.user_mail,
      'purchase_qty':this.product_list[index].count,
      'product_name':this.product_list[index].Product_name,
      'product_code':this.product_list[index].product_code,
      'total_cost': this.product_list[index].count*this.product_list[index].product_cost,
      'product_img':this.product_list[index].product_image
    }
    this.product_list[index].count=0;

    this.projectservice.saveCartProduct(cart_list).subscribe(
      (data: any) => {
          this.toastr.success('Added to cart sucessfully')
          this.cart_list=data.cart_list
    })
  }

  moveProduct(field:any)
  {
      if(field=='cart')
      {
        this.product_page='cart'
      }
      else if(field=='list')
      {
        this.product_page='list'
      }
  }

  deleteProduct(index:any)
  {
    var id=this.cart_list[index]._id
    this.projectservice.deleteProduct(id).subscribe(
      (data: any) => {
          this.toastr.success('Deleted sucessfully')
          this.cart_list=data.cart_list
    })

  }

  getdatas(role:any)
  {
    this.projectservice.getProductList(role).subscribe(
      (data: any) => {
        console.log(data)
       
        if(data.role=='Admin')
        {
          this.product_list=data.product_list
        }
        else
        {
           this.product_list=data.product_list;
           this.product_list.forEach((x:any)=>x.count=0)
        }
    })
    
  }

  changeView(field:any)
  {
      if(field=='grid')
      {
          this.view='grid'
      }
      else if(field=='list')
      {
        this.view='list'
      }
  }

  buyProduct(index:any)
  {
      this.product_purchased.push(this.cart_list[index]);
      this.total_purchasedcost = this.product_purchased.reduce((accumulator:any, product:any) => accumulator + product.total_cost, 0)
  }

  confirmOrder()
  {
    this.projectservice.purchaseProduct(this.product_purchased).subscribe(
      (data: any) => {
        console.log(data)
        this.toastr.success(data.message)
        this.cart_list=data.cart_list
    })
  }
  

}

