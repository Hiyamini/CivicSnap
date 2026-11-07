package com.civicsnap.web;

import com.civicsnap.model.Issue;
import com.civicsnap.model.User;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class Views {

    public Dtos.UserView user(User u) {
        return new Dtos.UserView(
                u.id, u.name, u.email, u.role.name(),
                u.department == null ? null : u.department.id,
                u.department == null ? null : u.department.code,
                u.bio == null ? "" : u.bio);
    }

    public Dtos.IssueView issue(Issue i, Set<Long> upvotedIds) {
        return new Dtos.IssueView(
                i.id, i.title, i.description,
                i.department.id, i.department.code, i.department.name,
                i.latitude, i.longitude, i.address,
                i.mediaUrl, i.mediaType, i.status.name(),
                i.author.id, i.author.name, i.author.role.name(),
                i.createdAt, i.upvoteCount,
                upvotedIds != null && upvotedIds.contains(i.id));
    }
}
