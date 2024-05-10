import {Component, OnInit} from '@angular/core';
import {
  NzTableComponent,
  NzThAddOnComponent
} from 'ng-zorro-antd/table';
import {NgForOf} from "@angular/common";
import {CdkDropListGroup} from "@angular/cdk/drag-drop";
import {GridComponent} from "../workspace/grid/grid.component";
import {ItemListComponent} from "../workspace/item-list/item-list.component";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzContentComponent, NzHeaderComponent, NzLayoutComponent, NzSiderComponent} from "ng-zorro-antd/layout";
import {Processus} from "../../models/processus.model";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {ProcessusService} from "../../services/processus.service";
import {NzModalService} from "ng-zorro-antd/modal";
import {ProcessusModalComponent} from "./processus-modal/processus-modal.component";
import {Router} from "@angular/router";


interface Person {
  key: string;
  name: string;
  age: number;
  address: string;
}
@Component({
  selector: 'app-processus',
  templateUrl: './processus.component.html',
  standalone: true,
  imports: [
    NgForOf,
    NzThAddOnComponent,
    NzTableComponent,
    CdkDropListGroup,
    GridComponent,
    ItemListComponent,
    NzButtonComponent,
    NzContentComponent,
    NzHeaderComponent,
    NzLayoutComponent,
    NzSiderComponent,
    NzIconDirective
  ],
  styleUrl: './processus.component.css'
})
export class ProcessusComponent implements OnInit{
  isLoading:boolean = false;

  ProcessList: Processus[] = [];

  constructor(private processusService: ProcessusService,
              private modalService : NzModalService,
              private router : Router) {
    this.fetchProcessus();
  }

  ngOnInit(): void {
  }

  onAddProcess(){
    const modalRef = this.modalService.create({
      nzTitle: 'Veuillez remplir les informations sur processus :',
      nzContent: ProcessusModalComponent,
      nzWidth : 550,
      nzOkText : "Confirmer",
      nzCancelText : "Annuler",
      nzKeyboard: true,
      nzOnOk :()=>{
        const modalComponentInst = modalRef.componentRef?.instance as ProcessusModalComponent;
        let formIsValid = modalComponentInst.processForm.valid;

        //if form is valid then create the process
        if(formIsValid){
          try
          {
            const process:Processus = {
              nom : <string>modalComponentInst.processForm.value.nom,
              description : <string><string>modalComponentInst.processForm.value.description,
              nbLignes : 3,
              nbColonnes : 3
            }
            this.processusService.saveProcessus(process)
              .subscribe(response=>{
                this.modalService.success({
                  nzTitle : "Processus enregistré !",
                })
                this.fetchProcessus();
              },
                error =>{
                this.modalService.error({
                  nzTitle : "Erreur d'enregistrement",
                  nzContent : "Erreur lors d'enregistrement, veuillez réessayer"
                })
            })
          } catch (error) {
            console.error(error);
          }
        }
        //return false if the form is not valid
        return formIsValid;
      },
      nzOnCancel:()=>{
        modalRef.close();
      }
    });
  }

  displayEditModal(processid:number){
    if(processid != -1){
      const process = this.ProcessList.find(process => process.idProcessus === processid);

      if(process){
        this.processusService.processusEdit.nom = process.nom;
        this.processusService.processusEdit.description = process.description;

        const modalRef = this.modalService.create({
          nzTitle: 'Informations sur le processus :',
          nzContent: ProcessusModalComponent,
          nzWidth : 550,
          nzOkText : "Confirmer",
          nzCancelText : "Annuler",
          nzKeyboard: true,
          nzOnOk :()=>{
            const modalComponentInst = modalRef.componentRef?.instance as ProcessusModalComponent;
            let formIsValid = modalComponentInst.processForm.valid;

            //if form is valid then create the process
            if(formIsValid){
              try
              {
                process.nom = <string>modalComponentInst.processForm.value.nom;
                process.description= <string>modalComponentInst.processForm.value.description;
                this.processusService.updateProcessus(process)
                  .subscribe(response=>{
                      this.modalService.success({
                        nzTitle : "Processus modifié avec succées !",
                      })
                      this.processusService.processusEdit.nom='';
                      this.processusService.processusEdit.description='';
                      this.fetchProcessus();
                    },
                    error =>{
                      this.modalService.error({
                        nzTitle : "Impossible de modifier le processus",
                        nzContent : "Erreur lors du modification, veuillez réessayer"
                      })
                      console.error(error);
                    })
              } catch (error) {
                console.error(error);
              }
            }
            //return false if the form is not valid
            return formIsValid;
          },
          nzOnCancel:()=>{
            this.processusService.processusEdit.nom='';
            this.processusService.processusEdit.description='';
            modalRef.close();
          }
        });
      }
      this.processusService.processusEdit.nom='';
      this.processusService.processusEdit.description='';
    }}

  delete(processId:number){
    if(processId != -1){
      this.modalService.warning({
        nzTitle : "Attention !",
        nzContent : "En supprimant, vous perdez toutes les informations du processus, voulez-vous toujours supprimer ?",
        nzWidth: 600,
        nzOnOk : ()=>{
          this.processusService.deleteProcessus(processId)
            .subscribe(responseData=>{
                this.modalService.success({
                  nzTitle : "Processus supprimé avec succées !"
                })
                this.fetchProcessus();
              },
              error =>{
                this.modalService.error({
                  nzTitle : "Impossible de supprimer le processus",
                  nzContent : "Erreur lors du suppresion, veuillez réessayer"
                })
              })
        },

      })
    }
  }

  fetchProcessus(){
    this.ProcessList = [];
    this.processusService.retrieveAllProcessus()
      .subscribe(processus=>{
          processus.forEach(process=>{
            this.ProcessList.push(process);
          })
        },
        error => {
          console.error("Error at fetching processus :"+error);
        }
        ,()=>{
        })
  }

  viewSchema(prcessId:number){
    if(prcessId != -1){
      const process = this.ProcessList.find(process=> process.idProcessus===prcessId);
      if(process){
        this.processusService.processus = process;
        this.router.navigate(['/workspace']);
      }
    }
  }

}
