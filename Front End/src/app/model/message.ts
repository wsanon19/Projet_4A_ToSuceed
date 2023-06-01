import { User } from "./user";

export class Message{
    public id : string;
    public contenu_msg : string;
    public expediteur : User;
    public destinataire : User;
    public dateEnvoi : Date;
    public envoye : boolean;
    public readen: boolean;

    constructor(){
        this.id = '';
        this.contenu_msg = '';
        this.expediteur=null;
        this.destinataire = null;
        this.dateEnvoi = null;
        this.envoye = null;
        this.readen = null;
    }


}