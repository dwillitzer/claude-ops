# DECISION LOG TEMPLATE
**Location**: .claude/memory-bank/decision_log/
**Usage**: Copy this template for new decisions

---

## FILENAME FORMAT

```
[YYYY-MM-DD]-[SEQ]-[topic].md

Examples:
2025-12-03-001-authentication-approach.md
2025-12-03-002-database-selection.md
```

---

## DECISION RECORD TEMPLATE

```markdown
# Decision: [Title]
**ID**: [YYYY-MM-DD]-[SEQ]
**Date**: [YYYY-MM-DD]
**Director**: [Who made this decision]
**Domain**: [Architecture/Business/Design/Engineering/Research]

## Status
Proposed | Accepted | Superseded | Deprecated

## Context
[Why this decision was needed — 2-3 sentences max]

## Options Considered
1. [Option A]: [Brief description]
2. [Option B]: [Brief description]
3. [Option C]: [Brief description]

## Decision
[What we decided — be specific]

## Rationale
[Why this option — brief]

## Consequences
**Good**:
- [Benefit 1]
- [Benefit 2]

**Bad**:
- [Tradeoff 1]
- [Tradeoff 2]

## Action Items
- [ ] [Action for specific director]
- [ ] [Action for specific director]

## Related
- [Link to related decisions]
- [Link to related ADRs]
```

---

## DECISION TYPES

### Architecture Decision Record (ADR)
```
Made by: Architecture Director
Prefix: ADR-
Example: ADR-2025-12-03-001-microservices-pattern.md
```

### Business Decision
```
Made by: Business Director
Prefix: BIZ-
Example: BIZ-2025-12-03-001-q1-priorities.md
```

### Design Decision
```
Made by: Design Director
Prefix: DES-
Example: DES-2025-12-03-001-api-contract.md
```

### Arbitration Decision
```
Made by: Business Director (resolving conflict)
Prefix: ARB-
Example: ARB-2025-12-03-001-auth-vs-analytics.md
```

---

## RULES

1. **All significant decisions must be logged**
2. **Directors log their own domain decisions**
3. **Append-only** — Never delete, only supersede
4. **Link to AgentDB** — Store summary in AgentDB for queries
5. **Update activeContext.md** — Add to recent decisions

---

## QUERYING DECISIONS

```bash
# Find recent decisions
npx agentdb query "decision [topic]" --k=10

# Find by type
npx agentdb query "ADR" --k=10
npx agentdb query "ARB arbitration" --k=5
```
