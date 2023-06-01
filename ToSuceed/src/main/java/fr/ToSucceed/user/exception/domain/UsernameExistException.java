package fr.ToSucceed.user.exception.domain;

public class UsernameExistException extends Exception {
    public UsernameExistException(String message) {
        super(message);
    }
}
