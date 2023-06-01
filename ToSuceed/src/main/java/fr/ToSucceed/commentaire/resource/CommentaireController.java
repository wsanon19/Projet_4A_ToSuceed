package fr.ToSucceed.commentaire.resource;

import fr.ToSucceed.commentaire.model.Commentaire;
import fr.ToSucceed.commentaire.service.CommentaireService;
import fr.ToSucceed.messagedujour.model.MessageDuJour;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("commentaire")
public class CommentaireController {
    private CommentaireService commentaireService;

    @Autowired
    public CommentaireController(CommentaireService commentaireService) {
        this.commentaireService = commentaireService;
    }

    @GetMapping
    public List<Commentaire> getCommentaires(){return commentaireService.getCommentaires();}

    @PostMapping(path = "save")
    public ResponseEntity<Commentaire> addNewMessage(@RequestParam("contenu") String message,
                                                     @RequestParam("username") String username,
                                                     @RequestParam("id_cours") int id_cours,
                                                     @RequestParam("note") String note){
        Commentaire commentaire = commentaireService.addNewCommentaire(message,username,id_cours,note);
        return new ResponseEntity<>(commentaire, OK);
    }

    @DeleteMapping("delete/{id}")
    public void deleteCommentaire(@PathVariable("id")Integer id){
        commentaireService.deleteCommentaire(id);
    }
}
