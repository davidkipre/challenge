import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { EntrepotService } from 'src/app/services/entrepot.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  isLoading = false;
  signupForm!: FormGroup;
  errorMsg: any;

  constructor(private AuthService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.initSignupForm();
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  initSignupForm(): void {
    this.signupForm = new FormGroup({
      email: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
    });
  }

  onSubmitSignupForm(): void {
    if (this.isLoginMode) {
      this.AuthService.ConnectUser(
        this.signupForm.value.email,
        this.signupForm.value.password
      )
        .then(() => {
          this.router.navigate(['Dashboard']);
        })
        .catch(
          (errMsg) =>
            (this.errorMsg = errMsg = 'Verifier votre mail ou mot de passe')
        );
    } else {
      this.AuthService.createUser(
        this.signupForm.value.email,
        this.signupForm.value.password
      )
        .then((user) => {
          console.log(user);

          this.router.navigate(['Dashboard']);
        })
        .catch((errMsg) => (this.errorMsg = errMsg = 'Oups reessayer'));
    }

    this.signupForm.reset();
  }
}
