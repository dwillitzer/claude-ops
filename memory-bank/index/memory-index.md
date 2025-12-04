# MEMORY INDEX
**Location**: .claude/memory-bank/index/memory-index.md
**Purpose**: Navigation map for all memory-bank content

---

## DIRECTORY STRUCTURE

```
.claude/memory-bank/
├── constitutional/              ← IMMUTABLE (never edit)
│   └── CONSTITUTION.md          — Supreme rules, all agents subject to
│
├── core/                        ← POLICIES (human-edit only)
│   └── EXECUTION_POLICY.md      — How agents execute work
│
├── sops/                        ← PROCEDURES (human-edit only)
│   ├── SUBAGENT_SPAWNING.md     — How directors spawn subagents
│   └── HANDOFF_PROTOCOL.md      — How directors coordinate
│
├── active/                      ← CURRENT STATE (agents update)
│   ├── activeContext.md         — Session handoff document
│   └── active-issues.md         — Current blockers
│
├── decision_log/                ← DECISIONS (append-only)
│   └── [YYYY-MM-DD]-[topic].md  — Decision records
│
└── index/
    └── memory-index.md          — This file
```

---

## ACCESS RULES

| Directory | Read | Write | Purpose |
|-----------|------|-------|---------|
| constitutional/ | All agents | NO AGENT | Supreme rules |
| core/ | All agents | Human only | System policies |
| sops/ | All agents | Human only | Standard procedures |
| active/ | All agents | Directors (own sections) | Current state |
| decision_log/ | All agents | Directors (own decisions) | Decision history |
| index/ | All agents | Human only | Navigation |

---

## QUICK REFERENCE

### Constitutional (Must Follow)
- **CONSTITUTION.md** — Execution primacy, authority hierarchy, boundaries, coordination, memory system, enforcement

### Core Policies (Should Follow)
- **EXECUTION_POLICY.md** — Valid artifacts, tool usage, file operations, communication patterns, error handling

### SOPs (How To)
- **SUBAGENT_SPAWNING.md** — When to spawn, checklist, template, limits
- **HANDOFF_PROTOCOL.md** — When to handoff, format, routing, tracking

### Active (Current State)
- **activeContext.md** — Read first every session, update last every session
- **active-issues.md** — Current blockers and issues

---

## RELATED SYSTEMS

### AgentDB
```
Purpose: Agent skills, discoveries, cross-agent queries
Location: External (query via CLI)
Commands: npx agentdb query / reflexion store
```

### ReasoningBank
```
Purpose: Cross-agent learnings, patterns
Location: External (query via CLI)
Access: All agents read/write
```

### memory.db
```
Purpose: Operational coordination, task state
Location: .swarm/memory.db
Access: Via claude-flow
```

---

**Version**: 1.0
