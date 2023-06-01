package fr.ToSucceed.commentaire.repository;

import fr.ToSucceed.commentaire.model.Commentaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ICommentaire extends JpaRepository<Commentaire, Integer> {
    Optional<Commentaire> findCommentaireById(Integer integer);
}
