import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class apiHttpJsonService {

  private apiUrlLocal = 'http://localhost:3000';

  private apiUrlCloud = 'http://localhost:3000';  // https://json-server-growdlending.herokuapp.com

  constructor(private http: HttpClient) { }


  public countItems(objectInscription){

    let url = '';

    if (objectInscription.typeCompteInscription === '1'){

      url = this.apiUrlCloud + '/administrator';

     }

    if (objectInscription.typeCompteInscription === '2'){

      url = this.apiUrlCloud + '/company_owner';

     }

    if (objectInscription.typeCompteInscription === '3'){

         url = this.apiUrlCloud + '/investor';

     }

    return this.http.get(url);

  }


   public identificationUser(objectConnection){

    let url = '';

    if (objectConnection.typeCompteLogin === '1'){

        url = this.apiUrlCloud + '/administrator?login=' + objectConnection.emailLogin + '&password=' + objectConnection.passwordLogin;

    }

    if (objectConnection.typeCompteLogin === '2'){

        url = this.apiUrlCloud + '/company_owner?login=' + objectConnection.emailLogin + '&password=' + objectConnection.passwordLogin;

    }

    if (objectConnection.typeCompteLogin === '3'){

        url = this.apiUrlCloud + '/investor?login=' + objectConnection.emailLogin + '&password=' + objectConnection.passwordLogin;

    }

    return this.http.get(url);


  }

  public inscriptionUser(objectInscription){

    let url = '';

    let params = {};

    if (objectInscription.typeCompteInscription === '1'){

        url = this.apiUrlCloud + '/administrator';

        params = {
                 id : objectInscription.id,
                 nom : objectInscription.nomInscription,
                 prenom : objectInscription.prenomInscription,
                 login : objectInscription.emailInscription,
                 password : objectInscription.passwordInscription,
                 sex : objectInscription.sex,
                 photoUser : objectInscription.photoUser,
                 dateNaissance : objectInscription.dateNaissance,
                 date_created: objectInscription.date_created,
                 date_update: objectInscription.date_update
            };

     }

    if (objectInscription.typeCompteInscription === '2'){

        url = this.apiUrlCloud + '/company_owner';

        params = {
                id : objectInscription.id,
                nom : objectInscription.nomInscription,
                prenom : objectInscription.prenomInscription,
                login : objectInscription.emailInscription,
                password : objectInscription.passwordInscription,
                sex : objectInscription.sex,
                photoUser : objectInscription.photoUser,
                dateNaissance : objectInscription.dateNaissance,
                date_created: objectInscription.date_created,
                date_update: objectInscription.date_update
         };

      }

    if (objectInscription.typeCompteInscription === '3'){

        url = this.apiUrlCloud + '/investor';

        params = {
                  id : objectInscription.id,
                  nom : objectInscription.nomInscription,
                  prenom : objectInscription.prenomInscription,
                  login : objectInscription.emailInscription,
                  password : objectInscription.passwordInscription,
                  sex : objectInscription.sex,
                  photoUser : objectInscription.photoUser,
                  dateNaissance : objectInscription.dateNaissance,
                  date_created: objectInscription.date_created,
                  date_update: objectInscription.date_update
         };

       }

    return this.http.post(url, params);


  }

  public getDataInfosProfil(idProfil, statutProfil){






  }

  public updateProfilUser(objectUpdate){

    let url = '';

    let params = {};

    if (objectUpdate.typeCompte === '1'){

        url = this.apiUrlCloud + '/administrator/' + objectUpdate.id;

        params = {
                 id : objectUpdate.id,
                 nom : objectUpdate.nom,
                 prenom : objectUpdate.prenom,
                 login : objectUpdate.login,
                 password : objectUpdate.password,
                 sex : objectUpdate.sex,
                 photoUser : objectUpdate.photoUser,
                 dateNaissance : objectUpdate.dateNaissance,
                 date_created: objectUpdate.date_created,
                 date_update: objectUpdate.date_update

     };

    }
    if (objectUpdate.typeCompte === '2'){

        url = this.apiUrlCloud + '/company_owner/' + objectUpdate.id;

        params = {
                id : objectUpdate.id,
                nom : objectUpdate.nom,
                prenom : objectUpdate.prenom,
                login : objectUpdate.login,
                password : objectUpdate.password,
                sex : objectUpdate.sex,
                photoUser : objectUpdate.photoUser,
                dateNaissance : objectUpdate.dateNaissance,
                date_created: objectUpdate.date_created,
                date_update: objectUpdate.date_update
         };

      }

    if (objectUpdate.typeCompte === '3'){

        url = this.apiUrlCloud + '/investor/' + objectUpdate.id;

        params = {
                  id : objectUpdate.id,
                  nom : objectUpdate.nom,
                  prenom : objectUpdate.prenom,
                  login : objectUpdate.login,
                  password : objectUpdate.password,
                  sex : objectUpdate.sex,
                  photoUser : objectUpdate.photoUser,
                  dateNaissance : objectUpdate.dateNaissance,
                  date_created: objectUpdate.date_created,
                  date_update: objectUpdate.date_update
         };

       }

    return this.http.put(url, params);


  }

  public addProjectByCompanyOwner(objectProject){

    const url = this.apiUrlCloud + '/projectsCompanyOwner';


    return this.http.post(url, objectProject);

  }

  public addImageProject(objectImage){

    const url = this.apiUrlCloud + '/imagesProjects';


    return this.http.post(url, objectImage);

  }

  listProjectByCompanyOwner(company_ownerId){

    const url = this.apiUrlCloud + '/projectsCompanyOwner?company_ownerId=' + company_ownerId;

    return this.http.get(url);

  }

  getListCategorieProject(){

    const url = this.apiUrlCloud + '/categorie_project';

    return this.http.get(url);

  }

  getCategorieProject(idCategorieProject){

    const url = this.apiUrlCloud + '/categorie_project/' + idCategorieProject;

    return this.http.get(url);
  }

  getAllImagesByIdProject(idProject){


    const url = this.apiUrlCloud + '/imagesProjects?projectsCompanyOwnerId=' + idProject;

    return this.http.get(url);
  }

  deleteImagesByProject(idImage){

    const url = this.apiUrlCloud + '/imagesProjects/' + idImage;

    return this.http.delete(url);
  }

  deleteProject(idProject){

    const url = this.apiUrlCloud + '/projectsCompanyOwner/' + idProject;

    return this.http.delete(url);

  }

  listAllProjects(){

    const url = this.apiUrlCloud + '/projectsCompanyOwner';

    return this.http.get(url);

  }

  listAllProjectsFromVisitor(){

    // liste des projects valid

    const url = this.apiUrlCloud + '/projectsCompanyOwner?valid_project=1';

    return this.http.get(url);

  }

  getProjectById(idProject){

    const url = this.apiUrlCloud + '/projectsCompanyOwner/' + idProject;

    return this.http.get(url);

  }

  getPorteProjectById(idPorteProject){

    const url = this.apiUrlCloud + '/portes_project/' + idPorteProject;

    return this.http.get(url);

  }

  getInfosCompanyOwner(idCompanyOwner){

    const url = this.apiUrlCloud + '/company_owner/' + idCompanyOwner;

    return this.http.get(url);

  }

  updateDataProjet(objectUpdateProject){


   const  url = this.apiUrlCloud + '/projectsCompanyOwner/' + objectUpdateProject.id ;

   return this.http.put(url, objectUpdateProject);

   }

   /**************************** composant admin /compnay-owner****************************************** */

   getListQuestionReponsesByAdminForCompanyOwner(idAdmin, idCompanyOwner, idProject){

    // liste des commaitaires envoye par admin vers company-owner

    const url = this.apiUrlCloud + '/questionsAide?destId=' + idCompanyOwner + '&expdId=' + idAdmin + '&idProject=' + idProject + '&typeComtpteExp=admin&typeCompteDest=company_owner' ;

    return this.http.get(url);

   }

   getListQuestionReponsesByCompanyOwnerForManager(idCompanyOwner, idAdmin, idProject){

    // liste des commaitaires envoye par company-owner vers admin

    const url = this.apiUrlCloud + '/questionsAide?destId=' + idAdmin + '&expdId=' + idCompanyOwner + '&idProject=' + idProject + '&typeComtpteExp=company_owner&typeCompteDest=admin' ;


    return this.http.get(url);

   }

   saveQuestionReponsesByAdminForCompanyOwner(objectQuestion){

    const url = this.apiUrlCloud + '/questionsAide' ;

    return this.http.post(url, objectQuestion);

   }

   /**************************** composant Investor /compnay-owner****************************************** */

   getListQuestionReponsesByInvestorForCompanyOwner(idInvestor, idCompanyOwner, idProject){

    // liste des commaitaires envoye par admin vers company-owner

    const url = this.apiUrlCloud + '/questionsAide?destId=' + idCompanyOwner + '&expdId=' + idInvestor + '&idProject=' + idProject + '&typeComtpteExp=investor&typeCompteDest=company_owner' ;

    return this.http.get(url);

   }

   getListQuestionReponsesByCompanyOwnerForInvestor(idCompanyOwner, idInvestor, idProject){

    // liste des commaitaires envoye par company-owner vers admin

    const url = this.apiUrlCloud + '/questionsAide?destId=' + idInvestor + '&expdId=' + idCompanyOwner + '&idProject=' + idProject + '&typeComtpteExp=company_owner&typeCompteDest=investor' ;


    return this.http.get(url);

   }

   saveQuestionReponsesByInvestorForCompanyOwner(objectQuestion){

    const url = this.apiUrlCloud + '/questionsAide' ;

    return this.http.post(url, objectQuestion);

   }

   /**************************** composant compnay-owner /investor ****************************************** */

   getListQuestionReponsesForCompanyOwner(idCompanyOwner, idProject){

    // liste des commaitaires envoye par admin vers company-owner

    const url = this.apiUrlCloud + '/questionsAide?destId=' + idCompanyOwner  + '&idProject=' + idProject + '&typeComtpteExp=investor&typeCompteDest=company_owner' ;

    return this.http.get(url);

   }

   getListQuestionReponsessendByCompanyOwner(idCompanyOwner, idProject){

    // liste des commaitaires envoye par admin vers company-owner

    const url = this.apiUrlCloud + '/questionsAide?&expdId=' + idCompanyOwner + '&idProject=' + idProject + '&typeComtpteExp=company_owner&typeCompteDest=investor' ;

    return this.http.get(url);

   }

   saveQuestionReponsesByCompanyOwnerForManager(objectQuestion){

    const url = this.apiUrlCloud + '/questionsAide' ;


    return this.http.post(url, objectQuestion);


   }

   saveQuestionReponsesByCompanyOwnerForInvestor(objectQuestion){

    const url = this.apiUrlCloud + '/questionsAide' ;


    return this.http.post(url, objectQuestion);


   }

  
     /*********************************************************************** */
  

   



  

   checkInvestByProject(idProject, idInvestor){

    const url = this.apiUrlCloud + '/investissements?projectId=' + idProject + '&investorId=' + idInvestor;

    return this.http.get(url);

   }

   validInvestByProject(idProject, idInvestor){

    const url = this.apiUrlCloud + '/investissements?projectId=' + idProject + '&investorId=' + idInvestor + '&stautDemande=1';

    return this.http.get(url);

   }

   sendDemandeInvestForCompanyOwner(objectDemande){


    const url = this.apiUrlCloud + '/investissements';

    return this.http.post(url, objectDemande);


   }

   getListInvestorByProject(idProject){

    const url = this.apiUrlCloud + '/investissements?projectId=' + idProject + '&stautDemande=1';

    return this.http.get(url);

   }

   getListInvestorByProjectForCompanyOwner(idProject){

    const url = this.apiUrlCloud + '/investissements?projectId=' + idProject ;

    return this.http.get(url);

   }

   confirmDemandeInvestor(ObjectInvestissement, statutDemande){

    const date = new Date();

    ObjectInvestissement.date_valid = date.toLocaleString('fr-FR', {
                                                                weekday: 'long',
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                                hour: 'numeric',
                                                                minute: 'numeric',
                                                                second: 'numeric',

    });

    ObjectInvestissement.date_valid_timestamp = Date.now();

    if (statutDemande === 'valider'){

      ObjectInvestissement.stautDemande = 1;

    }

    if (statutDemande === 'annule'){

      ObjectInvestissement.stautDemande = 2;

    }



    const url = this.apiUrlCloud + '/investissements/' + ObjectInvestissement.id ;

    return this.http.put(url, ObjectInvestissement);



   }

   saveDataTransactionPaypal(objectFondInvestor){


    const url = this.apiUrlCloud + '/log_investissements';

    return this.http.post(url, objectFondInvestor);


   }

   saveCommentByInvestor(objectComment){

    const url = this.apiUrlCloud + '/commentsProjects' ;

    return this.http.post(url, objectComment);

   }

   getListCommentsForProject(idProject){

    const url = this.apiUrlCloud + '/commentsProjects?idProject=' + idProject ;

    return this.http.get(url);

   }

   updateStatutProject(objectProject){

    const url = this.apiUrlCloud + '/projectsCompanyOwner/' + objectProject.id ;

    return this.http.put(url, objectProject);



   }

}
