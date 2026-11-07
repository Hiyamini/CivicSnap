package com.civicsnap.web;

import com.civicsnap.model.User;
import com.civicsnap.repo.UserRepository;
import com.civicsnap.security.JwtService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;
    private final Views views;

    public AuthController(UserRepository users, PasswordEncoder encoder, JwtService jwt, Views views) {
        this.users = users;
        this.encoder = encoder;
        this.jwt = jwt;
        this.views = views;
    }

    /** Public signup eppudu CITIZEN matrame. Officer/Collector ni admin (seed) create chestundi. */
    @PostMapping("/auth/register")
    public Dtos.AuthRes register(@Valid @RequestBody Dtos.RegisterReq req) {
        String email = req.email().trim().toLowerCase();
        if (users.findByEmail(email).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }
        User u = new User();
        u.name = req.name().trim();
        u.email = email;
        u.passwordHash = encoder.encode(req.password());
        u.role = User.Role.CITIZEN;
        users.save(u);
        return new Dtos.AuthRes(jwt.create(u.id, u.role.name()), views.user(u));
    }

    @PostMapping("/auth/login")
    public Dtos.AuthRes login(@Valid @RequestBody Dtos.LoginReq req) {
        User u = users.findByEmail(req.email().trim().toLowerCase())
                .filter(x -> encoder.matches(req.password(), x.passwordHash))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Wrong email or password"));
        return new Dtos.AuthRes(jwt.create(u.id, u.role.name()), views.user(u));
    }

    @GetMapping("/me")
    public Dtos.UserView me() {
        Long id = CurrentUser.id();
        if (id == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        return views.user(users.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED)));
    }
}
