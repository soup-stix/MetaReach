import { Component } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SignupComponent } from '../signup/signup.component';
import { DatabaseService } from '../service/database.service';
import { doc, setDoc } from "firebase/firestore"; 
import { Firestore, collection, addDoc, collectionData } from '@angular/fire/firestore';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { AuthService } from '../service/auth-service.service';

const firebaseConfig = {

	apiKey: "AIzaSyA3jDGh3jnaaglZUT-cpy8NCn0AvueDW5M",
  
	authDomain: "developers-hub-f83f4.firebaseapp.com",
  
	projectId: "developers-hub-f83f4",
  
	storageBucket: "developers-hub-f83f4.appspot.com",
  
	messagingSenderId: "1022900626507",
  
	appId: "1:1022900626507:web:732ac18e44521ed6fc59ce"
  
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [NgbCarouselConfig, DatabaseService],
})
export class HomeComponent {
    showNavigationArrows = false;
    showNavigationIndicators = false;
    images = [`https://picsum.photos/id/1055/900/500`, `https://img.freepik.com/free-vector/hand-drawn-web-developers_23-2148819604.jpg?size=626&ext=jpg`, `https://picsum.photos/id/194/900/500`];
    value = '';
	constructor(private authService: AuthService, config: NgbCarouselConfig, private modalService: NgbModal, private service: DatabaseService, private firestore: Firestore) {
		// customize default values of carousels used by this component tree
		config.showNavigationArrows = true;
		config.showNavigationIndicators = true;
	}

	loginWithGithub(): void {
		window.location.href = this.authService.getGithubLoginUrl();
	  }

	ngOnInit() {
		this.getAllDevelopers();
	}

	getAllDevelopers() {
		const devs = collection(this.firestore,'test');
		collectionData(devs).subscribe(val => {
			console.log(val);
		})
	  }

	async addDevelopers(){
		const f = {"github":"soup-stix"};
		await setDoc(doc(db, "test", "LA"), {
			name: "Los Angeles",
			state: "CA",
			country: "USA"
		  });
		// const collectionsInst = collection(this.firestore,'developers').doc("LA").set({
		// 	name: "Los Angeles",
		// 	state: "CA",
		// 	country: "USA"
		// })
		// collection(this.firestore,'developers');
		// addDoc(collectionsInst, f).then(() => {
		// 	console.log("sucess");
		// })
		// .catch((err) => {
		// 	console.log(err);
		// })
	}


	open() {
		const modalRef = this.modalService.open(SignupComponent);
		modalRef.componentInstance.prefilled = {};
		modalRef.componentInstance.update = false;
	}
}
