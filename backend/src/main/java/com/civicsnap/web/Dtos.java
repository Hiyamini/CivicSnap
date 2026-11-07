package com.civicsnap.web;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.util.List;

/** Frontend ki pampe JSON shapes (entities direct ga pampam, passwordHash leak avutundi). */
public class Dtos {

    public record RegisterReq(@NotBlank @Size(max = 80) String name,
                              @NotBlank @Email String email,
                              @NotBlank @Size(min = 6, max = 100) String password) {}

    public record LoginReq(@NotBlank String email, @NotBlank String password) {}

    public record ProfileReq(@Size(max = 80) String name, @Size(max = 300) String bio) {}

    public record StatusReq(@NotBlank String status) {}

    public record UserView(Long id, String name, String email, String role,
                           Long departmentId, String departmentCode, String bio) {}

    public record AuthRes(String token, UserView user) {}

    public record IssueView(Long id, String title, String description,
                            Long departmentId, String departmentCode, String departmentName,
                            double latitude, double longitude, String address,
                            String mediaUrl, String mediaType, String status,
                            Long authorId, String authorName, String authorRole,
                            Instant createdAt, int upvotes, boolean upvotedByMe) {}

    public record ProfileView(UserView user, Instant joinedAt, long posts, long resolved,
                              List<IssueView> issues) {}

    public record DeptStat(Long id, String code, String name,
                           long total, long open, long inProgress, long resolved) {}
}
