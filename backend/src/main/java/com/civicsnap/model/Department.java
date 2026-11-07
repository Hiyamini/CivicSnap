package com.civicsnap.model;

import jakarta.persistence.*;

@Entity
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    /** Stable key like ROADS, WATER. Frontend ee key tho translate chestundi. */
    @Column(unique = true, nullable = false)
    public String code;

    public String name;

    public Department() {}

    public Department(String code, String name) {
        this.code = code;
        this.name = name;
    }
}
