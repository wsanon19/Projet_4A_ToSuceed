package fr.ToSucceed.abonnement.repository;

import fr.ToSucceed.abonnement.model.Abonnement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IAbonnement extends JpaRepository<Abonnement, Integer> {
    Optional<Abonnement> findAbonnementById(Integer integer);
}
