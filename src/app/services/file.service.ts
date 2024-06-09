import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

export class FileService{
  url : string = 'http://localhost:8100/files'


  constructor(private http: HttpClient) {}

  uploadFile(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(this.url, formData);
  }
}
