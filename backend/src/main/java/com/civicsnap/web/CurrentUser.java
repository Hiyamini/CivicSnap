package com.civicsnap.web;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/** Login ayina user id (anonymous aithe null). */
public final class CurrentUser {
    private CurrentUser() {}

    public static Long id() {
        Authentication a = SecurityContextHolder.getContext().getAuthentication();
        if (a != null && a.getPrincipal() instanceof Long l) return l;
        return null;
    }
}
