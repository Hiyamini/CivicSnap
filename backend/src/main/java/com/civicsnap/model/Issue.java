package com.civicsnap.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
public class Issue {
    public enum Status { OPEN, IN_PROGRESS, RESOLVED }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    public String title;

    @Column(length = 2000)
    public String description;

    @ManyToOne(optional = false)
    public Department department;

    public double latitude;
    public double longitude;

    @Column(length = 300)
    public String address;

    /** /uploads/xxxx.jpg  (photo leda video) */
    public String mediaUrl;
    /** "image" leda "video" */
    public String mediaType;

    @Enumerated(EnumType.STRING)
    public Status status = Status.OPEN;

    @ManyToOne(optional = false)
    public User author;

    /** Status ni evaru maarchaaro (officer/collector) */
    @ManyToOne
    public User updatedBy;

    public Instant createdAt = Instant.now();
    public Instant resolvedAt;

    public int upvoteCount;
}
