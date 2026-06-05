package com.evcharge.auth.config;

import com.evcharge.auth.entity.UserCredential;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

public class CustomUserDetails implements UserDetails {

    private String username;
    private String password;
    private List<GrantedAuthority> authorities;

    public CustomUserDetails(UserCredential userCredential) {
        this.username = userCredential.getUsername();
        this.password = userCredential.getPassword();
        // Assuming roles are stored as comma separated string "ROLE_USER,ROLE_ADMIN"
        if (userCredential.getRoles() != null && !userCredential.getRoles().isEmpty()) {
             this.authorities = Arrays.stream(userCredential.getRoles().split(","))
                .map(role -> role.trim().startsWith("ROLE_") ? role.trim() : "ROLE_" + role.trim())
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
        } else {
             this.authorities = java.util.Collections.emptyList();
        }
       
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
