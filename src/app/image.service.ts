import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface ImageInfo {
                     title: string;
                     description: string;
                     link: string;
}

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private url = 'https://api.imgur.com/3/image';
  
  constructor(private http: HttpClient) {}

  async uploadImage(imageFile: File, infoObject: {}) {
    const formData = new FormData();
    formData.append('image', imageFile, imageFile.name);

    const header = new HttpHeaders({
      authorization:  'Client-ID bcebebe5e5c2876',
    });

    return  await this.http.post(this.url, formData, { headers: header }).toPromise();

    

  }

}
