package com.civicsnap.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "users")
public class User {
    public enum Role { CITIZEN, OFFICER, COLLECTOR }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    public String name;

    @Column(unique = true, nullable = false)
    public String email;

    @Column(nullable = false)
    public String passwordHash;

    @Enumerated(EnumType.STRING)
    public Role role = Role.CITIZEN;

    /** Officer ki matrame (e department vaadu) */
    @ManyToOne
    public Department department;

    @Column(length = 300)
    public String bio = "";

    public Instant createdAt = Instant.now();
}
