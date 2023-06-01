package fr.ToSucceed.user.service;

import com.sun.mail.smtp.SMTPTransport;
import org.springframework.stereotype.Service;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;
import java.util.Date;
import java.util.Properties;

import static fr.ToSucceed.user.constant.EmailConstant.*;
import static javax.mail.Message.RecipientType.CC;
import static javax.mail.Message.RecipientType.TO;

@Service
public class EmailService {

    public void sendNewPasswordEmail(String firstName, String password, String email) throws MessagingException, UnsupportedEncodingException {
        Properties props = System.getProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.port", DEFAULT_PORT);
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.auth", "true");

        Session session = Session.getDefaultInstance(props);

        String body = String.join(
                System.getProperty("line.separator"),
                "<h1>ToSucceed Password</h1>",
                "<p>Bonjour "+firstName+". Voici votre mot de passe : "+password+".Veuillez le garder confidentiel.</p>"
        );
        MimeMessage msg = new MimeMessage(session);
        msg.setFrom(new InternetAddress(FROM_EMAIL,"WYM Dev"));
        msg.setRecipient(Message.RecipientType.TO, new InternetAddress(email));
        msg.setSubject(EMAIL_SUBJECT);
        msg.setContent(body,"text/html");

        Transport transport = session.getTransport();

        try {
            //Connectez-vous au serveur SMTP
            transport.connect(SMTP_HOST, USERNAME, PASSWORD);

            //envoyer un e-mail
            transport.sendMessage(msg, msg.getAllRecipients());
        } catch (Exception ex) {
            System.out.println("Error message: " + ex.getMessage());
        } finally {
            transport.close();
        }

    }


    private Session getEmailSession() {
        Properties properties = System.getProperties();
        properties.put(SMTP_HOST, GMAIL_SMTP_SERVER);
        properties.put(SMTP_AUTH, true);
        properties.put(SMTP_PORT, DEFAULT_PORT);
        properties.put(SMTP_STARTTLS_ENABLE, true);
        properties.put(SMTP_STARTTLS_REQUIRED, true);
        return Session.getInstance(properties, null);
    }
}
