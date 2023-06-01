package fr.ToSucceed.cours.service;

import fr.ToSucceed.cours.model.Matiere;
import fr.ToSucceed.cours.repository.ICours;
import fr.ToSucceed.cours.model.Cours;
import fr.ToSucceed.user.domain.User;
import fr.ToSucceed.user.exception.domain.NotAnImageFileException;
import fr.ToSucceed.user.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static fr.ToSucceed.user.constant.FileConstant.*;
import static fr.ToSucceed.user.constant.FileConstant.FILE_SAVED_IN_FILE_SYSTEM;
import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;
import static org.springframework.http.MediaType.*;

@Service
public class CoursService {
    private final ICours iCours;
    private final UserService userService;
    private Logger LOGGER = LoggerFactory.getLogger(getClass());


    @Autowired
    public CoursService(ICours iCours, UserService userService) {

        this.iCours = iCours;
        this.userService = userService;
    }

    public List<Cours> getCours(){
        return iCours.findAll();
    }

    public Cours addNewCours(String username, String nom, String niveau, String description, Matiere matiere, MultipartFile coursImage) throws IOException, NotAnImageFileException {
        Cours cours = new Cours();
        cours.setUser(userService.findUserByUsername(username));
        cours.setNom(nom);
        cours.setNiveau(niveau);
        cours.setDescription(description);
        cours.setMatiere(matiere);
        this.iCours.save(cours);
        saveProfileImage(cours, coursImage);
        return cours;
    }

    public void deleteCours(Integer coursID){

        boolean exists = iCours.existsById(coursID);
        if(!exists){
            throw new IllegalStateException("Cours with id "+coursID+" does not exist");
        }
        iCours.deleteById(coursID);
    }

    private void saveProfileImage(Cours cours, MultipartFile profileImage) throws IOException, NotAnImageFileException {
        if (profileImage != null) {
            if(!Arrays.asList(IMAGE_JPEG_VALUE, IMAGE_PNG_VALUE, IMAGE_GIF_VALUE).contains(profileImage.getContentType())) {
                throw new NotAnImageFileException(profileImage.getOriginalFilename() + NOT_AN_IMAGE_FILE);
            }
            Path coursFolder = Paths.get(COURS_FOLDER + cours.getNom()).toAbsolutePath().normalize();
            if(!Files.exists(coursFolder)) {
                Files.createDirectories(coursFolder);
                LOGGER.info(DIRECTORY_CREATED + coursFolder);
            }
            Files.deleteIfExists(Paths.get(coursFolder + cours.getNom() + DOT + JPG_EXTENSION));
            Files.copy(profileImage.getInputStream(), coursFolder.resolve(cours.getNom() + DOT + JPG_EXTENSION), REPLACE_EXISTING);
            cours.setCoursImageUrl(setProfileImageUrl(cours.getNom()));
            iCours.save(cours);
            LOGGER.info(FILE_SAVED_IN_FILE_SYSTEM + profileImage.getOriginalFilename());
        }
    }
    public String setProfileImageUrl(String username) {
        return ServletUriComponentsBuilder.fromCurrentContextPath().path(COURS_IMAGE_PATH + username + FORWARD_SLASH
                + username + DOT + JPG_EXTENSION).toUriString();
    }


}
