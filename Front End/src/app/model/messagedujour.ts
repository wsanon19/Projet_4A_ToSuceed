import { User } from "./user";

export class Messagedujour{
    public id : string;
    public contenu_msg : string;
    public user : User;

    constructor(){
        this.id = '';
        this.contenu_msg = '';
        this.user=null;
    }


}