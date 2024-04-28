import {BaseProcessItem} from "../items/processItem.class";
import {Connectable} from "rxjs";
import LeaderLine from "leader-line-new";

export abstract class AbstractConnection{
  protected constructor(
    private idFrom:string,
    private idTo:string,
    private baseProcessItemfrom:(BaseProcessItem | null),
    private baseProcessItemto:(BaseProcessItem | null),
    private connection:LeaderLine) {
  }

  getIdFrom(){
    return this.idFrom;
  }

  getIdTo(){
    return this.idTo;
  }

  getFrom(){
    return this.baseProcessItemfrom;
  }

  getTo(){
    return this.baseProcessItemto;
  }

  getLineConnection(){
    return this.connection;
  }

}

export class Connection extends AbstractConnection {
  constructor(
    idFrom:string,
    idTo:string,
    baseProcessItemfrom:(BaseProcessItem | null),
    baseProcessItemto:(BaseProcessItem | null),
    connection:LeaderLine) {
    super(idFrom, idTo, baseProcessItemfrom, baseProcessItemto,connection);
  }

}
