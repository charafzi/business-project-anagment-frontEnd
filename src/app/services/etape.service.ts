import {Injectable} from "@angular/core";
import {BaseEtape} from "../pages/workspace/items/Etape.class";

@Injectable({
  providedIn : 'root'
})

export class EtapeService{
  processItems:(BaseEtape | null)[][] = [];

  printProcessItems()
  {
    for(let i=0; i<this.processItems.length; i++)
    {
      for(let j=0;j<this.processItems[i].length;j++)
      {
        console.log("FIRST ::: "+this.processItems[i][j]?.first)
      }
    }
  }

  checkFirstExists(indexRow:number,indexCol:number):boolean
  {
    for(let i=0; i<this.processItems.length; i++)
    {
      for(let j=0;j<this.processItems[i].length;j++)
      {
        if(this.processItems[i][j] && this.processItems[i][j]?.first)
        {
          return true;
        }
      }
    }
    return false;
  }

  checkEndExists(indexRow:number,indexCol:number):boolean
  {
    for(let i=0; i<this.processItems.length; i++)
    {
      for(let j=0;j<this.processItems[i].length;j++)
      {
        if(this.processItems[i][j] && this.processItems[i][j]?.end){
          return true;
        }
      }
    }
    return false;
  }

}
