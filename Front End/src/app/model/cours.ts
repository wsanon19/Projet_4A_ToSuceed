import { Commentaire } from "./commentaire";
import { User } from "./user";

export class Cours{
    public id : string;
    public niveau : string;
    public nom : string;
    public description : string;
    public dop : Date;
    public matiere : string;
    public type : string;
    public commentaires : Commentaire[];
    public user : User;
    public notemoyenne : number;

    constructor(){
        this.id = '';
        this.niveau = '';
        this.nom = '';
        this.description = '';
        this.dop = null;
        this.matiere = '';
        this.type = '';
        this.user = null;
        this.commentaires = null;
        this.notemoyenne = 0;
    }
}