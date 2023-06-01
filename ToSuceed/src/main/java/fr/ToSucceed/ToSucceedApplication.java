package fr.ToSucceed;


import fr.ToSucceed.abonnement.repository.IAbonnement;
import fr.ToSucceed.cours.repository.ICours;
import fr.ToSucceed.messagedujour.repository.IMessageDuJour;

import fr.ToSucceed.commentaire.repository.ICommentaire;
import fr.ToSucceed.messagedujour.model.MessageDuJour;

import fr.ToSucceed.user.domain.User;
import fr.ToSucceed.user.repository.UserRepository;
import fr.ToSucceed.user.service.impl.UserServiceImpl;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.Collections;
import java.util.Date;

@SpringBootApplication
public class ToSucceedApplication {

    public static void main(String[] args) {
        SpringApplication.run(ToSucceedApplication.class, args);
    }

    @Bean
    CommandLineRunner runner(IAbonnement iAbonnement,
                             ICommentaire iCommentaire ,
                             ICours iCours,
                             IMessageDuJour iMessageDuJour,
                             UserServiceImpl userService,
                             UserRepository userRepository){
        return args -> {

            User user = new User();
            user.setUserId(userService.generateUserId());
            user.setFirstName("Maël");
            user.setLastName("Cipriani");
            user.setJoinDate(new Date());
            user.setUsername("MACI");
            user.setEmail("maelcipriani@gmail.com");
            user.setPassword(userService.encodePassword("mdpadmin"));
            user.setActive(true);
            user.setNotLocked(true);
            user.setRole(userService.getRoleEnumName("ROLE_SUPER_ADMIN").name());
            user.setAuthorities(userService.getRoleEnumName("ROLE_SUPER_ADMIN").getAuthorities());
            if(userRepository.findUserByUsername("MACI")==null) userRepository.save(user);


            MessageDuJour messageDuJour = new MessageDuJour();
            messageDuJour.setUser(userRepository.findUserByUsername("MACI"));
            messageDuJour.setContenu_msg("Être ou ne pas être, telle est la question...");
            if (iMessageDuJour.findMessageDuJourById(2)==null) iMessageDuJour.save(messageDuJour);



        };
    }

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource = new UrlBasedCorsConfigurationSource();
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowCredentials(true);
        //corsConfiguration.setAllowedOrigins(Collections.singletonList("http://localhost:4200"));
        corsConfiguration.setAllowedOrigins(Arrays.asList("http://localhost:4200","http://13.37.112.147","http://www.tosucceed.site" ,"http://tosucceed.site"));
        corsConfiguration.setAllowedHeaders(Arrays.asList("Origin", "Access-Control-Allow-Origin", "Content-Type",
                "Accept", "Jwt-Token", "Authorization", "Origin, Accept", "X-Requested-With",
                "Access-Control-Request-Method", "Access-Control-Request-Headers"));
        corsConfiguration.setExposedHeaders(Arrays.asList("Origin", "Content-Type", "Accept", "Jwt-Token", "Authorization",
                "Access-Control-Allow-Origin", "Access-Control-Allow-Origin", "Access-Control-Allow-Credentials"));
        corsConfiguration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        urlBasedCorsConfigurationSource.registerCorsConfiguration("/**", corsConfiguration);
        return new CorsFilter(urlBasedCorsConfigurationSource);
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
