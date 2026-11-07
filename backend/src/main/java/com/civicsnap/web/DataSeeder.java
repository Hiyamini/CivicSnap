package com.civicsnap.web;

import com.civicsnap.model.*;
import com.civicsnap.repo.*;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.Map;

/** First run lo departments + demo users + konni sample issues create chestundi. */
@Component
public class DataSeeder implements ApplicationRunner {

    private final DepartmentRepository departments;
    private final UserRepository users;
    private final IssueRepository issues;
    private final PasswordEncoder encoder;

    public DataSeeder(DepartmentRepository departments, UserRepository users,
                      IssueRepository issues, PasswordEncoder encoder) {
        this.departments = departments;
        this.users = users;
        this.issues = issues;
        this.encoder = encoder;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (departments.count() > 0) return;

        Map<String, Department> d = new LinkedHashMap<>();
        for (String[] x : new String[][]{
                {"ROADS", "Roads & Buildings"}, {"WATER", "Water Supply"}, {"ELECTRICITY", "Electricity"},
                {"SCHOOLS", "School Education"}, {"SANITATION", "Sanitation"}, {"HEALTH", "Health"}}) {
            d.put(x[0], departments.save(new Department(x[0], x[1])));
        }

        // Demo password anni accounts ki: demo123  (real deploy mundu maarchandi!)
        User collector = user("District Collector", "collector@civic.in", User.Role.COLLECTOR, null,
                "District Collector. Every report is read. Let's fix our district together.");
        for (Department dep : d.values()) {
            user(dep.name + " Officer", dep.code.toLowerCase() + "@civic.in", User.Role.OFFICER, dep,
                    "Officer, " + dep.name + " department. Updating status on every issue.");
        }
        User asha = user("Asha", "asha@example.com", User.Role.CITIZEN, null, "Concerned citizen.");
        User ravi = user("Ravi", "ravi@example.com", User.Role.CITIZEN, null, "Auto driver. I see every pothole.");

        issue("Big pothole near bus stand", "Two-wheelers are skidding here daily.", d.get("ROADS"),
                16.5062, 80.6480, "Bus stand road, Vijayawada", asha, Issue.Status.OPEN, 12);
        issue("Streetlight not working for 2 weeks", "Whole lane is dark at night.", d.get("ELECTRICITY"),
                16.5110, 80.6400, "Gandhi Nagar 3rd lane", ravi, Issue.Status.IN_PROGRESS, 7);
        issue("No water supply since Monday", "Tanker also not coming.", d.get("WATER"),
                16.5000, 80.6550, "Ward 14", asha, Issue.Status.OPEN, 19);
        issue("School roof leaking", "Class 5 room gets flooded when it rains.", d.get("SCHOOLS"),
                16.5200, 80.6300, "ZP High School", ravi, Issue.Status.IN_PROGRESS, 25);
        issue("Garbage not collected", "Bins overflowing for 5 days.", d.get("SANITATION"),
                16.5150, 80.6600, "Market road", asha, Issue.Status.RESOLVED, 9);
    }

    private User user(String name, String email, User.Role role, Department dep, String bio) {
        User u = new User();
        u.name = name;
        u.email = email;
        u.passwordHash = encoder.encode("demo123");
        u.role = role;
        u.department = dep;
        u.bio = bio;
        return users.save(u);
    }

    private void issue(String title, String desc, Department dep, double lat, double lng, String addr,
                       User author, Issue.Status status, int votes) {
        Issue i = new Issue();
        i.title = title;
        i.description = desc;
        i.department = dep;
        i.latitude = lat;
        i.longitude = lng;
        i.address = addr;
        i.author = author;
        i.status = status;
        i.upvoteCount = votes;
        if (status == Issue.Status.RESOLVED) {
            i.resolvedAt = java.time.Instant.now();
            i.updatedBy = users.findByEmail(dep.code.toLowerCase() + "@civic.in").orElse(null);
        }
        issues.save(i);
    }
}
