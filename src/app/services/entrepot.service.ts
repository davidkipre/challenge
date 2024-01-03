import { EventEmitter, Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Entrepot } from '../interfaces/entrepot.interface';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EntrepotService {
  private message1 = new BehaviorSubject('Creer');
  getMessage1 = this.message1.asObservable();

  private message2 = new BehaviorSubject('Modifier');
  getMessage2 = this.message2.asObservable();

  private message3 = new BehaviorSubject('Supprimer');
  getMessage3 = this.message3.asObservable();

  private entrepots: Entrepot[] = [];

  entrepotsSubject: BehaviorSubject<Entrepot[]> = new BehaviorSubject(
    <Entrepot[]>[]
  );

  constructor(
    private db: AngularFireDatabase,
    private storage: AngularFireStorage
  ) {}

  async createEntrepot(entrepot: Entrepot): Promise<Entrepot> {
    try {
      const response = this.db.list('entrepots').push({ ...entrepot });
      const createdEntrepot = { ...entrepot, id: <string>response.key };
      this.entrepots.push(createdEntrepot);
      this.dispatchEntrepots();
      return createdEntrepot;
    } catch (error) {
      throw error;
    }
  }

  getEntrepots(): void {
    this.db
      .list('entrepots')
      .query.limitToLast(10)
      .once('value', (snapshot) => {
        const entrepotsSnapshotValue = snapshot.val();
        if (entrepotsSnapshotValue) {
          const entrepots = Object.keys(entrepotsSnapshotValue).map((id) => ({
            id,
            ...entrepotsSnapshotValue[id],
          }));
          console.log(entrepots);

          this.entrepots = entrepots;
        }
        this.dispatchEntrepots();
      });
  }

  getEntrepotById(entrepotId: string): Promise<Entrepot> {
    return new Promise((resolve, reject) => {
      this.db.database
        .ref(`entrepots/${entrepotId}`)
        .once('value', (snapshot, err) => {
          if (err) {
            reject(err);
          }
          resolve(snapshot.val());
        });
    });
  }

  async editEntrepot(
    entrepot: Entrepot,
    entrepotId: string
  ): Promise<Entrepot> {
    try {
      await this.db.list('entrepots').update(entrepotId, entrepot);
      const entrepotIndexToUpdate = this.entrepots.findIndex(
        (el) => el.id === entrepotId
      );
      this.entrepots[entrepotIndexToUpdate] = { ...entrepot, id: entrepotId };
      this.dispatchEntrepots();
      return { ...entrepot, id: entrepotId };
    } catch (error) {
      throw error;
    }
  }

  async deleteEntrepot(entrepotId: string): Promise<Entrepot> {
    try {
      const offerToDeleteIndex = this.entrepots.findIndex(
        (el) => el.id === entrepotId
      );
      const entrepotToDelete = this.entrepots[offerToDeleteIndex];
      await this.db.list('entrepots').remove(entrepotId);
      this.entrepots.splice(offerToDeleteIndex, 1);
      this.dispatchEntrepots();
      return entrepotToDelete;
    } catch (error) {
      throw error;
    }
  }
  dispatchEntrepots() {
    this.entrepotsSubject.next(this.entrepots);
  }
}
