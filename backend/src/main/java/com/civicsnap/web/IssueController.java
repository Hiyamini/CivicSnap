package com.civicsnap.web;

import com.civicsnap.model.*;
import com.civicsnap.repo.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.time.Instant;
import java.util.*;

@RestController
@RequestMapping("/api/issues")
public class IssueController {

    private static final double DUPLICATE_RADIUS_M = 100;
    private static final long DUPLICATE_DAYS = 30;

    private final IssueRepository issues;
    private final DepartmentRepository departments;
    private final UserRepository users;
    private final UpvoteRepository upvotes;
    private final Views views;
    private final Path uploadDir;

    public IssueController(IssueRepository issues, DepartmentRepository departments, UserRepository users,
                           UpvoteRepository upvotes, Views views, @Value("${app.upload-dir}") String uploadDir) {
        this.issues = issues;
        this.departments = departments;
        this.users = users;
        this.upvotes = upvotes;
        this.views = views;
        this.uploadDir = Path.of(uploadDir).toAbsolutePath();
    }

    private Set<Long> myUpvotes() {
        Long me = CurrentUser.id();
        return me == null ? Set.of() : upvotes.issueIdsUpvotedBy(me);
    }

    // ---------- Feed ----------

    @GetMapping
    @Transactional(readOnly = true)
    public List<Dtos.IssueView> feed(@RequestParam(required = false) Long departmentId,
                                     @RequestParam(required = false) String status) {
        List<Issue> list = departmentId == null
                ? issues.findAllByOrderByCreatedAtDesc()
                : issues.findByDepartmentIdOrderByCreatedAtDesc(departmentId);
        Set<Long> mine = myUpvotes();
        return list.stream()
                .filter(i -> status == null || status.isBlank() || i.status.name().equalsIgnoreCase(status))
                .map(i -> views.issue(i, mine)).toList();
    }

    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    public Dtos.IssueView one(@PathVariable Long id) {
        Issue i = issues.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return views.issue(i, myUpvotes());
    }

    // ---------- Duplicate check ----------

    /** Same department, 100m lopala, last 30 rojullo, inka resolve kaani issues. */
    @GetMapping("/nearby")
    @Transactional(readOnly = true)
    public List<Dtos.IssueView> nearby(@RequestParam Long departmentId,
                                       @RequestParam double lat, @RequestParam double lng) {
        double dLat = DUPLICATE_RADIUS_M / 111_320.0;
        double dLng = DUPLICATE_RADIUS_M / (111_320.0 * Math.max(0.01, Math.cos(Math.toRadians(lat))));
        Instant since = Instant.now().minus(Duration.ofDays(DUPLICATE_DAYS));
        Set<Long> mine = myUpvotes();
        return issues.findNearby(departmentId, Issue.Status.RESOLVED, since,
                        lat - dLat, lat + dLat, lng - dLng, lng + dLng).stream()
                .filter(i -> distanceM(lat, lng, i.latitude, i.longitude) <= DUPLICATE_RADIUS_M)
                .map(i -> views.issue(i, mine)).toList();
    }

    static double distanceM(double lat1, double lon1, double lat2, double lon2) {
        double r = 6_371_000;
        double p1 = Math.toRadians(lat1), p2 = Math.toRadians(lat2);
        double dp = Math.toRadians(lat2 - lat1), dl = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dp / 2) * Math.sin(dp / 2)
                + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) * Math.sin(dl / 2);
        return 2 * r * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    // ---------- Create ----------

    @PostMapping(consumes = "multipart/form-data")
    @Transactional
    public Dtos.IssueView create(@RequestParam String title,
                                 @RequestParam(defaultValue = "") String description,
                                 @RequestParam Long departmentId,
                                 @RequestParam double latitude,
                                 @RequestParam double longitude,
                                 @RequestParam(defaultValue = "") String address,
                                 @RequestParam(required = false) MultipartFile file) throws IOException {
        Long me = CurrentUser.id();
        User author = users.findById(me).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        Department dept = departments.findById(departmentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown department"));
        if (title.isBlank() || title.length() > 150)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Title required (max 150 chars)");
        if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid location");

        Issue i = new Issue();
        i.title = title.trim();
        i.description = description.length() > 2000 ? description.substring(0, 2000) : description;
        i.department = dept;
        i.latitude = latitude;
        i.longitude = longitude;
        i.address = address.length() > 300 ? address.substring(0, 300) : address;
        i.author = author;

        if (file != null && !file.isEmpty()) {
            String type = Optional.ofNullable(file.getContentType()).orElse("");
            String ext = switch (type) {
                case "image/jpeg" -> ".jpg";
                case "image/png" -> ".png";
                case "image/webp" -> ".webp";
                case "video/mp4" -> ".mp4";
                case "video/webm" -> ".webm";
                default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Only jpg/png/webp images or mp4/webm videos allowed");
            };
            Files.createDirectories(uploadDir);
            String name = UUID.randomUUID() + ext; // user pampina filename vadam (path traversal safe)
            file.transferTo(uploadDir.resolve(name));
            i.mediaUrl = "/uploads/" + name;
            i.mediaType = type.startsWith("video") ? "video" : "image";
        }
        issues.save(i);
        return views.issue(i, Set.of());
    }

    // ---------- Upvote toggle ----------

    @PostMapping("/{id}/upvote")
    @Transactional
    public Dtos.IssueView upvote(@PathVariable Long id) {
        Long me = CurrentUser.id();
        User user = users.findById(me).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        Issue i = issues.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        Optional<Upvote> existing = upvotes.findByIssueIdAndUserId(id, me);
        if (existing.isPresent()) {
            upvotes.delete(existing.get());
            i.upvoteCount = Math.max(0, i.upvoteCount - 1);
        } else {
            upvotes.save(new Upvote(i, user));
            i.upvoteCount++;
        }
        issues.save(i);
        return views.issue(i, upvotes.issueIdsUpvotedBy(me));
    }

    // ---------- Status update (Officer of that dept, or Collector) ----------

    @PatchMapping("/{id}/status")
    @Transactional
    public Dtos.IssueView status(@PathVariable Long id, @RequestBody Dtos.StatusReq req) {
        Long me = CurrentUser.id();
        User user = users.findById(me).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        Issue i = issues.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        boolean collector = user.role == User.Role.COLLECTOR;
        boolean ownOfficer = user.role == User.Role.OFFICER && user.department != null
                && user.department.id.equals(i.department.id);
        if (!collector && !ownOfficer)
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only the department officer or collector can update status");

        Issue.Status s;
        try {
            s = Issue.Status.valueOf(req.status().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Status must be OPEN, IN_PROGRESS or RESOLVED");
        }
        i.status = s;
        i.updatedBy = user;
        i.resolvedAt = s == Issue.Status.RESOLVED ? Instant.now() : null;
        issues.save(i);
        return views.issue(i, upvotes.issueIdsUpvotedBy(me));
    }
}
