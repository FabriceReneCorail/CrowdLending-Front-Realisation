export class CommissionProjectModel {
  id?: number;
  amount: number;
  token: string;
  date_created: string;
  timestamp: number;
  created_at: string;
  _project: ProjectModel;
  manager_project: UserModel;
}



export class NewsProjectModel {
  id?: number;
  titre: string;
  description: string;
  photos: string;
  date_created: string;
  date_update?: string;
  created_at: string;
  update_at?: string;
  timestamp: number;
  _project: ProjectModel;
}


export class StatistiquesChartsUsersModel {
  year: string;
  nbrUsers: number;
}

export class StatistiquesChartsHeartModel {
  year: number;
  nbrHearts: number;
  month: string;
  day: string;
}

export class StatistiquesChartsVueModel {
  year: number;
  nbrVues: number;
  month: string;
  day: string;
}

export class StatistiquesChartsLikeModel {
  year: number;
  nbrLikes: number;
  month: string;
  day: string;
}

export class StatistiquesChartsDislikesModel {
  year: number;
  nbrDislikes: number;
  month: string;
  day: string;
}

export class FormContactModel {
  id: number;
  token: string;
  email: string;
  date_created: string;
  date_read: string;
  timestamp_created: number;
  timestamp_read: number;
  sujet: string;
  description: string;
  statut_read: number;
}

export class FavorisProjectUserModel {
  id: number;
  date_created: string;
  timestamp: number;
  token: string;
  _project: ProjectModelBis;
  _user: UserModel;
}

export class HeartProjectUserModel {
  id: number;
  date_created: string;
  created_at?: string;
  timestamp: number;
  _project: ProjectModelBis;
  _user: UserModel;
}


export class VueProjectUserModel {
  id: number;
  date_created: string;
  date_update: string;
  date_consultation: string;
  timestamp: number;
  ip_adress: string;
  _project: ProjectModelBis;
  _user: UserModel;
}


export class LikeProjectUserModel {
  id: number;
  date_created: string;
  created_at: string;
  date_update: string;
  timestamp: number;
  statut_like_project: string;
  _project: ProjectModelBis;
  _user: UserModel;
}

export class MessageInterneModel {
  id: number;
  token: string;
  bodyMessage: string;
  dateCreated: string;
  timestamp: number;
  _tokenProject: string;
  _nomUserExp: string;
  _nomUserDest: string;
  _photoUserExp: string;
  _photoUserDest: string;
  _tokenUserExp: string;
  _tokenUserDest: string;
  statutExp: string;
  statutDest: string;
  timestampConsultation: number;
  dateConsultation: string;
}

export class QuestionRepProjectByAdminForUserModel {
  id: number;
  bodyAide: string;
  dateCreated: string;
  timestamp: number;
  _userAdminExp: UserModel;
  _userProjectDest: UserModel;
  _project: ProjectModel;
}

export class QuestionRepProjectByUserForAdminModel {
  id: number;
  bodyAide: string;
  dateCreated: string;
  timestamp: number;
  _userAdminDest: UserModel;
  _userProjectExp: UserModel;
  _project: ProjectModel;
}



export class QuestionRepProjectByUserForUserModel {
  id: number;
  bodyAide: string;
  dateCreated: string;
  timestamp: number;
  _userDest: UserModel;
  _userExp: UserModel;
  _project: ProjectModel;
}


export class commentProjectModel {
    id: number;
    bodyComment: string;
    dateCreated: string;
    timestamp: number;
    _user: UserModel;
    _project: ProjectModel;
 }

export class commentProjectModelBis {
  id: number;
  bodyComment: string;
  dateCreated: string;
  timestamp: number;
  _user: UserModel;
  _project: ProjectModelBis;
}

export class PorteProjectModel {
    id: number;
    nom: string;
  }

export class ImageProjectModel {
    id: number;
    link: string;
    _project: ProjectModel;
  }

export class StatutProjectModel {
    id: number;
    nom: string;
  }

export class CategorieProjectModel {
    id: number;
    nom: string;
  }

export class AdressReseauxSociauxProjectModel {
    id: number;
    keyMedia: string;
    valueMedia: string;
    linkProject: string;
    _project: ProjectModel;
  }

export class UserModel {
    id: number;
    nom: string;
    prenom: string;
    login: string;
    password?: string;
    sex: string;
    date_naissance: string;
    photoUser: string;
    typeCompte: string;
    date_created: string;
    date_update: string;
    token?: string;
    pseudo_name: string;
  }

export class InvestiteurProjectModel {
    id: number;
    date_created: string;
    date_update: string;
    token: string;
    timestamp: number;
    statutDemande: string;
    _project: ProjectModel;
    _userProjectInvest: UserModel;
  }

export class InvestiteurProjectModelBis {
    id: number;
    date_created: string;
    date_update: string;
    token: string;
    timestamp: number;
    statutDemande: string;
    _project: ProjectModelBis;
    _userProjectInvest: UserModel;
  }

export class fondInvestor {
    id: number;
    token: string;
    amount: number;
    dateCreated: string;
    timestamp: number;
    _project: ProjectModel;
    _user: UserModel;
    _investisseurProject: InvestiteurProjectModel;
  }

export class fondInvestorBis {
    id: number;
    amount: number;
    dateCreated: string;
    timestamp: number;
    _project: ProjectModelBis;
    _user: UserModel;
    _investisseurProject: InvestiteurProjectModelBis;
  }

export class ProjectModel {
        id: number;
        created_at?: string;
        nom: string;
        description: string;
        _porte_project: PorteProjectModel;
        montant_minimun: number;
        date_limite_collecte: string;
        _user: UserModel;
        contrePartieProject: string;
        afficheProject: string;
        _statut_project: StatutProjectModel;
        valid_project: number;
        categoryProject: CategorieProjectModel;
        adressReseauxSociauxProject: AdressReseauxSociauxProjectModel;
        manager_project: UserModel;
        token: string;
        total_fonds: number;
        total_hearts: number;
        total_like: number;
        total_dislike: number;
        total_vues: number;
  }



export class templteProjectModel {
                           project: ProjectModel;
                           nbrJours: string;
                           dateLimiteCollecteFormate: string;
                           favorisProject: number;
                           srcFavorisProject: string;
                           heartUser: string;
                           likeUsers: string;
                           dislikeUser: string;
  }

export class QuestionRepProjectByUserForUserModelBis {
    id: number;
    bodyAide: string;
    dateCreated: string;
    timestamp: number;
    _userDest: UserModel;
    _userExp: UserModel;
    _project: ProjectModelBis;
  }

export class ProjectModelBis {
    id: number;
    created_at?: string;
    nom: string;
    description: string;
    _porte_project: PorteProjectModel;
    montant_minimun: number;
    date_limite_collecte: string;
    _user: UserModel;
    contrePartieProject: string;
    afficheProject: string;
    _statut_project: StatutProjectModel;
    valid_project: number;
    categoryProject: CategorieProjectModel;
    adressReseauxSociauxProject: AdressReseauxSociauxProjectModel;
    token: string;
    total_fonds: number;
    total_hearts: number;
    total_like: number;
    total_dislike: number;
    total_vues: number;

}

export class templteProjectModelBis {
    project: ProjectModelBis;
    nbrJours: string;
    dateLimiteCollecteFormate: string;
    favorisProject: number;
    srcFavorisProject: string;
    heartUser: string;
    likeUsers: string;
    dislikeUser: string;
}







