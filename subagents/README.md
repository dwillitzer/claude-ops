# SUBAGENTS DIRECTORY
**Location**: .claude/subagents/
**Authority**: Directors spawn in their domain subdirectory

---

## STRUCTURE

```
.claude/subagents/
├── architecture/    ← Architecture Director spawns here
├── business/        ← Business Director spawns here
├── design/          ← Design Director spawns here
├── engineering/     ← Engineering Director spawns here
├── research/        ← Research Director spawns here
└── documentation/   ← Documentation Director spawns here
```

---

## RULES

1. **Directors spawn in their own domain only**
2. **Subagents are NOT in main context** — Query via AgentDB
3. **Subagents cannot spawn subagents** — Only directors spawn
4. **Register in AgentDB** — All subagents must be registered
5. **Terminate when complete** — Don't accumulate
6. **MAX 8 per director** — Concurrent subagent limit

---

## SUBAGENT LIFECYCLE

```
1. Director creates subagent file in their domain
2. Director deploys via claude-flow
3. Director registers in AgentDB
4. Subagent executes task
5. Subagent reports to parent
6. Director verifies completion
7. Subagent terminated
8. File archived or deleted
```

---

## FINDING SUBAGENTS

```bash
# List all registered subagents
npx agentdb query "subagent" --k=20

# Find by domain
npx agentdb query "subagent engineering" --k=10

# Find active
npx claude-flow@alpha agent list
```

---

## TEMPLATE

See: .claude/memory-bank/sops/SUBAGENT_SPAWNING.md

---

**Note**: This directory is intentionally OUTSIDE main agent context.
Directors must query AgentDB to discover subagent capabilities.
