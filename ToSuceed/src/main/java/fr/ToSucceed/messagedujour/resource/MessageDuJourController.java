package fr.ToSucceed.messagedujour.resource;

import fr.ToSucceed.messagedujour.model.MessageDuJour;
import fr.ToSucceed.messagedujour.service.MessageDuJourService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("messagedujour")
public class MessageDuJourController {
    private final MessageDuJourService messageDuJourService;

    @Autowired

    public MessageDuJourController(MessageDuJourService messageDuJourService) {
        this.messageDuJourService = messageDuJourService;
    }

    @GetMapping(path = "list")
    public List<MessageDuJour> getMessages(){return messageDuJourService.getMessages();}

    @PostMapping(path = "save")
    public ResponseEntity<MessageDuJour> addNewMessage(@RequestParam("contenu_msg") String message,
                                                       @RequestParam("username") String username){
        MessageDuJour messageDuJour = messageDuJourService.addNewMessage(message, username);
        return new ResponseEntity<>(messageDuJour, OK);
    }

    @DeleteMapping("delete/{id}")
    public void deleteMessage(@PathVariable("id")Integer id){
        messageDuJourService.deleteMessage(id);
    }

}
