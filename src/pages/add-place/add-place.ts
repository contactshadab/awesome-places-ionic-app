import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from 'ionic-angular';
import { SetLocationPage } from '../set-location/set-location';
import { Location } from '../../models/location';
import { Geolocation } from '@ionic-native/geolocation';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { Camera } from '@ionic-native/camera';
import { PlacesService } from '../../services/places';
import { leave } from '@angular/core/src/profile/wtf_impl';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { File, FileError, Entry } from '@ionic-native/file';

@Component({
  selector: 'page-add-place',
  templateUrl: 'add-place.html',
})
export class AddPlacePage {

  location: Location = {
    lat: 37.777054,
    lng: -122.394283
  }

  isLocationSet: boolean = false;
  imageUrl: string = '';

  constructor(private modalCtrl: ModalController, 
              private geolocation: Geolocation,
              private file: File,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private camera: Camera,
              private placesService: PlacesService,
              private navCtrl: NavController) {
  }

  onSubmit(form: NgForm){
    this.placesService.addPlace(form.value.title, form.value.description, this.location, this.imageUrl);
    form.reset();
    this.location = {
      lat: 37.777054,
      lng: -122.394283
    };
    this.isLocationSet = false;
    this.imageUrl = '';
    this.navCtrl.popToRoot();
  }

  onOpenMap(){
    const modal = this.modalCtrl.create(SetLocationPage, {location: this.location, isSet: this.isLocationSet});
    modal.present();
    modal.onDidDismiss(data => {
      if(data){
        this.location = data.location;
        this.isLocationSet = true;
      }
    })
  }

  onLocate(){
    const loading = this.loadingCtrl.create({
      content: 'Fetching your location...'
    })
    loading.present();
    this.geolocation.getCurrentPosition()
      .then(location => {
        loading.dismiss();
        this.location.lat = location.coords.latitude;
        this.location.lng = location.coords.longitude;
        this.isLocationSet = true;
      })
      .catch(error => {
        this.toastCtrl.create({
          message: 'Error fetching your location!',
          duration: 1500
        }).present();
      });
  }

  onOpencamera(){
    this.camera.getPicture({
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true
    })
    .then(imageData => {
      const currentName = imageData.replace(/^.*[\\\/]/, '');
      const currentPath = imageData.replace(/[^\/]*$/, '');
      const filename = (new Date()).getTime() + '.jpg';
      this.file.moveFile(currentPath, currentName, this.file.dataDirectory, filename)
        .then((data: Entry) => {
          this.imageUrl = data.nativeURL;
          this.camera.cleanup();
        })
        .catch((error: FileError) => {
          this.imageUrl = '';
          this.displayToast('Error copying file');
          this.camera.cleanup();
        })
    })
    .catch(error => {
      console.log(error);
      this.displayToast('Error taking picture');
    })
  }

  private displayToast(message: string){
    this.toastCtrl.create({
      message: message,
      duration: 5000
    }).present();
  }

}
