import {Component, OnInit} from "@angular/core";
import {NzModalService} from "ng-zorro-antd/modal";
import {TaskModalComponent} from "./task-modal/task-modal.component";
import {Tache} from "../../models/tache.model";
import {SousTraitant} from "../../models/sousTraitant.model";
import {Travailleur} from "../../models/travailleur.model";
import {TacheService} from "../../services/tache.service";
import {Router} from "@angular/router";
import {DatePipe} from "@angular/common";
import {ProcessusService} from "../../services/processus.service";
interface Task{
  tache : Tache,
  expand : boolean
}

@Component({
  selector: 'app-tasks-management',
  templateUrl: './tasks-management.component.html',
  standalone: false,
  styleUrl: './tasks-management.component.css'
})

export class TasksManagementComponent implements OnInit{
  isLoading:boolean = false;
  listOfMainTasks :Task[] = [];
  constructor(private modalService : NzModalService,
              private tacheService : TacheService,
              private processusService :ProcessusService,
              private router : Router,
              private datePipe: DatePipe) {
  }

  ngOnInit(): void {
    this.fetchMainTasks();
  }
  onAddTask(){
    const modalRef = this.modalService.create({
      nzCancelText: "Cancel",
      nzContent: TaskModalComponent,
      nzKeyboard: true,
      nzOkText: "Ok",
      nzOnCancel: () => {
        modalRef.close();
      },
      nzOnOk: () => {
        const modalComponentInst = modalRef.componentRef?.instance as TaskModalComponent;
        let formIsValid = modalComponentInst.taskForm.valid;

        //if form is valid then create the process
        if (formIsValid) {
          try {
            const formValue = modalComponentInst.taskForm.value;

            // Print the values of each form control
            console.log('Processus:', formValue.processus);
            console.log('Object of Task:', formValue.objectOfTask);
            console.log('Target Starting Date:', formValue.targetStartingDate);
            console.log('Expiration Date:', formValue.expirationDate);
            console.log('Agent:', formValue.agent);
            console.log('Sub-Contractor:', formValue.subContractor);
            console.log('Radio Choice:', formValue.radioChoice);

            let subcontractor: SousTraitant | null;
            let travailleurs: Travailleur[] = [];

            if (formValue.subContractor != undefined) {
              subcontractor = {
                idSousTraitant: formValue.subContractor,
                nom: '',
                tel: '',
                adresse: '',
                taches: []
              }
            } else {
              subcontractor = null;
              formValue.agent.forEach((matricule: string) => {
                travailleurs.push({
                  matricule: matricule,
                  prenom: '',
                  nom: '',
                  email: '',
                  numTel: '',
                  taches: []
                });
              })
            }
            const mainTask: Tache = {
              objetTache: formValue.objectOfTask,
              dateDebutPrevue: formValue.targetStartingDate.toISOString(),
              dateExpiration: formValue.expirationDate.toISOString(),
              sousTraitant: subcontractor,
              travailleurs: travailleurs
            }

            this.tacheService.createTacheMere(mainTask,formValue.processus)
              .subscribe(tache=>{
                this.modalService.success({
                  nzTitle : "Tasks created successfully !",
                  nzOnCancel : ()=>{
                    this.fetchMainTasks();
                  },
                  nzOnOk : ()=>{
                    this.fetchMainTasks();
                }
                })
              },error => {
                this.modalService.error({
                  nzTitle : "Registration error !",
                  nzContent : "Error during registration, please try again"
                })
              },()=>{
              })

            /*const process:Processus = {
              nom : <string>modalComponentInst.processForm.value.nom,
              description : <string><string>modalComponentInst.processForm.value.description,
              nbLignes : 3,
              nbColonnes : 3
            }
            this.processusService.saveProcessus(process)
              .subscribe(response=>{
                  /!*this.modalService.success({
                    nzTitle : "Processus enregistré !",
                  })*!/
                  this.processusService.processus = response;
                  this.router.navigate(['/workspace']);
                },
                error =>{
                  this.modalService.error({
                    nzTitle : "Registration error !",
                    nzContent : "Error during registration, please try again"
                  })
                })*/
          } catch (error) {
            console.error(error)
          }
        } else {
          Object.values(modalComponentInst.taskForm.controls).forEach(control => {
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
      nzTitle: 'Please fill in the informations about the task :',
      nzWidth: 550
    });
  }

  delete(idTache : number){
    const modal = this.modalService.confirm({
      nzTitle : 'Are you sure to delete this task ?',
      nzOkText : "Confirm",
      nzCancelText : "Cancel",
      nzOnOk : ()=>{
        this.tacheService.deleteTacheMere(idTache)
          .subscribe(responseData=>{
            this.modalService.success({
              nzTitle : "Task deleted successfully !"
            })
            this.fetchMainTasks();
          },error => {
            this.modalService.error({
              nzTitle : "Unable to delete the task !",
              nzContent : "Error during suppression, please try again"
            })
          })
      },
      nzOnCancel : ()=>{
        modal.close();
      }
    })
  }

  fetchMainTasks(){
    this.isLoading = true;
    this.listOfMainTasks = [];
    this.tacheService.retrieveAllTachesMere()
      //convert string to Date for all dates in maintasks and subTasks
      .subscribe(taches=>{
        taches.forEach(tache=>{
          // @ts-ignore
          tache.dateDebutPrevue = new Date(tache.dateDebutPrevue);
          // @ts-ignore
          tache.dateExpiration = new Date(tache.dateExpiration);
          tache.sous_taches?.forEach(sous_tache=>{
            // @ts-ignore
            sous_tache.dateDebutPrevue = new Date(sous_tache.dateDebutPrevue);
            // @ts-ignore
            sous_tache.dateExpiration = new Date(sous_tache.dateExpiration);
            if(sous_tache.dateDebutEffective){
              // @ts-ignore
              sous_tache.dateDebutEffective = new Date(sous_tache.dateDebutPrevue);
            }
            if(sous_tache.dateFinEffective){
              // @ts-ignore
              sous_tache.dateFinEffective = new Date(sous_tache.dateFinEffective);
            }
          })
        })
        this.listOfMainTasks = taches.map(tache => ({
          tache: tache,
          expand: false
        }));
        this.isLoading=false;
      },
        error => {
        console.error('Error at fetching Tasks from back-end '+error);
        })
  }

  viewSchema(idMainTask:number){
    if(idMainTask != -1){
      this.tacheService.getProcessByIdTacheMere(idMainTask)
        .subscribe(process=>{
          this.processusService.idMainTask=idMainTask;
          this.processusService.mode=2;
          this.processusService.processus = process;
          this.router.navigate(['/workspace']);
        },error => {
          this.modalService.error({
            nzTitle : "Error at getting Process Schema !",
            nzContent : "Process is not found, please try again"
          })
        })
    }
  }
}

