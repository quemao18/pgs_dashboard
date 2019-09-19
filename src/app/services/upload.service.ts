import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(
    private storage: AngularFireStorage
  ) { }

  //Tarea para subir archivo
  public taskCloudStorage(name: string, file: any) {
    return this.storage.upload(name, file);
  }

  //Referencia del archivo
  public refCloudStorage(name: string) {
    return this.storage.ref(name);
  }
}