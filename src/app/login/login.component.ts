import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isLoginMode: boolean = true;
  @ViewChild('authForm') authForm!: NgForm;
  onSwitchMode(){
  this.isLoginMode  = !this.isLoginMode;
  }

  onSubmitted(form: NgForm){
    console.log(form.value);
    form.reset();
    
  }
}
