import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Entrepot } from 'src/app/interfaces/entrepot.interface';
import { EntrepotService } from 'src/app/services/entrepot.service';
import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';
import { ModalI } from 'src/app/interfaces/modal.interface';

@Component({
  selector: 'app-entrepots',
  templateUrl: './entrepots.component.html',
  styleUrls: ['./entrepots.component.scss'],
})
export class EntrepotsComponent implements OnInit {
  data: any;
  alert: any;
  errorMsg: any;
  entrepotForm!: FormGroup;

  entrepots: Entrepot[] = [];

  subscription!: Subscription;
  Libelle: any = [
    'ACIPA YOP',
    'ACIPAC MARCORY',
    'ACIPAC TREICHVILLE',
    'ACIPAC DEUX PLATEAUX',
  ];
  Superficie: any = ['1000', '2000', '3000', '4000'];
  Placer: any = [
    'YOP ZONE INDUSTRIELLE',
    'MARCORY ZONE INDUSTRIELLE',
    'TREICHVILLE ZONE INDUSTRIELLE',
    'DEUX PLATEAUX ZONE INDUSTRIELLE',
  ];
  Longitude: any = ['50 m', '100 m', '150 m', '200 m'];
  Latitude: any = ['2 m', '3 m', '4m', '5 m'];
  //private closeSub: Subscription;
  constructor(
    private formBuilder: FormBuilder,
    private entrepotservice: EntrepotService,
    private modalService: NgbModal
  ) {
    this.alert = {
      isVisible: false,
      message: '',
      type: '',
    };
  }
  ngOnInit(): void {
    this.subscription = this.entrepotservice.entrepotsSubject.subscribe({
      next: (entrepots) => (this.entrepots = entrepots),
      error: console.error,
    });
    this.entrepotservice.getEntrepots();

    this.entrepotForm = new FormGroup({
      id: new FormControl(null),
      libelle: new FormControl(null, [Validators.required]),
      superficie: new FormControl(null, [Validators.required]),
      placer: new FormControl(null, [Validators.required]),
      longitude: new FormControl(null, [Validators.required]),
      latitude: new FormControl(null, [Validators.required]),
    });
  }

  onSubmitEntrepotForm(): void {
    const entrepotId = this.entrepotForm.value.id;
    let entrepot = this.entrepotForm.value;
    entrepot = { ...entrepot };
    if (!entrepotId || (entrepotId && entrepotId === '')) {
      // CREATION
      delete entrepot.id;
      // this.entrepotservice
      //   .createEntrepot(entrepot)
      //   .catch((errMsg) => (this.errorMsg = errMsg));
      const confirmModal = this.modalService.open(ModalConfirmComponent).result;

      confirmModal.then(() => {
        this.entrepotservice
          .createEntrepot(entrepot)
          .then(() => {
            this.entrepotForm.reset();
            this.alert.isVisible = true;
            this.alert.message = 'Entrepot ajouté avec succès !';
            this.alert.type = 'success';
            setTimeout(() => (this.alert.isVisible = false), 2500);
          })
          .catch(() => {
            this.alert.isVisible = true;
            this.alert.message = 'Une erreure est survenue lors de lajout !';
            this.alert.type = 'error';
            setTimeout(() => (this.alert.isVisible = false), 25000);
          });
      });
    } else {
      // MODIFICATION
      delete entrepot.id;
      // this.entrepotservice
      //   .editEntrepot(entrepot, entrepotId)
      //   .catch((errMsg) => (this.errorMsg = errMsg));
      const confirmModal = this.modalService.open(ModalConfirmComponent).result;

      confirmModal.then(() => {
        this.entrepotservice
          .editEntrepot(entrepot, entrepotId)
          .then(() => {
            this.entrepotForm.reset();
            this.alert.isVisible = true;
            this.alert.message = 'Entrepot modifié avec succès !';
            this.alert.type = 'success';
            setTimeout(() => (this.alert.isVisible = false), 2500);
          })
          .catch(() => {
            this.alert.isVisible = true;
            this.alert.message =
              'Une erreure est survenue lors de la modification !';
            this.alert.type = 'error';
            setTimeout(() => (this.alert.isVisible = false), 25000);
          });
      });
    }
  }

  onEditEntrepot(entrepot: Entrepot): void {
    this.entrepotForm.setValue({
      id: entrepot.id ? entrepot.id : '',
      libelle: entrepot.libelle ? entrepot.libelle : '',
      superficie: entrepot.superficie ? entrepot.superficie : '',
      placer: entrepot.placer ? entrepot.placer : '',
      longitude: entrepot.longitude ? entrepot.longitude : '',
      latitude: entrepot.latitude ? entrepot.latitude : '',
    });
  }

  onDeleteEntrepot(entrepotId?: any): void {
    // if (entrepotId) {
    //   this.entrepotservice.deleteEntrepot(entrepotId).catch(console.error);
    // } else {
    //   console.error('An id must be provided to delete an offer');
    // }

    const confirmModal = this.modalService.open(ModalConfirmComponent).result;

    confirmModal.then(() => {
      this.entrepotservice
        .deleteEntrepot(entrepotId)
        .then(() => {
          this.alert.isVisible = true;
          this.alert.message = 'Marque supprimée avec succès !';
          this.alert.type = 'success';
          setTimeout(() => (this.alert.isVisible = false), 2500);
        })
        .catch(() => {
          this.alert.isVisible = true;
          this.alert.message =
            'Une erreure est survenue lors de la suppression !';
          this.alert.type = 'error';
          setTimeout(() => (this.alert.isVisible = false), 25000);
        });
    });
  }

  reset() {
    this.entrepotForm.reset();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
