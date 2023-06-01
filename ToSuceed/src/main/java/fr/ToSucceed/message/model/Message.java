package fr.ToSucceed.message.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import fr.ToSucceed.user.domain.User;
import lombok.*;

import javax.persistence.*;

import java.time.LocalDate;
import java.util.Date;

import static javax.persistence.GenerationType.AUTO;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Message {

    @Id
    @GeneratedValue(strategy = AUTO)
    private Integer id;
    private String contenu_msg;
    @ManyToOne
    @JoinColumn(name = "exp_id")
    @JsonIgnoreProperties("messages")
    private User expediteur;
    @ManyToOne
    @JoinColumn(name = "dest_id")
    @JsonIgnoreProperties("messages")
    private User destinataire;
    private String dateEnvoi;
    private boolean readen;





}
