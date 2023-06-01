package fr.ToSucceed.message.service;

import fr.ToSucceed.message.model.Message;
import fr.ToSucceed.message.repository.IMessage;
import fr.ToSucceed.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Service
public class MessageService {
    private final IMessage iMessage;
    private final UserRepository userRepository;

    @Autowired
    public MessageService(IMessage iMessage, UserRepository userRepository) {
        this.iMessage = iMessage;
        this.userRepository = userRepository;
    }

    public List<Message> getMessages(){return iMessage.findAll();}

    public List<Message> getMessagesByUsername(String username){
        return iMessage.findMessageByExpediteurOrDestinataireOrderByIdDesc(userRepository.findUserByUsername(username), userRepository.findUserByUsername(username));}


    public Message addMessage(String usernameExpediteur, String usernameDestinataire, String contenu){
        DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
        Date date = new Date();
        Message message = new Message();
        message.setContenu_msg(contenu);
        message.setExpediteur(userRepository.findUserByUsername(usernameExpediteur));
        message.setDestinataire(userRepository.findUserByUsername(usernameDestinataire));
        message.setDateEnvoi(dateFormat.format(date));
        message.setReaden(false);
        iMessage.save(message);
        return message;
    }

    public Message readMessage(Integer id){
        Message message = iMessage.findMessageById(id);
        message.setReaden(true);
        iMessage.save(message);
        return message;
    }
}
