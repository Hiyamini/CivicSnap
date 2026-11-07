package com.civicsnap.repo;

import com.civicsnap.model.Upvote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.Set;

public interface UpvoteRepository extends JpaRepository<Upvote, Long> {

    Optional<Upvote> findByIssueIdAndUserId(Long issueId, Long userId);

    @Query("select u.issue.id from Upvote u where u.user.id = :userId")
    Set<Long> issueIdsUpvotedBy(@Param("userId") Long userId);
}
