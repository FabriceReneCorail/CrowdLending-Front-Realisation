import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import {UserModel, ProjectModel, ProjectModelBis,  ImageProjectModel
  , AdressReseauxSociauxProjectModel, commentProjectModel, StatutProjectModel,
  QuestionRepProjectByAdminForUserModel, QuestionRepProjectByUserForAdminModel,
    QuestionRepProjectByUserForUserModel, InvestiteurProjectModelBis, fondInvestorBis, FavorisProjectUserModel,
    HeartProjectUserModel, LikeProjectUserModel, VueProjectUserModel, NewsProjectModel, CommissionProjectModel} from './interfaces/models';
import { Observable } from 'rxjs/internal/Observable';



@Injectable({
  providedIn: 'root',
})
export class apiHttpSpringBootService {
  private apiUrlCloud = 'https://java-crowdlunding-g4.herokuapp.com/api';

  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    console.log('BASE_URL = ', baseUrl, baseUrl.indexOf('http://localhost'));

    if (baseUrl.indexOf('http://localhost') >= 0) {
      // this.apiUrlCloud = 'http://localhost:8080/api';
    }
  }

  public checkCommissionProjectByAdmin(
    objectUser: UserModel,
    objectProject: ProjectModel
  ) {
    const url =
      this.apiUrlCloud +
      '/admin/' +
      objectUser.token +
      '/projects/' +
      objectProject.token +
      '/checkCommissionProject';

    return this.http.post(url, objectUser);
  }

  public addCommissionProjectByAdmin(
    objectUser: UserModel,
    objectProject: ProjectModel,
    objectCommissionProject: CommissionProjectModel
  ) {
    const url =
      this.apiUrlCloud +
      '/admin/' +
      objectUser.token +
      '/projects/' +
      objectProject.token +
      '/createCommissionProject';

    return this.http.post(url, objectCommissionProject);
  }

  public getStatistiquesNewUsersChartsByAdmin(objectUser: UserModel) {
    const url = this.apiUrlCloud + '/admin/users/statistiques_charts';

    return this.http.post(url, objectUser);
  }

  public sendFormContact(objectContact) {
    const url = this.apiUrlCloud + '/visitor/createMessageContact';

    return this.http.post(url, objectContact);
  }

  public identificationAdmin(objectConnection) {
    const url = this.apiUrlCloud + '/admin/checkUser';

    const objectConnectionBis = {
      login: objectConnection.emailLogin,

      password: objectConnection.passwordLogin,
    };

    return this.http.post(url, objectConnectionBis);
  }

  public checkAdminByToken(objetUser) {
    const url = this.apiUrlCloud + '/admin/checkUserByToken';

    return this.http.post(url, objetUser);
  }

  public getInfosUserByAdminToken(objetUser, tokenUser) {
    const url = this.apiUrlCloud + '/admin/users/' + tokenUser + '/infos';

    return this.http.post(url, objetUser);
  }

  public listMyProjectByUserByAdmin(objetUser, tokenUser) {
    const url = this.apiUrlCloud + '/admin/users/' + tokenUser + '/my_projects';

    return this.http.post(url, objetUser);
  }

  public listContribProjectByUserByAdmin(objetUser, tokenUser) {
    const url =
      this.apiUrlCloud + '/admin/users/' + tokenUser + '/contrib_projects';

    return this.http.post(url, objetUser);
  }

  public identificationUser(objectConnection): Observable<UserModel> {
    const url = this.apiUrlCloud + '/users/checkUser';

    const objectConnectionBis = {
      login: objectConnection.emailLogin,

      password: objectConnection.passwordLogin,
    };

    return this.http.post<UserModel>(url, objectConnectionBis);
  }

  public inscriptionUser(objectInscription) {
    const url = this.apiUrlCloud + '/users/create';

    /*  const bodyInscription = {
        nom : objectInscription.nomInscription,
        prenom : objectInscription.prenomInscription,
        login : objectInscription.emailInscription,
        password : objectInscription.passwordInscription,
        sex : objectInscription.sex,
        photoUser : objectInscription.photoUser,
        date_naissance : objectInscription.date_naissance,
        token : objectInscription.token,
        typeCompte : objectInscription.typeCompte,
        pseudo_name : objectInscription.pseudo_name
    };*/

    // console.log("objectInscription.date_naissance = ", objectInscription.date_naissance);

    return this.http.post(url, objectInscription);
  }

  public updateProfilUser(objectUpdate) {
    const url = this.apiUrlCloud + '/users/update';

    const bodyUpdate = {
      id: objectUpdate.id,
      nom: objectUpdate.nom,
      prenom: objectUpdate.prenom,
      login: objectUpdate.login,
      password: objectUpdate.password,
      sex: objectUpdate.sex,
      photoUser: objectUpdate.photoUser,
      date_naissance: objectUpdate.date_naissance,
      date_created: objectUpdate.date_created,
      date_update: objectUpdate.date_update,
      token: objectUpdate.token,
      pseudo_name: objectUpdate.pseudo_name,
    };

    return this.http.put(url, bodyUpdate);
  }

  getListUsers(objectUser: UserModel) {
    const url = this.apiUrlCloud + '/admin/users';

    return this.http.post(url, objectUser);
  }

  getDataProject(tokenProject: string) {
    const url = this.apiUrlCloud + '/projects/' + tokenProject;

    return this.http.get(url);
  }

  checkVueProjectByUser(objectProject, objectUser) {
    const url =
      this.apiUrlCloud +
      '/user/projects/' +
      objectProject.token +
      '/checkVueProject';

    return this.http.post(url, objectUser);
  }

  getListMessagesRecusByUser(objectUser: UserModel) {
    const url =
      this.apiUrlCloud + '/users/' + objectUser.token + '/messages_recus/all';

    return this.http.post(url, objectUser);
  }

  getListMessagesEnvoyesByUser(objectUser: UserModel) {
    const url =
      this.apiUrlCloud + '/users/' + objectUser.token + '/messages_envoyes/all';

    return this.http.post(url, objectUser);
  }

  addVueProjectByUser(objectVueProject: VueProjectUserModel) {
    console.log(
      'objectVueProject._project.token',
      objectVueProject._project.token
    );

    const url =
      this.apiUrlCloud +
      '/user/projects/' +
      objectVueProject._project.token +
      '/vues_project/create';

    return this.http.post(url, objectVueProject);
  }

  updateVueProjectByUser(objectVueProject: VueProjectUserModel) {
    console.log(
      'objectVueProject._project.token',
      objectVueProject._project.token
    );

    const url =
      this.apiUrlCloud +
      '/user/projects/' +
      objectVueProject._project.token +
      '/vues_project/update';

    return this.http.put(url, objectVueProject);
  }

  checkLikeDislikeProjectByUser(objectProject, objectUser) {
    const url =
      this.apiUrlCloud +
      '/user/projects/' +
      objectProject.token +
      '/checkLikeProject';

    return this.http.post(url, objectUser);
  }

  addNewsProjectByUser(objectNews: NewsProjectModel) {
    const url =
      this.apiUrlCloud +
      '/user/projects/' +
      objectNews._project.token +
      '/news/create';

    return this.http.post(url, objectNews);
  }

  getListNewsProjectByUser(objectProject: ProjectModelBis) {
    const url =
      this.apiUrlCloud +
      '/user/projects/' +
      objectProject.token +
      '/list_news_project';

    return this.http.post(url, objectProject);
  }

  addLikeProjectByUser(objectLikeProject: LikeProjectUserModel) {
    console.log(
      'objectLikeProject._project.token',
      objectLikeProject._project.token
    );

    const url =
      this.apiUrlCloud +
      '/user/projects/' +
      objectLikeProject._project.token +
      '/like_dislike_project/create';

    return this.http.post(url, objectLikeProject);
  }

  updateLikeProjectByUser(objectLikeProject: LikeProjectUserModel) {
    console.log(
      'objectLikeProject._project.token',
      objectLikeProject._project.token
    );

    const url =
      this.apiUrlCloud +
      '/user/projects/' +
      objectLikeProject._project.token +
      '/like_dislike_project/update';

    return this.http.put(url, objectLikeProject);
  }

  deleteLikeProjectByUser(objectLikeProject: LikeProjectUserModel) {
    console.log(
      'objectLikeProject._project.token',
      objectLikeProject._project.token
    );

    const url =
      this.apiUrlCloud +
      '/user/projects/' +
      objectLikeProject._project.token +
      '/like_dislike_project/delete';

    return this.http.post(url, objectLikeProject);
  }

  public getStatistiquesHeartsMonthChartsByUser(
    ObjetOptionStatMonth,
    objectProject,
    objectUser
  ) {
    const url =
      this.apiUrlCloud +
      '/user/projects/' +
      objectProject.token +
      '/statis_Heart_project_month/' +
      ObjetOptionStatMonth.year +
      '/' +
      ObjetOptionStatMonth.month;

    return this.http.post(url, objectUser);
  }

  public getStatistiquesVuesMonthChartsByUser(
    ObjetOptionStatMonth,
    objectProject,
    objectUser
  ) {
    // tslint:disable-next-line:max-line-length
    const url =
      this.apiUrlCloud +
      '/user/projects/' +
      objectProject.token +
      '/statis_Vue_project_month/' +
      ObjetOptionStatMonth.year +
      '/' +
      ObjetOptionStatMonth.month;

    return this.http.post(url, objectUser);
  }

  public getStatistiquesLikeMonthChartsByUser(
    ObjetOptionStatMonth,
    objectProject,
    objectUser
  ) {
    // tslint:disable-next-line:max-line-length
    const url =
      this.apiUrlCloud +
      '/user/projects/' +
      objectProject.token +
      '/statis_Like_project_month/' +
      ObjetOptionStatMonth.year +
      '/' +
      ObjetOptionStatMonth.month;

    return this.http.post(url, objectUser);
  }

  public getStatistiquesDislikeMonthChartsByUser(
    ObjetOptionStatMonth,
    objectProject,
    objectUser
  ) {
    // tslint:disable-next-line:max-line-length
    const url =
      this.apiUrlCloud +
      '/user/projects/' +
      objectProject.token +
      '/statis_Dislike_project_month/' +
      ObjetOptionStatMonth.year +
      '/' +
      ObjetOptionStatMonth.month;

    return this.http.post(url, objectUser);
  }

  public getStatistiquesHeartsChartsByUser(objectProject, objectUser) {
    const url =
      this.apiUrlCloud +
      '/user/projects/' +
      objectProject.token +
      '/statis_Heart_project_mensuel';

    return this.http.post(url, objectUser);
  }

  public getStatistiquesVuesChartsByUser(objectProject, objectUser) {
    const url =
      this.apiUrlCloud +
      '/user/projects/' +
      objectProject.token +
      '/statis_Vue_project_mensuel';

    return this.http.post(url, objectUser);
  }

  public getStatistiquesLikesChartsByUser(objectProject, objectUser) {
    const url =
      this.apiUrlCloud +
      '/user/projects/' +
      objectProject.token +
      '/statis_Likes_project_mensuel';

    return this.http.post(url, objectUser);
  }

  public getStatistiquesDislikesChartsByUser(objectProject, objectUser) {
    const url =
      this.apiUrlCloud +
      '/user/projects/' +
      objectProject.token +
      '/statis_Dislikes_project_mensuel';

    return this.http.post(url, objectUser);
  }

  checkHeartProjectByUser(objectProject, objectUser) {
    const url =
      this.apiUrlCloud +
      '/users/' +
      objectUser.token +
      '/projects/' +
      objectProject.token +
      '/checkHeartProject';

    return this.http.post(url, objectUser);
  }

  addHeartProjectByUser(objectHeartProject: HeartProjectUserModel) {
    console.log(
      'objectHeartProject._project.token',
      objectHeartProject._project.token
    );

    const url =
      this.apiUrlCloud +
      '/users/' +
      objectHeartProject._user.token +
      '/projects/' +
      objectHeartProject._project.token +
      '/hearts_project/create';

    return this.http.post(url, objectHeartProject);
  }

  deleteHeartProjectByUser(objectHeartProject: HeartProjectUserModel) {
    const url =
      this.apiUrlCloud +
      '/users/' +
      objectHeartProject._user.token +
      '/projects/' +
      objectHeartProject._project.token +
      '/hearts_project/delete';

    return this.http.post(url, objectHeartProject);
  }

  public addProjectByMyFavoris(objectFavoris: FavorisProjectUserModel) {
    const url =
      this.apiUrlCloud +
      '/users/' +
      objectFavoris._user.token +
      '/projects/' +
      objectFavoris._project.token +
      '/favoris_projects/create';

    return this.http.post(url, objectFavoris);
  }

  checkFavorisProjectByUser(objectProject, objectUser) {
    const url =
      this.apiUrlCloud +
      '/users/' +
      objectUser.token +
      '/projects/' +
      objectProject.token +
      '/checkFavorisProjects';

    return this.http.post(url, objectUser);
  }

  deleteFavorisProjectByUser(objectFavoris: FavorisProjectUserModel) {
    const url =
      this.apiUrlCloud +
      '/users/' +
      objectFavoris._user.token +
      '/projects/' +
      objectFavoris._project.token +
      '/favoris_projects/delete';

    return this.http.post(url, objectFavoris);
  }

  public addProjectByCompanyOwner(objectProject: ProjectModel) {
    const url =
      this.apiUrlCloud +
      '/users/' +
      objectProject._user.token +
      '/projects/create';

    const newObjetProject = {
      nom: objectProject.nom,
      description: objectProject.description,
      montant_minimun: objectProject.montant_minimun,
      date_limite_collecte: objectProject.date_limite_collecte,
      _user: objectProject._user,
      contrePartieProject: objectProject.contrePartieProject,
      afficheProject: objectProject.afficheProject,
      _statut_project: objectProject._statut_project,
      valid_project: objectProject.valid_project,
      _porte_project: objectProject._porte_project,
      categoryProject: objectProject.categoryProject,
    };

    return this.http.post(url, newObjetProject);
  }

  public updateDataProjectByUser(objectProject: ProjectModel) {
    const url =
      this.apiUrlCloud +
      '/users/' +
      objectProject._user.token +
      '/my_projects/' +
      objectProject.token +
      '/update';

    return this.http.put(url, objectProject);
  }

  public updateDataProjectByAdmin(objectProject: ProjectModel) {
    const url = this.apiUrlCloud + '/admin/projects/update';

    return this.http.put(url, objectProject);
  }

  listAllProjectsForAdmin() {
    const url = this.apiUrlCloud + '/admin/projects';

    return this.http.get(url);
  }

  listAllProjectsForVisitor() {
    const url = this.apiUrlCloud + '/visitor/projects';

    return this.http.get(url);
  }

  listAllProjectsFiltreByTagForUser(tag: string) {
    const url = this.apiUrlCloud + '/user/projects/searchByKeyword';

    return this.http.post(url, tag);
  }

  listAllProjectsFiltreByTagForAdmin(tag: string) {
    const url = this.apiUrlCloud + '/admin/projects/searchByKeyword';

    return this.http.post(url, tag);
  }

  listAllFavorisProjectByUser(objectUser: UserModel) {
    const url =
      this.apiUrlCloud +
      '/users/' +
      objectUser.token +
      '/projects/list_favoris_projects';

    return this.http.post(url, objectUser);
  }

  listMyProjectByUser(objectUser: UserModel) {
    const url =
      this.apiUrlCloud + '/users/' + objectUser.token + '/my_projects';

    return this.http.post(url, objectUser);
  }

  listMyContribProjectByUser(objectUser: UserModel) {
    const url =
      this.apiUrlCloud + '/users/' + objectUser.token + '/my_contrib_projects';

    return this.http.post(url, objectUser);
  }

  listAllProjectByUser(objectUser: UserModel) {
    const url =
      this.apiUrlCloud + '/users/' + objectUser.token + '/all_projects';

    return this.http.post(url, objectUser);
  }

  getListCategorieProject() {
    const url = this.apiUrlCloud + '/project/all_categories';

    return this.http.get(url);
  }

  getListStatutProject() {
    const url = this.apiUrlCloud + '/project/all_statuts';

    return this.http.get(url);
  }

  getListPorteProject() {
    const url = this.apiUrlCloud + '/project/all_portes';

    return this.http.get(url);
  }

  public addImageProject(objectImage: ImageProjectModel) {
    const url =
      this.apiUrlCloud +
      '/users/' +
      objectImage._project._user.token +
      '/projects/' +
      objectImage._project.token +
      '/create_link_image';

    return this.http.post(url, objectImage);
  }

  public deleteImageProject(objectImage: ImageProjectModel) {
    const url =
      this.apiUrlCloud +
      '/users/' +
      objectImage._project._user.token +
      '/projects/' +
      objectImage._project.token +
      '/delete_link_image';

    return this.http.post(url, objectImage);
  }

  getAllImagesByIdProject(objectProject) {
    const url =
      this.apiUrlCloud +
      '/projects/' +
      objectProject.token +
      '/list_link_images';

    return this.http.post(url, objectProject);
  }

  public addAdressReseauSocialProject(objectAdress) {
    const url =
      this.apiUrlCloud +
      '/users/' +
      objectAdress._project._user.token +
      '/projects/' +
      objectAdress._project.token +
      '/create_adress_res_social';

    return this.http.post(url, objectAdress);
  }

  public deleteAdressReseauSocialProject(
    objectAdress: AdressReseauxSociauxProjectModel
  ) {
    const url =
      this.apiUrlCloud +
      '/users/' +
      objectAdress._project._user.token +
      '/projects/' +
      objectAdress._project.token +
      '/delete_adress_social';

    return this.http.post(url, objectAdress);
  }

  getListArrayAdressReseauxSociauxProject(objectProject) {
    const url =
      this.apiUrlCloud +
      '/projects/' +
      objectProject.token +
      '/list_adress_social';

    return this.http.post(url, objectProject);
  }

  public addCommentProject(objectComment) {
    const url =
      this.apiUrlCloud +
      '/users/' +
      objectComment._project._user.token +
      '/projects/' +
      objectComment._project.token +
      '/comments/create';

    return this.http.post(url, objectComment);
  }

  getListArrayCommentsProject(objectProject) {
    const url =
      this.apiUrlCloud + '/projects/' + objectProject.token + '/comments';

    return this.http.post(url, objectProject);
  }

  public createQuestionReponsesByAdminForUser(
    objectUser: UserModel,
    objectQuestion: QuestionRepProjectByAdminForUserModel
  ) {
    console.log('objectQuestion=', objectQuestion);

    const url =
      this.apiUrlCloud +
      '/admin/' +
      objectUser.token +
      '/projects/' +
      objectQuestion._project.token +
      '/QuestRepByProjectByAdminForUser/create';

    return this.http.post(url, objectQuestion);
  }

  getListQuestionReponsesByAdminForUser(objectProject: ProjectModel) {
    const url =
      this.apiUrlCloud +
      '/projects/' +
      objectProject.token +
      '/list_questions_rep_by_admin_for_user';

    return this.http.post(url, objectProject);
  }

  public createQuestionReponsesByUserForAdmin(
    objectUser: UserModel,
    objectQuestion: QuestionRepProjectByUserForAdminModel
  ) {
    console.log('objectQuestion=', objectQuestion);

    const url =
      this.apiUrlCloud +
      '/users/' +
      objectUser.token +
      '/projects/' +
      objectQuestion._project.token +
      '/QuestRepByProjectByUserForAdmin/create';

    return this.http.post(url, objectQuestion);
  }

  getListQuestionReponsesByUserForAdmin(objectProject: ProjectModel) {
    const url =
      this.apiUrlCloud +
      '/projects/' +
      objectProject.token +
      '/list_questions_rep_by_user_for_admin';

    return this.http.post(url, objectProject);
  }

  getListQuestionReponsesByUserForUser(objectProject: ProjectModelBis) {
    const url =
      this.apiUrlCloud +
      '/projects/' +
      objectProject.token +
      '/list_questions_rep_by_user_for_user';

    return this.http.post(url, objectProject);
  }

  public createQuestionReponsesByUserForUser(
    objectUser: UserModel,
    objectQuestion
  ) {
    // console.log('objectQuestion=', objectQuestion);

    const url =
      this.apiUrlCloud +
      '/users/' +
      objectUser.token +
      '/projects/' +
      objectQuestion._project.token +
      '/QuestRepByProjectByUserForUser/create';

    return this.http.post(url, objectQuestion);
  }

  checkInvestiteurProject(
    objectProject: ProjectModelBis,
    objectUser: UserModel
  ) {
    // tslint:disable-next-line:max-line-length
    const url =
      this.apiUrlCloud +
      '/projects/' +
      objectProject.token +
      '/investisseurs_project/check_invest_project';
    return this.http.post(url, objectUser);
  }

  getListInvestorByProject(objectProject) {
    const url =
      this.apiUrlCloud +
      '/projects/' +
      objectProject.token +
      '/investisseurs_project';

    return this.http.post(url, objectProject);
  }

  sendDemandeInvestorByProject(
    objectUser: UserModel,
    objectDemandeInvestProject: InvestiteurProjectModelBis
  ) {
    const url =
      this.apiUrlCloud +
      '/users/' +
      objectUser.token +
      '/projects/' +
      objectDemandeInvestProject._project.token +
      '/investisseurs_project/createDemandeInvest';

    return this.http.post(url, objectDemandeInvestProject);
  }

  acceptDemandeInvestorByProject(
    objectUser: UserModel,
    objectDemandeInvestProject: InvestiteurProjectModelBis
  ) {
    // tslint:disable-next-line:max-line-length
    const url =
      this.apiUrlCloud +
      '/users/' +
      objectUser.token +
      '/projects/' +
      objectDemandeInvestProject._project.token +
      '/investisseurs_project/' +
      objectDemandeInvestProject.token +
      '/updateDemandeInvest';

    return this.http.put(url, objectDemandeInvestProject);
  }

  declinDemandeInvestorByProject(
    objectUser: UserModel,
    objectDemandeInvestProject: InvestiteurProjectModelBis
  ) {
    // tslint:disable-next-line:max-line-length
    const url =
      this.apiUrlCloud +
      '/users/' +
      objectUser.token +
      '/projects/' +
      objectDemandeInvestProject._project.token +
      '/investisseurs_project/' +
      objectDemandeInvestProject.token +
      '/updateDemandeInvest';
    return this.http.put(url, objectDemandeInvestProject);
  }

  saveDataTransactionPaypal(objectFondInvestor: fondInvestorBis) {
    const url =
      this.apiUrlCloud +
      '/projects/' +
      objectFondInvestor._investisseurProject._project.token +
      '/fonds_invest_project/createFondsInvestProject';

    return this.http.post(url, objectFondInvestor);
  }

  getAllFondsInvestByProject(objectProject: ProjectModelBis) {
    const url =
      this.apiUrlCloud +
      '/projects/' +
      objectProject.token +
      '/fonds_invest_project';

    return this.http.post(url, objectProject);
  }
}
