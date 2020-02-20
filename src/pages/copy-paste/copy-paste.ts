import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Clipboard } from '@ionic-native/clipboard';

/**
 * Generated class for the CopyPastePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-copy-paste',
  templateUrl: 'copy-paste.html',
})
export class CopyPastePage {

  CopyTextAreaText:string = "Sample text to copy!";
  PasteTextAreaText:string = "Paste here!";

  constructor(public navCtrl: NavController, public navParams: NavParams, private  clipboard: Clipboard) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CopyPastePage');
    this.ejecuta();
  }

  ejecuta() {
    this.clipboard.copy('Hello world');

    this.clipboard.paste().then(
       (resolve: string) => {
          alert(resolve);
        },
        (reject: string) => {
          alert('Error: ' + reject);
        }
      );
    
    this.clipboard.clear();
  }

}
