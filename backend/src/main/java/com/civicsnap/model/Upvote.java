package com.civicsnap.model;

import jakarta.persistence.*;

/** Oka user oka issue ni oka sari matrame upvote cheyyali. */
@Entity
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"issue_id", "user_id"}))
public class Upvote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @ManyToOne(optional = false)
    public Issue issue;

    @ManyToOne(optional = false)
    public User user;

    public Upvote() {}

    public Upvote(Issue issue, User user) {
        this.issue = issue;
        this.user = user;
    }
}
