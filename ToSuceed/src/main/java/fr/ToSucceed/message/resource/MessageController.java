package fr.ToSucceed.message.resource;

import fr.ToSucceed.message.model.Message;
import fr.ToSucceed.message.service.MessageService;
import fr.ToSucceed.messagedujour.model.MessageDuJour;
import fr.ToSucceed.messagedujour.service.MessageDuJourService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("message")
public class MessageController {
    private final MessageService messageService;

    @Autowired
    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }


    @GetMapping(path = "list")
    public List<Message> getMessages(){return messageService.getMessages();}

    @GetMapping(path = "list/{username}")
    public List<Message> getMessagesByUsername(@PathVariable("username") String username){return messageService.getMessagesByUsername(username);}


    @PostMapping(path = "save")
    public ResponseEntity<Message> addNewMessage(@RequestParam("contenu_msg") String message,
                                                       @RequestParam("usernameExp") String usernameExp,
                                                       @RequestParam("usernameDest") String usernameDest){
        Message message1 = messageService.addMessage(usernameExp,usernameDest,message);
        return new ResponseEntity<>(message1, OK);
    }

    @PostMapping(path = "read")
    public ResponseEntity<Message> readMessage(@RequestBody String id){
        Message message1 = messageService.readMessage(Integer.parseInt(id));
        return new ResponseEntity<>(message1, OK);
    }


}

