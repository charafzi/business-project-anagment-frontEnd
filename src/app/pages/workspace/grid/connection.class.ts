import {BaseEtape} from "../items/Etape.class";
import LinkerLine from "linkerline";

export abstract class AbstractConnection{
  protected constructor(
    private _idFrom:string,
    private _idTo:string,
    private _baseProcessItemfrom:(BaseEtape | null),
    private _baseProcessItemto:(BaseEtape | null),
    private _connection:LinkerLine<any, any>) {
  }

  getIdFrom(){
    return this._idFrom;
  }

  getIdTo(){
    return this._idTo;
  }

  getFrom(){
    return this._baseProcessItemfrom;
  }

  getTo(){
    return this._baseProcessItemto;
  }

  getLineConnection(){
    return this._connection;
  }


  setIdFrom(value: string) {
    this._idFrom = value;
  }

  setIdTo(value: string) {
    this._idTo = value;
  }

  setFrom(value: BaseEtape | null) {
    this._baseProcessItemfrom = value;
  }

  setTo(value: BaseEtape | null) {
    this._baseProcessItemto = value;
  }

  setConnection(value: LinkerLine<any, any>) {
    this._connection = value;
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

export class ConnectionSet{
  private _connections : Connection[] = [];

  constructor() {
  }

  add(con : Connection):void{
    let found = this._connections.find(connection=> connection.getIdFrom()===con.getIdFrom()
      && connection.getIdTo()===con.getIdTo())
    if(found == undefined)
      this._connections.push(con);
  }

  foundConnection(idFrom:string,idTo:string){
    return this._connections.find(connection=> connection.getIdFrom()===idFrom
      && connection.getIdTo()===idTo)
  }

  remove(con:Connection):void{
    let index = this._connections.findIndex((connection, index)=> connection.getIdFrom()===con.getIdFrom()
      && connection.getIdTo()===con.getIdTo())

      if(index != -1)
        this._connections.splice(index,1);
  }

  getConnectionByIndexAtGrid(rowIndex:number,colIndex:number): Connection|undefined{

  let connection = this._connections.find(con=>
    (con.getFrom()?.indexLigne === rowIndex && con.getFrom()?.indexColonne === colIndex) ||
    (con.getTo()?.indexLigne === rowIndex && con.getTo()?.indexColonne === colIndex)
  );
    return connection;
  }

  print():void{
    this._connections.forEach(con=>{
      console.log("HTML IDs :",con.getIdFrom(),"->",con.getIdTo());
      console.log("Etapes IDs :",con.getFrom()?.idEtape,"->",con.getTo()?.idEtape);
    })
  }


  get connections(): Connection[] {
    return this._connections;
  }

  set connections(value: Connection[]) {
    this._connections = value;
  }

  clear(){
    this._connections=[];
  }
}
