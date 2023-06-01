package fr.ToSucceed.user.domain;

import com.fasterxml.jackson.annotation.*;
import fr.ToSucceed.abonnement.model.Abonnement;
import fr.ToSucceed.commentaire.model.Commentaire;
import fr.ToSucceed.cours.model.Cours;
import fr.ToSucceed.message.model.Message;
import fr.ToSucceed.messagedujour.model.MessageDuJour;
import lombok.*;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;
import java.util.List;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class User implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(nullable = false, updatable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Long id;
    private String userId;
    private String firstName;
    private String lastName;
    private String username;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
    private String email;
    private String profileImageUrl;
    private Date lastLoginDate;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy", timezone = "Europe/Paris")
    private Date lastLoginDateDisplay;
    private Date joinDate;
    private String role; //ROLE_USER{ read, edit }, ROLE_ADMIN {delete}
    private String[] authorities;
    private boolean isActive;
    private boolean isNotLocked;
    private boolean isOnline;
    @OneToMany(mappedBy = "user",
                cascade = CascadeType.ALL,
                orphanRemoval = true)
    @JsonIgnoreProperties("user")

    private List<MessageDuJour> messagesdujour;

    @OneToMany(mappedBy = "user",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    @JsonIgnoreProperties("user")
    private List<Cours> cours;

    @OneToMany(mappedBy = "user",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    @JsonManagedReference(value = "user-com")
    private List<Commentaire> commentaires;

    @OneToOne(cascade = CascadeType.ALL)
    @JsonManagedReference(value = "user-abo")
    private Abonnement abonnement;


    public User(String username, String password, String email) {
        this.username = username;
        this.password = password;
        this.email = email;

    }

    public User(Long id) {
        this.id = id;
    }


}
