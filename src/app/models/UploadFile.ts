export class UploadFile {
  uid: string = '';
  name: string = '';
  size: number = 0;
  type: string = '';
  lastModified?: number;
  lastModifiedDate?: Date;
  url?: string;
  response?: any;
  status: 'error' | 'success' | 'done' | 'uploading' | 'removed' = 'done';
  percent: number = 0;
}

