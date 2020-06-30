import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataProvider} from '../../providers/local-data/local-data';


@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  settings:any = { 
    url: "",
    url_docs: "" 
  };
  settingsForm: FormGroup;
  submitAttempt: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public formBuilder: FormBuilder, public localDataProvider: LocalDataProvider) {
    this.settingsForm = formBuilder.group({
      url: ['', Validators.compose([Validators.required])]
    });
  }

  ionViewDidLoad() {
    this.localDataProvider.getSettings().then(data => {
      if (data) {
        this.settings = JSON.parse(data);
      }
    });
  }

  goHome(): void {
    this.navCtrl.setRoot('HomePage');
  }

  saveSettings(): void {
    this.submitAttempt = true;
    if (this.settingsForm.valid){
      this.localDataProvider.saveSettings(this.settings);
      this.navCtrl.setRoot('HomePage');
    }
  }

  exit(): void {
    this.navCtrl.setRoot('HomePage');
  }
}
