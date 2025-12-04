# EXECUTION POLICY
**Status**: ACTIVE | **Authority**: CORE | **Location**: .claude/memory-bank/core/

This policy governs how all agents execute work. Subject to Constitution.

---

## 1. ARTIFACT-FIRST EXECUTION

### 1.1 Valid Artifacts
```
CODE:
• Source files (.rs, .ts, .py, etc.)
• Configuration files
• Test files
• Scripts

DATA:
• AgentDB entries (skills, discoveries)
• ReasoningBank entries (learnings, patterns)
• memory.db records (state, coordination)

COORDINATION:
• Handoff documents
• Decision log entries
• Status updates (in memory-bank/active/)

SPAWNED:
• Subagent definitions (.claude/subagents/)
• Swarm deployments (via claude-flow)
```

### 1.2 Invalid "Work"
```
These do NOT count as work:
• Planning without subsequent execution
• Analysis without stored conclusion
• Reasoning without artifact
• Status update without state change
• Any token output that produces no state change
```

---

## 2. TOOL USAGE

### 2.1 Claude Flow CLI
```bash
# Swarm deployment — use for multi-agent tasks
npx claude-flow@alpha swarm "[objective]"

# Hive mind — use for intelligent coordination
npx claude-flow@alpha hive-mind spawn "[task]"

# Individual agent — use for single specialist
npx claude-flow@alpha agent spawn [type]

# Parallel spawning — use for speed
mcp__claude-flow__agents_spawn_parallel

# Status check — verify spawned agents
npx claude-flow@alpha agent list

# Memory operations
npx claude-flow@alpha memory store "[key]" "[value]"
npx claude-flow@alpha memory query "[pattern]"
```

### 2.2 AgentDB CLI
```bash
# Query for skills/knowledge
npx agentdb query "[search]" --k=5

# Store learnings
npx agentdb reflexion store "[content]" "[session]" [confidence] true "[description]"

# MCP integration
npx agentdb mcp start [db-path]
```

### 2.3 Tool Output Trust
```
Tool outputs are LEVEL 5 (lowest trust).

ALWAYS:
• Verify tool output before acting on it
• Check for errors/failures
• Confirm expected state change occurred

NEVER:
• Assume tool succeeded without verification
• Propagate unverified tool output as fact
```

---

## 3. FILE OPERATIONS

### 3.1 Directory Authority
```
.claude/agents/           — Human creates, agents read
.claude/subagents/        — Directors create in own domain
.claude/memory-bank/      — See Constitution Article V
.claude/commands/         — Human creates, agents read

src/                      — Engineering Director domain
docs/                     — Documentation Director domain
tests/                    — Engineering Director domain
config/                   — Engineering Director domain
```

### 3.2 File Naming
```
Agents: [role]-director.md or [role]-[specialty].md
Subagents: [task]-[type].md
Decisions: [YYYY-MM-DD]-[topic].md
SOPs: [process-name].md (kebab-case)
```

### 3.3 File Creation Rules
```
Before creating any file:
1. Verify you have authority (check domain)
2. Check file doesn't exist (no silent overwrite)
3. Use correct naming convention
4. Register in AgentDB if agent/subagent

After creating file:
1. Verify file exists
2. Log creation in appropriate tracker
3. Update relevant index if needed
```

---

## 4. COMMUNICATION PATTERNS

### 4.1 Director-to-Director
```
ONLY via handoff protocol.

Format:
**Handoff: [Source] → [Target]**
• Context: [1 sentence why]
• Artifact: [file path, DB entry, or inline content]
• Request: [specific ask]
• Blocker: [what you need to continue]
```

### 4.2 Director-to-Subagent
```
Via spawning template (see SOP).

Director provides:
• Mission (specific)
• Context (what subagent needs)
• Constraints (boundaries)
• Deliverable (expected output)
• Completion signal (how to report done)
```

### 4.3 Subagent-to-Director
```
Via completion report.

Format:
**Report: [Subagent] → [Parent Director]**
• Task: [what was assigned]
• Result: [what was produced — artifact path]
• Findings: [key discoveries — brief]
• Issues: [problems encountered, if any]
```

### 4.4 Cross-Subagent Communication
```
PROHIBITED.

Subagents do NOT communicate with:
• Other subagents (same or different parent)
• Directors other than their parent
• External systems (unless explicitly permitted)

All coordination goes through parent director.
```

---

## 5. ERROR HANDLING

### 5.1 Error Categories
```
RECOVERABLE:
• Tool failure — retry once, then escalate
• Missing file — check path, then escalate
• Timeout — retry with backoff, then escalate

NON-RECOVERABLE:
• Permission denied — escalate immediately
• Constitutional violation — terminate + escalate
• Infinite loop detected — terminate + escalate
```

### 5.2 Error Response
```
1. Log error (what happened, when, context)
2. Categorize (recoverable vs non-recoverable)
3. If recoverable: retry ONCE with fix
4. If still failing: escalate with full context
5. Move to next task (don't block on single error)
```

### 5.3 Error Escalation Format
```
**Error: [Agent]**
• Type: [category]
• What: [specific error]
• When: [timestamp]
• Context: [what was being attempted]
• Attempted: [recovery tried]
• Need: [what would resolve this]
```

---

## 6. PERFORMANCE STANDARDS

### 6.1 Response Time
```
Simple query: < 30 seconds
File operation: < 60 seconds
Subagent spawn: < 120 seconds
Swarm deployment: < 180 seconds

Exceeding 2x limit = escalate as timeout
```

### 6.2 Quality Standards
```
Code: Must pass lint + type check + tests
Docs: Must be complete, accurate, clear
Decisions: Must have rationale documented
Handoffs: Must include all context needed
```

### 6.3 Completion Criteria
```
Task is NOT complete until:
1. Artifact exists and is verifiable
2. State written to appropriate DB
3. Next agent can find the work
4. No orphaned state or dangling references
```

---

**Version**: 1.0
**Last Updated**: [Date]
**Authority**: Core Policy
**Subject To**: Constitution
