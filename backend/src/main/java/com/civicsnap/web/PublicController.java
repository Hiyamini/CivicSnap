package com.civicsnap.web;

import com.civicsnap.model.Department;
import com.civicsnap.model.Issue;
import com.civicsnap.repo.DepartmentRepository;
import com.civicsnap.repo.IssueRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** Login avasaram ledu: departments list + dashboard counts. */
@RestController
@RequestMapping("/api")
public class PublicController {

    private final DepartmentRepository departments;
    private final IssueRepository issues;

    public PublicController(DepartmentRepository departments, IssueRepository issues) {
        this.departments = departments;
        this.issues = issues;
    }

    @GetMapping("/departments")
    public List<Department> departments() {
        return departments.findAll();
    }

    @GetMapping("/dashboard")
    @Transactional(readOnly = true)
    public List<Dtos.DeptStat> dashboard() {
        List<Issue> all = issues.findAll();
        return departments.findAll().stream().map(d -> {
            long open = 0, prog = 0, res = 0;
            for (Issue i : all) {
                if (!i.department.id.equals(d.id)) continue;
                switch (i.status) {
                    case OPEN -> open++;
                    case IN_PROGRESS -> prog++;
                    case RESOLVED -> res++;
                }
            }
            return new Dtos.DeptStat(d.id, d.code, d.name, open + prog + res, open, prog, res);
        }).toList();
    }
}
