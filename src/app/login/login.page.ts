import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../authentication/authentication.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage {

  form: FormGroup;
  email: string = '';
  password: string = '';
  authenticationFailed: boolean = false;
  isLoading: boolean = false;

  constructor(private fb: FormBuilder, private authenticationService: AuthenticationService, private menuCtrl: MenuController) {
    this.form = fb.group({
      'email' : [null, Validators.required],
      'password' : [null, Validators.required],
    });
  }

  ionViewWillEnter() {
    //TODO doesn't work on refresh
    this.menuCtrl.enable(false);
  }

  ionViewDidLeave() {
    this.menuCtrl.enable(true);
  }

  login(user: { email: string, password: string }) {
    this.isLoading = true;
    this.authenticationFailed = false;
    this.authenticationService.login(user)
    .catch(() => {
      this.isLoading = false
      this.authenticationFailed = true;
    });
  }
}
