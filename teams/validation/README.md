# VALIDATION TEAM
**Location**: teams/validation/
**Purpose**: Independent verification layer for claude-ops

---

## TEAM MEMBERS

| Agent | Role | Authority |
|-------|------|-----------|
| qa-validation-specialist.md | Feature Verification | PASS/CONDITIONAL/REJECT |
| production-validator.md | Deployment Readiness | READY/NOT READY/BLOCKED |
| constitutional-review-authority.md | Constitutional Compliance | FULL_APPROVAL/CONDITIONAL/REJECTION |
| lighthouse-coordinator.md | Session Orientation | Clarity validation |
| navigator-coordinator.md | Learning Capture | Memory validation |
| constellation-coordinator.md | Coordination | Orchestration validation |
| operational-validation-team.md | Operations | Daily/weekly validation |

---

## VALIDATION FLOW

```
Feature Claim
     │
     ▼
┌────────────────────┐
│ qa-validation-     │
│ specialist         │ ─── REJECT ──► Back to Director
└─────────┬──────────┘
          │ PASS/CONDITIONAL
          ▼
┌────────────────────┐
│ production-        │
│ validator          │ ─── NOT READY ──► Environment Fix
└─────────┬──────────┘
          │ READY
          ▼
┌────────────────────┐
│ constitutional-    │
│ review-authority   │ ─── REJECTION ──► Constitutional Fix
└─────────┬──────────┘
          │ FULL_APPROVAL
          ▼
    ✅ COMPLETE
```

---

## USAGE

### Validate a Feature
```bash
claude-ops feature validate --id ENG-042
```

### Run Daily Check
```bash
claude-ops validate daily
# or
./scripts/validation/daily-constitutional-check.sh
```

### Run Weekly Check
```bash
claude-ops validate weekly
# or
./scripts/validation/validate-weekly-operations.sh
```

---

**Version**: 1.0
