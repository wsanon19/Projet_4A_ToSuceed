package fr.ToSucceed.commentaire.service;

import fr.ToSucceed.commentaire.repository.ICommentaire;
import fr.ToSucceed.commentaire.model.Commentaire;
import fr.ToSucceed.cours.repository.ICours;
import fr.ToSucceed.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.yaml.snakeyaml.parser.ParserImpl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class CommentaireService {
    private final ICommentaire iCommentaire;
    private final UserService userService;
    private final ICours iCours;

    @Autowired
    public CommentaireService(ICommentaire iCommentaire, UserService userService, ICours iCours) {
        this.iCommentaire = iCommentaire;
        this.userService = userService;
        this.iCours = iCours;
    }


    public List<Commentaire> getCommentaires(){
        return iCommentaire.findAll();
    }

    public Commentaire addNewCommentaire(String contenu, String username, int id_cours, String note){
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");

        Commentaire commentaire = new Commentaire();
        commentaire.setContenu_com(contenu);
        commentaire.setUser(userService.findUserByUsername(username));
        commentaire.setCours(iCours.findCoursById(id_cours));
        commentaire.setDate_com(LocalDate.now());
        commentaire.setNote(Integer.parseInt(note));
        iCommentaire.save(commentaire);
        return commentaire;
    }

    public void deleteCommentaire(Integer commentaireID){

        boolean exists = iCommentaire.existsById(commentaireID);
        if(!exists){
            throw new IllegalStateException("Commentaire with id "+commentaireID+" does not exist");
        }
        iCommentaire.deleteById(commentaireID);
    }

}
