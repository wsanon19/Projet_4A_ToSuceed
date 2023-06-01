package fr.ToSucceed.user.enumeration;


import static fr.ToSucceed.user.constant.Authority.*;

public enum Role {
    ROLE_ELEVE(ELEVE_AUTHORITIES),
    ROLE_MANAGER(PROF_AUTHORITIES),
    ROLE_SUPER_ADMIN(SUPER_ADMIN_AUTHORITIES);

    private String[] authorities;

    Role(String... authorities) {
        this.authorities = authorities;
    }

    public String[] getAuthorities() {
        return authorities;
    }
}
