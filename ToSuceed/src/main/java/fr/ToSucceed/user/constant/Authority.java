package fr.ToSucceed.user.constant;

public class Authority {
    public static final String[] ELEVE_AUTHORITIES = { "user:read" };
    public static final String[] PROF_AUTHORITIES = { "user:read", "user:update" };
    public static final String[] SUPER_ADMIN_AUTHORITIES = { "user:read", "user:create", "user:update", "user:delete" };
}
