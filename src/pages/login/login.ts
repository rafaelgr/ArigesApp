import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ArigesDataProvider} from '../../providers/ariges-data/ariges-data';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  settings: any = null;
  loginForm: FormGroup;
  login: string = "";
  password: string = "";
  submitAttempt: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public localData: LocalDataProvider, public arigesData: ArigesDataProvider,
    public formBuilder: FormBuilder) {
    this.loginForm = formBuilder.group({
      login: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])]
    });
  }

  ionViewDidLoad() {
    this.localData.getSettings().then(data => {
      if (data) {
        this.settings = JSON.parse(data);
      } else {
        this.navCtrl.setRoot('SettingsPage');
      }
    });
  }

  doLogin(): void {
    this.submitAttempt = true;
    if (this.loginForm.valid) {
      this.arigesData.getLogin(this.settings.url, this.login, this.password)
      .subscribe(
        (data)=>{
          console.log("DATA: ", data);
        },
        (error)=>{
          console.log("ERROR: ", error);
        }
      );
    }
  }

  goHome(): void {
    this.navCtrl.setRoot('HomePage');
  }
}
