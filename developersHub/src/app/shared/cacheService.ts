import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private secretKey = environment.cacheKey; 

  encryptData(data: any): string {
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), this.secretKey).toString();
    return encryptedData;
  }

  decryptData(encryptedData: string): any {
    const decryptedData = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
    const decryptedString = decryptedData.toString(CryptoJS.enc.Utf8);

    if (decryptedString) {
      return JSON.parse(decryptedString);
    }
    return null;
  }

  setData(data: any) {
    console.log("set data: ", data)
    const encryptedData = this.encryptData(data);
    localStorage.setItem('userData', encryptedData);
  }

  getData(): any {
    const encryptedData = localStorage.getItem('userData');
    console.log("enc local dta: ",encryptedData);
    if (encryptedData) {
      return this.decryptData(encryptedData);
    }
    return null;
  }

  clearData() {
    localStorage.removeItem('userData');
  }

  clearAllData() {
    localStorage.clear();
  }
}