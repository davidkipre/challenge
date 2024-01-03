import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EntrepotService } from 'src/app/services/entrepot.service';

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.scss'],
})
export class ModalConfirmComponent implements OnInit {
  receive: any;
  constructor(
    public modal: NgbActiveModal,
    private entrepotService: EntrepotService
  ) {}
  ngOnInit(): void {
    this.entrepotService.getMessage1.subscribe((msg) => (this.receive = msg));
    this.entrepotService.getMessage2.subscribe((msg) => (this.receive = msg));
    this.entrepotService.getMessage3.subscribe((msg) => (this.receive = msg));
  }
}
