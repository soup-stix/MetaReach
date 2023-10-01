import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
// firebase
import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
// Mat Lib Import
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatListModule} from '@angular/material/list';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatExpansionModule} from '@angular/material/expansion';
import {ClipboardModule} from '@angular/cdk/clipboard';
// Components
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
// Bootstrap Lib Import
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { UserComponent } from './user/user.component';
import { SignupComponent } from './signup/signup.component';
import { DatabaseService } from './service/database.service';
import { AddProjectComponent } from './add-project/add-project.component';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from './service/auth-service.service';
import { ShareableComponent } from './shareable/shareable.component';
import { CallbackComponent } from './callback/callback.component';
// firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA3jDGh3jnaaglZUT-cpy8NCn0AvueDW5M",
  authDomain: "developers-hub-f83f4.firebaseapp.com",
  projectId: "developers-hub-f83f4",
  storageBucket: "developers-hub-f83f4.appspot.com",
  messagingSenderId: "1022900626507",
  appId: "1:1022900626507:web:732ac18e44521ed6fc59ce"
};



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    UserComponent,
    CallbackComponent,
    SignupComponent,
    AddProjectComponent,
    ShareableComponent
  ],
  imports: [
    BrowserModule,
    FormsModule, 
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    NoopAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    MatSnackBarModule,
    MatExpansionModule,
    ClipboardModule,
    NgbModule,
    NgbCarouselModule,
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
  ],
  providers: [DatabaseService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
