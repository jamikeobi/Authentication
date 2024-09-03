import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../Services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthResponse } from '../Model/AuthResponse';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  submitted: boolean = false;
  message: string = '';
  errorInfo: string | null = null;
  authService: AuthService = inject(AuthService);
  isLoginMode: boolean = true;
  isLoading: boolean = false;
  // errorMessage: string | null = null;
  authObs: Observable<AuthResponse>
  router: Router = inject(Router);

  @ViewChild('authForm') authForm!: NgForm;

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  ngOnInit() {

  }

  onSubmitted(form: NgForm) {
    this.submitted = false;
    const email = form.value.email;
    const password = form.value.password;

    if (this.isLoginMode) {
      this.isLoading = true;
      this.authObs = this.authService.login(email, password);
    } else {
      this.isLoading = true;
      this.authService.signUp(email, password).subscribe(
        (response) => {
          this.submitted = true;
          console.log('Response: ', response);
          this.isLoading = false;
          // this.errorInfo = 'You have successfully created an account.'
          if (this.submitted = true) {
            setTimeout(() => {
              this.errorInfo = 'You have successfully created an account.';
            }, 3000);
          };

          // this.submitted = false;
        },
        (error: HttpErrorResponse) => {
          this.isLoading = false;
          // this.hideSnackBar();
          console.log('Error: ', error.error);
          console.log('Status Code: ', error.status);
          console.log('Error Message: ', error.message);
          if (error.error && error.error.error) {
            const errorMessage = error.error.error.message;
            if (errorMessage === 'INVALID_EMAIL') {
              this.errorInfo = 'Invalid email format provided.';
            } else if (errorMessage === 'EMAIL_EXISTS') {
              this.errorInfo = 'The email address is already in use by another account.';
            } else if (errorMessage === 'OPERATION_NOT_ALLOWED') {
              this.errorInfo = 'Password sign-in is disabled for this project.';
            } else if (errorMessage === 'TOO_MANY_ATTEMPTS_TRY_LATER') {
              this.errorInfo = 'We have blocked all requests from this device due to unusual activity. Try again later.'
            } else {
              this.errorInfo = 'Error message from API:', errorMessage;
            }
          }
        }
      );
    }
    this.authObs.subscribe({
      next: (res) => {
        console.log(res);
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (errMsg) => {
        this.isLoading = false;
        this.errorInfo = errMsg;
        this.hideSnackBar()
      }
    });
    form.reset();
  }

  hideSnackBar() {
    setTimeout(() => {
      this.errorInfo = null;
    }, 3000)
  }
}
