import {Component, OnInit} from "@angular/core";
import {NzModalService} from "ng-zorro-antd/modal";
import {TaskModalComponent} from "./task-modal/task-modal.component";
import {Tache} from "../../models/tache.model";
import {SousTraitant} from "../../models/sousTraitant.model";
import {Travailleur} from "../../models/travailleur.model";
import {TacheService} from "../../services/tache.service";
import {Router} from "@angular/router";
import {ProcessusService} from "../../services/processus.service";
import {DurationUnite} from "../../models/DurationUnite";
import {TaskEditModalComponent} from "./task-edit-modal/task-edit-modal.component";
import {NzMessageService} from "ng-zorro-antd/message";
import {UserService} from "../../services/user.service";

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
  userRole : string = '';
  constructor(private modalService : NzModalService,
              private tacheService : TacheService,
              private processusService :ProcessusService,
              private router : Router,
              private msg : NzMessageService,
              protected userService : UserService
  ) {
  }

  ngOnInit(): void {
    // subscribing here to always ensure getting user role because we will fetch tasks based on role
    this.userService.getUserById(this.userService.userId)
      .subscribe(user=>{
        this.userService.user = user;
        this.fetchMainTasks();
      },
        error=>{
        this.msg.error('Error at getting userId');
        console.error(error)
    })
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

           /* console.log('Processus:', formValue.processus);
            console.log('Object of Task:', formValue.objectOfTask);
            console.log('Target Starting Date:', formValue.targetStartingDate);
            console.log('Expiration Date:', formValue.expirationDate);
            console.log('Agent:', formValue.agent);
            console.log('Sub-Contractor:', formValue.subContractor);
            console.log('Radio Choice:', formValue.radioChoice);*/

            let subcontractor: SousTraitant | null;
            let travailleurs: Travailleur[] = [];

            if (formValue.subContractor != undefined) {
              subcontractor = {
                idUser: formValue.subContractor,
                nom : '',
                adresse: '',
                email : '',
                numTel : '',
                prenom : '',
                role : '',
                taches: []
              }
            } else {
              subcontractor = null;
              formValue.agent.forEach((idUser: number) => {
                travailleurs.push({
                  idUser : idUser,
                  matricule: '',
                  nom : '',
                  email : '',
                  numTel : '',
                  prenom : '',
                  role : '',
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
                this.msg.success('Tasks created successfully');
                this.fetchMainTasks();
              },error => {
                this.modalService.error({
                  nzTitle : "Registration error !",
                  nzContent : "Error during registration, please try again"
                })
              },()=>{
              })

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
      nzOkDanger : true,
      nzOkText : "Yes",
      nzCancelText : "No",
      nzOnOk : ()=>{
        this.tacheService.deleteTacheMere(idTache)
          .subscribe(responseData=>{
            this.msg.success('Tasks deleted successfully');
            this.fetchMainTasks();
          },error => {
            this.msg.error('Error during suppression, please try again');
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
    if(['Responsible','Teamleader'].includes(this.userService.getRole())){
      this.tacheService.retrieveAllTachesMere()
        //convert string to Date for all dates in maintasks and subTasks
        .subscribe(taches=>{
            taches.forEach(tache=>{
              if(tache.dateDebutEffective){
                // @ts-ignore
                let hoursDiff:number = (new Date() - tache.dateDebutEffective)
                let percentage:number = 0;

                switch (tache.etape?.dureeEstimeeUnite){
                  case DurationUnite.HOUR:
                    percentage = (hoursDiff)/tache.etape.dureeEstimee;
                    break;
                  case DurationUnite.DAY:
                    percentage = (hoursDiff)/ (tache.etape.dureeEstimee * 24);
                    break;
                  case DurationUnite.MONTH:
                    percentage = (hoursDiff)/ (tache.etape.dureeEstimee * 24 * 30);
                    break;
                }
                percentage = percentage>1 ? 1 : percentage;
                tache.pourcentage = percentage;
              }
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
            console.error('Error at fetching Tasks from back-end :'+error);
          })
    }else if(['Agent'].includes(this.userService.getRole())){
      this.tacheService.retrieveAllTachesMereByAgent(this.userService.userId)
        .subscribe(taches=>{
            taches.forEach(tache=>{
              if(tache.dateDebutEffective){
                // @ts-ignore
                let hoursDiff:number = (new Date() - tache.dateDebutEffective)
                let percentage:number = 0;

                switch (tache.etape?.dureeEstimeeUnite){
                  case DurationUnite.HOUR:
                    percentage = (hoursDiff)/tache.etape.dureeEstimee;
                    break;
                  case DurationUnite.DAY:
                    percentage = (hoursDiff)/ (tache.etape.dureeEstimee * 24);
                    break;
                  case DurationUnite.MONTH:
                    percentage = (hoursDiff)/ (tache.etape.dureeEstimee * 24 * 30);
                    break;
                }
                percentage = percentage>1 ? 1 : percentage;
                tache.pourcentage = percentage;
              }
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
            console.error('Error at fetching Tasks from back-end :'+error);
          })
    }else if(['Subcontractor'].includes(this.userService.getRole())){
      this.tacheService.retrieveAllTachesMereBySubcontractor(this.userService.userId)
        .subscribe(taches=>{
            taches.forEach(tache=>{
              if(tache.dateDebutEffective){
                // @ts-ignore
                let hoursDiff:number = (new Date() - tache.dateDebutEffective)
                let percentage:number = 0;

                switch (tache.etape?.dureeEstimeeUnite){
                  case DurationUnite.HOUR:
                    percentage = (hoursDiff)/tache.etape.dureeEstimee;
                    break;
                  case DurationUnite.DAY:
                    percentage = (hoursDiff)/ (tache.etape.dureeEstimee * 24);
                    break;
                  case DurationUnite.MONTH:
                    percentage = (hoursDiff)/ (tache.etape.dureeEstimee * 24 * 30);
                    break;
                }
                percentage = percentage>1 ? 1 : percentage;
                tache.pourcentage = percentage;
              }
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
            console.error('Error at fetching Tasks from back-end :'+error);
          })

    }
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

  dislplayEditModal(tacheMereId:number){
    if(tacheMereId != -1){
      const tacheMere = this.listOfMainTasks.find(tache => tache.tache.idTache === tacheMereId);
      if(tacheMere){
        this.tacheService.tacheEdit.idTache = tacheMere.tache.idTache;
        this.tacheService.tacheEdit.objetTache = tacheMere.tache.objetTache;
        this.tacheService.tacheEdit.dateDebutPrevue = tacheMere.tache.dateDebutPrevue;
        this.tacheService.tacheEdit.dateExpiration = tacheMere.tache.dateExpiration;
        this.tacheService.tacheEdit.travailleurs = tacheMere.tache.travailleurs;
        this.tacheService.tacheEdit.sousTraitant = tacheMere.tache.sousTraitant;
        this.tacheService.tacheEdit.sous_taches = tacheMere.tache.sous_taches;

        const modalRef = this.modalService.create({
          nzTitle: 'Modify the information about the task :',
          nzContent: TaskEditModalComponent,
          nzWidth : 550,
          nzOkText : "Confirm",
          nzCancelText : "Cancel",
          nzKeyboard: true,
          nzOnOk :()=>{
            const modalComponentInst = modalRef.componentRef?.instance as TaskEditModalComponent;
            let formIsValid = modalComponentInst.taskEditForm.valid;

            //if form is valid then create the process
            if(formIsValid){
              try {
                let targetStartingDateDisabled = modalComponentInst.taskEditForm.get('targetStartingDate')?.disabled;
                tacheMere.tache.dateExpiration = modalComponentInst.taskEditForm.value.expirationDate;

                if(tacheMere.tache.dateExpiration){
                  if(targetStartingDateDisabled){
                    this.tacheService.updateTacheMereDateExpiration(tacheMere.tache)
                      .subscribe(response=>{
                        this.msg.success('Expiration date modified successfully');
                          this.resetEditTask();
                          this.fetchMainTasks();
                        },
                        error =>{
                        this.msg.error('Error during modification, please try again');
                          console.error(error);
                        })
                  }
                  else{
                    tacheMere.tache.objetTache = modalComponentInst.taskEditForm.value.objectOfTask;
                    tacheMere.tache.dateDebutPrevue = modalComponentInst.taskEditForm.value.targetStartingDate;
                    let subcontractor: SousTraitant | null;
                    let travailleurs: Travailleur[] = [];


                    if (modalComponentInst.taskEditForm.value.subContractor && modalComponentInst.taskEditForm.value.subContractor!= -1) {
                      subcontractor = {
                        idUser: modalComponentInst.taskEditForm.value.subContractor ,
                        nom : '',
                        adresse: '',
                        email : '',
                        numTel : '',
                        prenom : '',
                        role : '',
                        taches: []
                      }
                    } else {
                      subcontractor = null;
                      if(modalComponentInst.taskEditForm.value.agent){
                        modalComponentInst.taskEditForm.value.agent.forEach((idUser: number) => {
                          travailleurs.push({
                            idUser : idUser,
                            matricule : '',
                            nom : '',
                            email : '',
                            numTel : '',
                            prenom : '',
                            role : '',
                            taches: []
                          });
                        })
                      }
                    }

                    tacheMere.tache.travailleurs = travailleurs;
                    tacheMere.tache.sousTraitant = subcontractor;


                    this.tacheService.updateTacheMere(tacheMere.tache)
                      .subscribe(response=>{
                        this.msg.success('Task modified successfully');
                          this.resetEditTask();
                          this.fetchMainTasks();
                        },
                        error =>{
                        this.msg.error('Error during modification, please try again');
                          console.error(error);
                        })
                  }
                }else
                  throw new Error("Date expiration undefined !");
              } catch (error) {
                this.msg.error('Error during modification, please try again')
                console.error(error);
              }
            }
            //return false if the form is not valid
            return formIsValid;
          },
          nzOnCancel:()=>{
            this.resetEditTask();
            modalRef.close();
          }
        });
      }
      this.resetEditTask();
    }

  }

  resetEditTask(){
    this.tacheService.tacheEdit.idTache = -1;
    this.tacheService.tacheEdit.objetTache = '';
    this.tacheService.tacheEdit.dateDebutPrevue = undefined;
    this.tacheService.tacheEdit.dateFinEffective = undefined;
    this.tacheService.tacheEdit.travailleurs = [];
    this.tacheService.tacheEdit.sousTraitant = null;
    this.tacheService.tacheEdit.sous_taches = [];
  }

  protected readonly Math = Math;
}

