package fr.ToSucceed.cours.repository;

import fr.ToSucceed.cours.model.Cours;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ICours extends JpaRepository<Cours, Integer> {
    Cours findCoursById(Integer id);
}
