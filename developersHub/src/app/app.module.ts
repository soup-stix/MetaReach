import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
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
    NgbCarouselModule
  ],
  providers: [DatabaseService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
