import { Component } from '@angular/core';
import { ShareableComponent } from '../shareable/shareable.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(private modalService: NgbModal) {}

  open() {
		const modalRef = this.modalService.open(ShareableComponent);
		modalRef.componentInstance.name = "name";
	}
}
