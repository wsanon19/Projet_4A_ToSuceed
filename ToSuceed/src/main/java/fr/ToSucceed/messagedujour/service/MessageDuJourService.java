package fr.ToSucceed.messagedujour.service;

import fr.ToSucceed.messagedujour.repository.IMessageDuJour;
import fr.ToSucceed.messagedujour.model.MessageDuJour;
import fr.ToSucceed.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MessageDuJourService {
    private final IMessageDuJour iMessageDuJour;
    private final UserService userService;

    @Autowired
    public MessageDuJourService(IMessageDuJour iMessage, UserService userService) {
        this.iMessageDuJour = iMessage;
        this.userService = userService;
    }

    public List<MessageDuJour> getMessages() {
        return iMessageDuJour.findAll();
    }

    public MessageDuJour addNewMessage(String message, String username) {
        MessageDuJour messageDuJour = new MessageDuJour();
        messageDuJour.setUser(userService.findUserByUsername(username));
        messageDuJour.setContenu_msg(message);
        iMessageDuJour.save(messageDuJour);
        return messageDuJour;
    }

    public void deleteMessage(Integer messageID){

        boolean exists = iMessageDuJour.existsById(messageID);
        if(!exists){
            throw new IllegalStateException("Message with id "+messageID+" does not exist");
        }
        iMessageDuJour.deleteById(messageID);
    }

}
