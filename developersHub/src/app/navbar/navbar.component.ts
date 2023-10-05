import { Component } from '@angular/core';
import { ShareableComponent } from '../shareable/shareable.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CacheService } from '../shared/cacheService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  user: string = this.cache.getData() ? this.cache.getData().username : "guest";

  constructor(private router: Router, private cache:CacheService,private modalService: NgbModal) {}

  OnInit() {
    if (this.cache.getData()){
      console.log("cache data from nav:", this.cache.getData())
      this.user = this.cache.getData().username;
    }
  }

  logout(){
    this.cache.clearAllData();
    // window.location.href = "http://localhost:4200/"
    this.router.navigate(['']);
  }
  
  open() {
		const modalRef = this.modalService.open(ShareableComponent);
		modalRef.componentInstance.name = "name";
	}
}
