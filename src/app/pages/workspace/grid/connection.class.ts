import {BaseEtape} from "../items/Etape.class";
import {Connectable} from "rxjs";
import LeaderLine from "leader-line-new";
import LinkerLine from "linkerline";

export abstract class AbstractConnection{
  protected constructor(
    private idFrom:string,
    private idTo:string,
    private baseProcessItemfrom:(BaseEtape | null),
    private baseProcessItemto:(BaseEtape | null),
    private connection:LinkerLine<any, any>) {
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
    baseProcessItemfrom:(BaseEtape | null),
    baseProcessItemto:(BaseEtape | null),
    connection:LinkerLine<any, any>) {
    super(idFrom, idTo, baseProcessItemfrom, baseProcessItemto,connection);
  }

}
