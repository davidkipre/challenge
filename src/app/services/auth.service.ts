import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor(private auth: AngularFireAuth) {
    this.auth.onAuthStateChanged((user) => {
      this.currentUserSubject.next(user);
    }, console.error);
  }

  createUser(email: string, password: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.auth
        .createUserWithEmailAndPassword(email, password)
        .then((user) => {
          resolve(user);
        })
        .catch(reject);
    });
  }

  ConnectUser(email: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.auth
        .signInWithEmailAndPassword(email, password)
        .then(resolve)
        .catch(reject);
    });
  }

  // signoutUser(): Promise<void> {
  //   return new Promise((resolve, reject) => {
  //     this.auth
  //       .signOut()
  //       .then(() => {
  //         this.currentUserSubject.next(null);
  //         resolve();
  //       })
  //       .catch(reject);
  //   });
  // }

  //   sendPasswordResetEmail(email: string): Promise<void> {
  //     return new Promise((resolve, reject) => {
  //       this.auth.sendPasswordResetEmail(email).then(resolve).catch(reject);
  //     });
  //   }
}
