import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthenticationService } from '../authentication/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage {

  user: Observable<firebase.User>;
  form: FormGroup;
  email:string = '';
  password:string = '';
  authenticationFailed:boolean = false;

  constructor(public afAuth: AngularFireAuth, private fb: FormBuilder, private authenticationService: AuthenticationService) {
    this.user = afAuth.authState;

    this.form = fb.group({
      'email' : [null, Validators.required],
      'password' : [null, Validators.required],
    });
  }

  ngOnInit() {
  }

  login(user) {
    this.authenticationService.login(user)
    .catch(() => {
      this.authenticationFailed = true;
    });
  }
}
