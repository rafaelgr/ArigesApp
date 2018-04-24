import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public geoLocation: Geolocation, 
    public viewCtrl: ViewController, public localData: LocalDataProvider, public interData: InterDataProvider, 
    public arigesData: ArigesDataProvider,) {
  }

  ionViewDidLoad(){
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

  loadMap(){
    
    var latLng = new google.maps.LatLng(0, 0);

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
  }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
          console.log('exito');
          map.setCenter(results[0].geometry.location);
          var marker = new google.maps.Marker({
              map: map,
              position: results[0].geometry.location
          });
      } else {
          alert('Geocode was not successful for the following reason: ' + status);
      }
  });
  }

  dismiss() {
      this.viewCtrl.dismiss();
    
  }


}
