package fr.ToSucceed.message.repository;

import fr.ToSucceed.message.model.Message;
import fr.ToSucceed.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IMessage extends JpaRepository<Message,Integer> {
    List<Message> findMessageByExpediteurOrDestinataireOrderByIdDesc(User expediteur, User destinataire);

    Message findMessageById(Integer id);
}
