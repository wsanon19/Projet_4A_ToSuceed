package fr.ToSucceed.messagedujour.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import fr.ToSucceed.user.domain.User;
import lombok.*;

import javax.persistence.*;

import static javax.persistence.GenerationType.AUTO;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class MessageDuJour {

    @Id
    @GeneratedValue(strategy = AUTO)
    private int id;
    private String contenu_msg;
    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties("messagesdujour")
    private User user;





}
