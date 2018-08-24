import {Injectable} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {Router} from '@angular/router';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';

@Injectable()
export class AuthenticationService {
  public user: Observable<firebase.User>;

  constructor(private afAuth: AngularFireAuth, private router: Router) {
    this.user = afAuth.authState;
  }

  login(user): any {
    return this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password)
      .then(() => {
        this.router.navigate(['/']);
      });
  }

  logout(): void {
    this.afAuth.auth.signOut()
    .then(() => {
      this.router.navigate(['/login']);
    });
  }
}
