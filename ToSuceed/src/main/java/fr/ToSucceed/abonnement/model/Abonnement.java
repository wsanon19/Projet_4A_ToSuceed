package fr.ToSucceed.abonnement.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import fr.ToSucceed.user.domain.User;
import lombok.*;

import javax.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import static javax.persistence.GenerationType.AUTO;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Abonnement {

    @Id
    @GeneratedValue(strategy = AUTO)
    private int id;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy", timezone = "Europe/Paris")
    private LocalDate date_exp;
    @JsonBackReference(value = "user-abo")
    @OneToOne(mappedBy = "abonnement")
    private User user;

    public Abonnement(LocalDate date_exp) {
        this.date_exp = date_exp;
    }
}
