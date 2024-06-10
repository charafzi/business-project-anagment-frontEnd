import {Component, OnInit} from '@angular/core';
import {Processus} from "../../models/processus.model";
import {ProcessusService} from "../../services/processus.service";
import {NzModalService} from "ng-zorro-antd/modal";
import {Router} from "@angular/router";
import {ProcessusModalComponent} from "./processus-modal/processus-modal.component";
import {NzMessageService} from "ng-zorro-antd/message";

@Component({
  selector: 'app-processus',
  templateUrl: './processus.component.html',
  standalone: false,
  styleUrl: './processus.component.css'
})
export class ProcessusComponent implements OnInit{
  isLoading:boolean = false;

  ProcessList: Processus[] = [];

  constructor(private processusService: ProcessusService,
              private modalService : NzModalService,
              private msg : NzMessageService,
              private router : Router) {
  }

  ngOnInit(): void {
    this.fetchProcessus();
  }

  onAddProcess(){
    const modalRef = this.modalService.create({
      nzTitle: 'Please fill in the informations about the process :',
      nzContent: ProcessusModalComponent,
      nzWidth : 550,
      nzOkText : "Confirm",
      nzCancelText : "Cancel",
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
                /*this.modalService.success({
                  nzTitle : "Processus enregistré !",
                })*/
                this.processusService.processus = response;
                this.router.navigate(['/workspace']);
              },
                error =>{
                this.msg.error('Error during registration, please try again')
            })
          } catch (error) {
            this.msg.error('Error during modification, please try again');
            console.error(error);
          }
        }else {
          Object.values(modalComponentInst.processForm.controls).forEach(control => {
            if (control.invalid) {
              control.markAsDirty();
              control.updateValueAndValidity({onlySelf: true});
            }
          });
          return false;
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
          nzTitle: 'Modify the informations about the process :',
          nzContent: ProcessusModalComponent,
          nzWidth : 550,
          nzOkText : "Confirm",
          nzCancelText : "Cancel",
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

                    this.msg.success('Process modified successfully');
                      this.processusService.processusEdit.nom='';
                      this.processusService.processusEdit.description='';
                      this.fetchProcessus();
                    },
                    error =>{
                    this.msg.error('Error during modification, please try again');
                      console.error(error);
                    })
              } catch (error) {
                this.msg.error('Error during modification, please try again');
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
      const modal = this.modalService.confirm({
        nzTitle : "Attention : By deleting, you lose all the information about the process including the schema!",
        nzContent : "Do you still want to delete?",
        nzWidth: 600,
        nzOkDanger : true,
        nzOkText :'Yes',
        nzCancelText : 'No',
        nzOnOk : ()=>{
          this.processusService.deleteProcessus(processId)
            .subscribe(responseData=>{
              this.msg.success('Process deleted successfully');
                this.fetchProcessus();
              },
              error =>{
              this.msg.error('Error during suppression, please try again');
              })
        },
        nzOnCancel : ()=>{
          modal.close();
        }

      })
    }
  }

  fetchProcessus(){
    this.isLoading = true;
    this.processusService.retrieveAllProcessus()
      .subscribe(processus=>{
          this.ProcessList = processus;
        },
        error => {
        this.msg.error('Error at fetching processes')
          console.error("Error at fetching processus :"+error);
        }
        ,()=>{
          this.isLoading=false;
        })
  }

  viewSchema(processId:number){
    if(processId != -1){
      const process = this.ProcessList.find(process=> process.idProcessus===processId);
      if(process){
        this.processusService.mode = 1;
        this.processusService.processus = process;
        this.router.navigate(['/workspace']);
      }
    }
  }

}
