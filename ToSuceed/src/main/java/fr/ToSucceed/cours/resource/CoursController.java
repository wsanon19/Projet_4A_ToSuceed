package fr.ToSucceed.cours.resource;

import fr.ToSucceed.cours.model.Cours;
import fr.ToSucceed.cours.model.Matiere;
import fr.ToSucceed.cours.service.CoursService;
import fr.ToSucceed.user.domain.HttpResponse;
import fr.ToSucceed.user.domain.User;
import fr.ToSucceed.user.exception.domain.EmailExistException;
import fr.ToSucceed.user.exception.domain.NotAnImageFileException;
import fr.ToSucceed.user.exception.domain.UserNotFoundException;
import fr.ToSucceed.user.exception.domain.UsernameExistException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import static fr.ToSucceed.user.constant.FileConstant.*;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.MediaType.IMAGE_JPEG_VALUE;

@RestController
@RequestMapping("cours")
public class CoursController {
    private static final String COURS_DELETED_SUCCESSFULLY = "Cours supprimé avec succès";
    private final CoursService coursService;

    @Autowired
    public CoursController(CoursService coursService) {
        this.coursService = coursService;
    }

    @GetMapping("list")
    public List<Cours> getCours() {
        return coursService.getCours();
    }

    @PostMapping("save")
    @PreAuthorize("hasAnyAuthority('user:update')")
    public ResponseEntity<Cours> addNewCours(@RequestParam("currentusername") String username,
                                             @RequestParam("nom") String nom,
                                             @RequestParam("niveau") String niveau,
                                             @RequestParam("description") String description,
                                             @RequestParam("matiere") Matiere matiere,
                                             @RequestParam(value = "profileImage") MultipartFile coursImage) throws UserNotFoundException, UsernameExistException, EmailExistException, IOException, NotAnImageFileException {
        Cours newCours = coursService.addNewCours(username, nom, niveau, description, matiere, coursImage);
        return new ResponseEntity<>(newCours, OK);
    }


    @DeleteMapping("delete/{id}")
    @PreAuthorize("hasAnyAuthority('user:delete')")
    public ResponseEntity<HttpResponse> deleteCours(@PathVariable("id") Integer id) throws IOException {
        coursService.deleteCours(id);
        return response(OK, COURS_DELETED_SUCCESSFULLY);
    }

    @GetMapping(path = "/image/{username}/{fileName}", produces = IMAGE_JPEG_VALUE)
    public byte[] getProfileImage(@PathVariable("username") String username, @PathVariable("fileName") String fileName) throws IOException {
        return Files.readAllBytes(Paths.get(COURS_FOLDER + username + FORWARD_SLASH + fileName));
    }

    private ResponseEntity<HttpResponse> response(HttpStatus httpStatus, String message) {
        return new ResponseEntity<>(new HttpResponse(httpStatus.value(), httpStatus, httpStatus.getReasonPhrase().toUpperCase(),
                message), httpStatus);
    }
}
