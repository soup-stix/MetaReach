import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-shareable',
  templateUrl: './shareable.component.html',
  styleUrls: ['./shareable.component.css']
})
export class ShareableComponent {
  @Input() name: string = "";
  url = window.location.href;
  
  constructor() {}

  ngOnInit() {}

  submit() {
    // this._snackBar.open("new project was added", "ok");
    // this.user.projects.push(this.formControl.value)
    console.log('url copied: ', this.url)
    
  }

  shareOnFacebook() {
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.url)}`;
    window.open(facebookShareUrl);
  }

  shareOnTwitter() {
    const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(this.url)}`;
    window.open(twitterShareUrl);
  }

  shareOnWhatsapp() {
    const twitterShareUrl = `https://wa.me?text=${encodeURIComponent(this.url)}`;
    window.open(twitterShareUrl);
  }

  shareOnInstagram() {
    const instagramUrl = `https://www.instagram.com/?url=${encodeURIComponent(this.url)}`;
    window.open(instagramUrl);
  }

}
