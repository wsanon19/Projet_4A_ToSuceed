package fr.ToSucceed.user.exception.domain;

public class EmailExistException extends Exception {
    public EmailExistException(String message) {
        super(message);
    }
}
