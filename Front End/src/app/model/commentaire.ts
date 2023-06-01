import { Cours } from "./cours";
import { User } from "./user";

export class Commentaire{
    public id : string;
    public date_com : Date;
    public contenu_com : string;
    public note : number;
    public cours : Cours;
    public user: User;

    constructor(){
        this.id='';
        this.date_com = null;
        this.contenu_com = '';
        this.note = 0;
        this.cours = null;
        this.user = null;
    }
}
