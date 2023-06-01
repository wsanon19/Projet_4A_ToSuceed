package fr.ToSucceed.user.resource;

import fr.ToSucceed.user.domain.HttpResponse;
import fr.ToSucceed.user.domain.User;
import fr.ToSucceed.user.domain.UserPrincipal;
import fr.ToSucceed.user.exception.ExceptionHandling;
import fr.ToSucceed.user.exception.domain.*;
import fr.ToSucceed.user.service.UserService;
import fr.ToSucceed.user.utility.JWTTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.mail.MessagingException;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import static fr.ToSucceed.user.constant.FileConstant.*;
import static fr.ToSucceed.user.constant.SecurityConstant.JWT_TOKEN_HEADER;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.MediaType.IMAGE_JPEG_VALUE;

@RestController
@RequestMapping(path = { "/user"})
public class UserResource extends ExceptionHandling {
    public static final String PASSWORD_RESET = "Le mot de passe a bien été réinitialisé : ";
    public static final String USER_DELETED_SUCCESSFULLY = "l'utilisateur a bien été supprimé";
    public static final String ABONNEMENT_UPDATED_SUCCESSFULLY = "l'abonnement a bien été enregistré";
    private AuthenticationManager authenticationManager;
    private UserService userService;
    private JWTTokenProvider jwtTokenProvider;

    @Autowired
    public UserResource(AuthenticationManager authenticationManager, UserService userService, JWTTokenProvider jwtTokenProvider) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestParam("username") String username,
                                      @RequestParam("password") String password) {
        authenticate(username, password);
        User loginUser = userService.findUserByUsername(username);
        loginUser.setOnline(true);
        this.userService.save(loginUser);
        UserPrincipal userPrincipal = new UserPrincipal(loginUser);
        HttpHeaders jwtHeader = getJwtHeader(userPrincipal);
        return new ResponseEntity<>(loginUser, jwtHeader, OK);
    }

    @PostMapping("/logout")
    public ResponseEntity<User> logout(@RequestParam("username") String username) {
        User logoutUser = userService.findUserByUsername(username);
        logoutUser.setOnline(false);
        this.userService.save(logoutUser);

        return new ResponseEntity<>(logoutUser, OK);
    }

    @GetMapping("/getjwt/{username}")
    public ResponseEntity<User> login(@PathVariable (value = "username") String username) {
        User loginUser = userService.findUserByUsername(username);
        UserPrincipal userPrincipal = new UserPrincipal(loginUser);
        HttpHeaders jwtHeader = getJwtHeader(userPrincipal);
        return new ResponseEntity<>(loginUser, jwtHeader, OK);
    }


    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) throws UserNotFoundException, UsernameExistException, EmailExistException, MessagingException, UnsupportedEncodingException {
        User newUser = userService.register(user.getFirstName(), user.getLastName(), user.getUsername().replaceAll(" ", ""), user.getEmail(), user.getPassword().replaceAll(" ", ""));
        return new ResponseEntity<>(newUser, OK);
    }

    @PostMapping("/add")
    public ResponseEntity<User> addNewUser(@RequestParam("firstName") String firstName,
                                           @RequestParam("lastName") String lastName,
                                           @RequestParam("username") String username,
                                           @RequestParam("email") String email,
                                           @RequestParam("role") String role,
                                           @RequestParam("isActive") String isActive,
                                           @RequestParam("isNonLocked") String isNonLocked,
                                           @RequestParam(value = "profileImage", required = false) MultipartFile profileImage)
            throws UserNotFoundException, UsernameExistException, EmailExistException, IOException, NotAnImageFileException {
        User newUser = userService.addNewUser(firstName, lastName, username,email, role, Boolean.parseBoolean(isNonLocked),
                                                Boolean.parseBoolean(isActive), profileImage);
        return new ResponseEntity<>(newUser, OK);
    }

    @PostMapping("/update")
    public ResponseEntity<User> update(@RequestParam("currentUsername") String currentUsername,
                                       @RequestParam("firstName") String firstName,
                                       @RequestParam("lastName") String lastName,
                                       @RequestParam("username") String username,
                                       @RequestParam("email") String email,
                                       @RequestParam("role") String role,
                                       @RequestParam("isActive") String isActive,
                                       @RequestParam("isNonLocked") String isNonLocked,
                                       @RequestParam(value = "profileImage", required = false) MultipartFile profileImage) throws UserNotFoundException, UsernameExistException, EmailExistException, IOException, NotAnImageFileException {
        User updatedUser = userService.updateUser(currentUsername, firstName, lastName, username,email, role, Boolean.parseBoolean(isNonLocked), Boolean.parseBoolean(isActive), profileImage);
        return new ResponseEntity<>(updatedUser, OK);
    }
    
    @GetMapping("/find/{username}")
    public ResponseEntity<User> getUser(@PathVariable("username") String username) {
        User user = userService.findUserByUsername(username);
        return new ResponseEntity<>(user, OK);
    }

    @GetMapping("/list")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getUsers();
        return new ResponseEntity<>(users, OK);
    }

    @GetMapping("/getbyusername/{username}")
    public ResponseEntity<User> getUserbyUsername(@PathVariable("username") String username){
        User user = userService.findUserByUsername(username);
        return new ResponseEntity<>(user, OK);
    }

    @GetMapping("/resetpassword/{username}/{password}")
    public ResponseEntity<HttpResponse> resetPassword(@PathVariable("password") String password, @PathVariable("username") String username) throws MessagingException, EmailNotFoundException {
        userService.resetPassword(password, username);
        return response(OK, PASSWORD_RESET + password);
    }

    @DeleteMapping("/delete/{username}")
    @PreAuthorize("hasAnyAuthority('user:delete')")
    public ResponseEntity<HttpResponse> deleteUser(@PathVariable("username") String username) throws IOException {
        userService.deleteUser(username);
        return response(OK, USER_DELETED_SUCCESSFULLY);
    }

    @PostMapping("/updateProfileImage")
    public ResponseEntity<User> updateProfileImage(@RequestParam("username") String username, @RequestParam(value = "profileImage") MultipartFile profileImage) throws UserNotFoundException, UsernameExistException, EmailExistException, IOException, NotAnImageFileException {
        User user = userService.updateProfileImage(username, profileImage);
        return new ResponseEntity<>(user, OK);
    }

    @PostMapping("/abonnement")
    public ResponseEntity<User> updateAbo(@RequestParam("username") String username, @RequestParam("mois") int nbMois){
        User user = userService.updateAbonnement(username, nbMois);
        return new ResponseEntity<>(user, OK);

    }

    @GetMapping(path = "/image/{username}/{fileName}", produces = IMAGE_JPEG_VALUE)
    public byte[] getProfileImage(@PathVariable("username") String username, @PathVariable("fileName") String fileName) throws IOException {
        return Files.readAllBytes(Paths.get(USER_FOLDER + username + FORWARD_SLASH + fileName));
    }

    @GetMapping(path = "/image/profile/{username}", produces = IMAGE_JPEG_VALUE)
    public byte[] getTempProfileImage(@PathVariable("username") String username) throws IOException {
        URL url = new URL(TEMP_PROFILE_IMAGE_BASE_URL + username);
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        try (InputStream inputStream = url.openStream()) {
            int bytesRead;
            byte[] chunk = new byte[1024];
            while((bytesRead = inputStream.read(chunk)) > 0) {
                byteArrayOutputStream.write(chunk, 0, bytesRead);
            }
        }
        return byteArrayOutputStream.toByteArray();
    }

    private ResponseEntity<HttpResponse> response(HttpStatus httpStatus, String message) {
        return new ResponseEntity<>(new HttpResponse(httpStatus.value(), httpStatus, httpStatus.getReasonPhrase().toUpperCase(),
                message), httpStatus);
    }

    private HttpHeaders getJwtHeader(UserPrincipal user) {
        HttpHeaders headers = new HttpHeaders();
        headers.add(JWT_TOKEN_HEADER, jwtTokenProvider.generateJwtToken(user));
        return headers;
    }

    private void authenticate(String username, String password) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
    }
}
