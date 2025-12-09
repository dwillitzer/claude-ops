# ACTIVE CONTEXT
**Status**: CURRENT | **Updated**: [timestamp]
**Location**: .claude/memory-bank/active/activeContext.md

This file is the handoff document between sessions. Read at session start, update at session end.

---

## CURRENT STATE

### What's Happening Now
```
[Brief description of current work in progress]
```

### Active Work by Director
```
Architecture: [Current focus or "Idle"]
Business: [Current focus or "Idle"]
Design: [Current focus or "Idle"]
Engineering: [Current focus or "Idle"]
Research: [Current focus or "Idle"]
Documentation: [Current focus or "Idle"]
```

### Active Subagents
```
[List of active subagents and their tasks, or "None"]
- engineering/auth-implementer.md — Implementing OAuth flow
- research/benchmark-runner.md — Running performance benchmarks
```

---

## PENDING HANDOFFS

```
[Handoffs awaiting response, or "None"]
- [YYYY-MM-DD] Engineering → Documentation: Feature X complete, needs docs
- [YYYY-MM-DD] Research → Architecture: Recommendation ready for decision
```

---

## BLOCKERS

```
[Current blockers, or "None"]
- [Director]: [Blocker description] — Waiting on [what]
```

---

## RECENT DECISIONS

```
[Last 3-5 significant decisions]
- [YYYY-MM-DD] Architecture: ADR-001 — Chose microservices pattern
- [YYYY-MM-DD] Business: Prioritized auth over analytics
```

---

## NEXT ACTIONS

### Immediate (This Session)
```
1. [Most important next action]
2. [Second priority]
3. [Third priority]
```

### Upcoming (Next Sessions)
```
- [Planned work item]
- [Planned work item]
```

---

## SESSION NOTES

### Previous Session
```
Completed: [What was done]
Issues: [Problems encountered]
Handoff: [What next session needs to know]
```

### This Session
```
Started: [timestamp]
Focus: [Primary objective]
Notes: [Add notes during session]
```

---

## QUICK QUERIES

```bash
# Find pending work
npx agentdb query "pending" --k=10

# Check handoffs
npx agentdb query "handoff" --k=5

# Recent decisions
npx agentdb query "decision" --k=5
```

---

**Update Protocol**:
- Read at session START
- Update "This Session" notes DURING session
- Update all sections at session END
- Move "This Session" to "Previous Session" on next session start
