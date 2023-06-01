package fr.ToSucceed.cours.model;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import fr.ToSucceed.commentaire.model.Commentaire;
import fr.ToSucceed.user.domain.User;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static javax.persistence.GenerationType.AUTO;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter @Setter

public class Cours {
    @Id
    @GeneratedValue(strategy= AUTO)
    private int id;
    private String niveau;
    @Column(unique=true)
    private String nom;
    private String description;
    private LocalDate dop;
    @Enumerated(EnumType.STRING)
    private Matiere matiere;
    @Enumerated(EnumType.STRING)
    private CoursType type;
    @OneToMany(mappedBy = "cours",cascade = CascadeType.ALL,orphanRemoval = true)
    @JsonManagedReference(value = "cours-com")
    private List<Commentaire> commentaires = new ArrayList<>();
    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties("cours")
    private User user;
    private String coursImageUrl;


    public Cours(String nom, String niveau, String description,Matiere matiere, User user, String coursImageUrl) {
        this.niveau = niveau;
        this.nom = nom;
        this.description = description;
        this.matiere = matiere;
        this.user = user;
        this.coursImageUrl= coursImageUrl;
    }
}
