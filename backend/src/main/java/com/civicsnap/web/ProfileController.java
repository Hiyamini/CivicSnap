package com.civicsnap.web;

import com.civicsnap.model.Issue;
import com.civicsnap.model.User;
import com.civicsnap.repo.IssueRepository;
import com.civicsnap.repo.UpvoteRepository;
import com.civicsnap.repo.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Set;

/** Instagram laanti profile: citizen, officer, collector andariki. */
@RestController
@RequestMapping("/api/users")
public class ProfileController {

    private final UserRepository users;
    private final IssueRepository issues;
    private final UpvoteRepository upvotes;
    private final Views views;

    public ProfileController(UserRepository users, IssueRepository issues, UpvoteRepository upvotes, Views views) {
        this.users = users;
        this.issues = issues;
        this.upvotes = upvotes;
        this.views = views;
    }

    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    public Dtos.ProfileView profile(@PathVariable Long id) {
        User u = users.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        Long me = CurrentUser.id();
        Set<Long> mine = me == null ? Set.of() : upvotes.issueIdsUpvotedBy(me);

        List<Issue> posts = issues.findByAuthorIdOrderByCreatedAtDesc(id);
        // Citizen: na posts lo entha resolve ayyayi. Officer/Collector: nenu entha resolve chesanu.
        long resolved = u.role == User.Role.CITIZEN
                ? posts.stream().filter(i -> i.status == Issue.Status.RESOLVED).count()
                : issues.findAll().stream()
                    .filter(i -> i.status == Issue.Status.RESOLVED && i.updatedBy != null && i.updatedBy.id.equals(id))
                    .count();

        return new Dtos.ProfileView(views.user(u), u.createdAt, posts.size(), resolved,
                posts.stream().map(i -> views.issue(i, mine)).toList());
    }

    /** Nenu naa peru/bio maarchukovadam. */
    @PutMapping("/me")
    @Transactional
    public Dtos.UserView update(@Valid @RequestBody Dtos.ProfileReq req) {
        Long me = CurrentUser.id();
        User u = users.findById(me).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        if (req.name() != null && !req.name().isBlank()) u.name = req.name().trim();
        if (req.bio() != null) u.bio = req.bio();
        users.save(u);
        return views.user(u);
    }
}
