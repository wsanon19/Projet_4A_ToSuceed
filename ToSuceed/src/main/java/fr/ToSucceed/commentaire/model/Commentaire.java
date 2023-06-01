package fr.ToSucceed.commentaire.model;

import com.fasterxml.jackson.annotation.*;
import fr.ToSucceed.cours.model.Cours;
import fr.ToSucceed.user.domain.User;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDate;

import static javax.persistence.GenerationType.AUTO;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Commentaire {

    @Id
    @GeneratedValue(strategy = AUTO)
    private int id;
    private LocalDate date_com;
    private String contenu_com;
    private int note;
    @ManyToOne
    @JoinColumn(name = "cours_id")
    @JsonBackReference(value = "cours-com")
    private Cours cours;
    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference(value = "user-com")
    private User user;

    public Commentaire(LocalDate date_com, String contenu_com, int note, Cours cours) {
        this.date_com = date_com;
        this.contenu_com = contenu_com;
        this.note = note;
        this.cours = cours;
    }
}
