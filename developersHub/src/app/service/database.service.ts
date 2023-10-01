import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, deleteDoc, doc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  constructor(public fs: Firestore) { }

  getAllDevelopers() {
    let devs = collection(this.fs,'developers');
    return collectionData(devs);
  }

  addDeveloper() {
    const f = {"github":"soup-stix"};
		const collectionsInst = collection(this.fs,'developers');
		addDoc(collectionsInst, f).then(() => {
			console.log("sucess");
		})
		.catch((err) => {
			console.log(err);
		})
  }

  getDeveloper(id: string) {

  }

  deleteDeveloper(id:string) {
    let docRef = doc(this.fs,'developers/'+id);
    return deleteDoc(docRef);
  }

}
