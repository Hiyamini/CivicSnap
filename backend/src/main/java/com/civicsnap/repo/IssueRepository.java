package com.civicsnap.repo;

import com.civicsnap.model.Issue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;

public interface IssueRepository extends JpaRepository<Issue, Long> {

    List<Issue> findAllByOrderByCreatedAtDesc();

    List<Issue> findByDepartmentIdOrderByCreatedAtDesc(Long departmentId);

    List<Issue> findByAuthorIdOrderByCreatedAtDesc(Long authorId);

    long countByAuthorId(Long authorId);

    /** Duplicate check kosam: same department, inka resolve kaani, bounding box lopala. Exact distance Java lo. */
    @Query("select i from Issue i where i.department.id = :deptId and i.status <> :resolved "
            + "and i.createdAt >= :since "
            + "and i.latitude between :minLat and :maxLat and i.longitude between :minLng and :maxLng")
    List<Issue> findNearby(@Param("deptId") Long deptId,
                           @Param("resolved") Issue.Status resolved,
                           @Param("since") Instant since,
                           @Param("minLat") double minLat, @Param("maxLat") double maxLat,
                           @Param("minLng") double minLng, @Param("maxLng") double maxLng);
}
