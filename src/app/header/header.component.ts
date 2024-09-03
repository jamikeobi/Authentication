import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { User } from '../Model/User';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{
  authService: AuthService = inject(AuthService);
  isLoggedIn: boolean =  false
  private userSubject: Subscription
  router: Router = inject(Router);


  ngOnInit(){
    this.userSubject = this.authService.user.subscribe((user: User) => {
      console.log("User:", user);
      
      this.isLoggedIn = user ? true : false;
    });

    this.authService.autoLogin();
  }

  ngOnDestroy(){
    this.userSubject.unsubscribe();
  }

  onLogOut(){
    this.authService.logOut();
    this.router.navigate(['/login']);
  }
}
