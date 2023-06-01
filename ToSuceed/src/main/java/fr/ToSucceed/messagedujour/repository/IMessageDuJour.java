package fr.ToSucceed.messagedujour.repository;

import fr.ToSucceed.messagedujour.model.MessageDuJour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IMessageDuJour extends JpaRepository<MessageDuJour, Integer> {
    MessageDuJour findMessageDuJourById(Integer id);
}
