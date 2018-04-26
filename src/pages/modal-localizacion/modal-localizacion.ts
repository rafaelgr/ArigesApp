import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';


import { LocalDataProvider } from '../../providers/local-data/local-data';
import { InterDataProvider } from '../../providers/inter-data/inter-data';
import { ArigesDataProvider } from '../../providers/ariges-data/ariges-data';

declare var google;

/**
 * Generated class for the ModalLocalizacionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-localizacion',
  templateUrl: 'modal-localizacion.html',
})
export class ModalLocalizacionPage {
  settings: any = [];
  cliente: any = {};

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public viewCtrl: ViewController, public localData: LocalDataProvider, public interData: InterDataProvider, 
    public arigesData: ArigesDataProvider, public alertCrtl: AlertController) {
      
  }

  ionViewWillEnter(){
    this.localData.getSettings().then(data => {
      if (data) {
        this.settings = JSON.parse(data);
        if (!this.settings.user) {
          this.navCtrl.setRoot('LoginPage');
        } else {
          this.loadData();
        }
      } else {
        this.navCtrl.setRoot('SettingsPage');
      }
    });
  }

  loadData(): void {
    this.cliente = this.interData.getCliente();
    this.loadMap();
  }

  loadMap(): void{
    
    var latLng = new google.maps.LatLng(0, 0);
    var estado = 0;

    let mapOptions = {
      center: latLng,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    var map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    var address = this.cliente.domclien +
                " (" + this.cliente.codpobla + ")" +
                " " + this.cliente.pobclien +
                " " + this.cliente.proclien;

    var geocoder = new google.maps.Geocoder();

    geocoder.geocode({
      'address': address
  }, (results, status) =>{
      if (status == google.maps.GeocoderStatus.OK) {
          map.setCenter(results[0].geometry.location);
          var marker = new google.maps.Marker({
              map: map,
              position: results[0].geometry.location
          });
      } else {
        this.showError(status)
      }
  });
  }

  dismiss() {
      this.viewCtrl.dismiss();
    
  }

  showError(status): void {
    var titulo = 'No se ha podido geolocalizar la dirección'
    if (status == 'ZERO_RESULTS') {
      let alert = this.alertCrtl.create({
        title: titulo,
        subTitle: JSON.stringify(status, null, 4),
        buttons: ['OK']
      });
      alert.present();
    } else {
      let alert = this.alertCrtl.create({
        title: "Se ha producido el siguiente error",
        subTitle: JSON.stringify(status, null, 4),
        buttons: ['OK']
      });
      alert.present();
    }
   
    
  }


}
