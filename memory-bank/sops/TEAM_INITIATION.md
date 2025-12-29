# SOP: SUBAGENT SPAWNING
**Status**: ACTIVE | **Authority**: SOP | **Location**: .claude/memory-bank/sops/

Standard procedure for directors spawning subagents.

---

## WHEN TO SPAWN

```
SPAWN when:
• Task is well-defined and bounded
• Task is within your domain
• Parallel execution would speed up work
• Specialist expertise needed
• Your context is too loaded for the task

DO NOT SPAWN when:
• Task is trivial (do it yourself)
• Task crosses domain boundaries (handoff instead)
• You're avoiding doing work (that's cheating)
• Similar subagent already exists (query AgentDB first)
```

---

## PRE-SPAWN CHECKLIST

```
[ ] Task is specific and measurable
[ ] Task is within my domain authority
[ ] AgentDB queried — no existing agent fits
[ ] Estimated duration is bounded
[ ] Deliverable is clearly defined
[ ] I have context to provide
[ ] Completion criteria are objective
```

---

## SPAWNING PROCESS

### Step 1: Create Subagent File
```
Location: .claude/subagents/[your-domain]/[task]-[type].md

Example: .claude/subagents/engineering/auth-implementer.md
```

### Step 2: Use Template
```markdown
# [TASK] [TYPE]
**Parent**: [Your Director Role]
**Domain**: [Your Domain]
**Location**: .claude/subagents/[domain]/[filename].md
**Lifespan**: Task | Session | Persistent
**Created**: [timestamp]

## MISSION
[One sentence. Specific. Measurable. No fluff.]

## CONTEXT
[What subagent needs to know to execute. Include:]
• Relevant background
• Related work in progress
• Key constraints
• Files/resources available

## SCOPE
MUST:
• [Required action 1]
• [Required action 2]
• Report completion to parent

MUST NOT:
• Spawn additional agents
• Modify files outside: [specific scope]
• Communicate with other directors
• Exceed [time/token] budget

## DELIVERABLE
Artifact: [specific file, entry, or output]
Location: [where to put it]
Format: [expected format]

## COMPLETION
When done:
1. Verify deliverable exists
2. Store in AgentDB: `npx agentdb reflexion store "[summary]" "[session]" [confidence] true "[desc]"`
3. Report to parent:
   **Report: [Subagent] → [Parent]**
   • Task: [assigned task]
   • Result: [artifact location]
   • Findings: [key points]
   • Issues: [if any]

## ESCALATE IF
• Blocked > 5 minutes
• Scope unclear
• Need authority you don't have
• Security concern found
```

### Step 3: Deploy via Claude Flow
```bash
# For single subagent
npx claude-flow@alpha agent spawn [agent-type] --config=.claude/subagents/[domain]/[file].md

# For multiple parallel agents for a single objective, use 'swarm' with '--parallel'
npx claude-flow@alpha swarm "[objective]" --parallel --max-agents [N]
# For intelligent auto-spawning based on task, use 'automation auto-agent' or 'smart-spawn'
npx claude-flow@alpha automation auto-agent --task-complexity [complexity] --swarm-id [swarm-id]
# npx claude-flow@alpha automation smart-spawn --requirement "[requirement]" --max-agents [N]

# Verify deployment
npx claude-flow@alpha agent list
```

### Step 4: Register in AgentDB
```bash
npx agentdb reflexion store \
  "Spawned [agent-name] for [purpose]" \
  "[session-id]" \
  0.9 \
  true \
  "subagent: [domain]/[filename]"
```

---

## POST-SPAWN RESPONSIBILITIES

```
Parent director MUST:
• Monitor subagent progress (don't fire-and-forget)
• Be available for escalations
• Receive and verify completion reports
• Synthesize findings into own work
• Terminate subagent when task complete
• Update AgentDB with subagent capabilities discovered

Parent director MUST NOT:
• Spawn and ignore
• Let subagents run indefinitely
• Let subagents accumulate without cleanup
```

---

## SUBAGENT LIMITS

```
Per director: MAX 8 concurrent subagents
Per task: MAX 5 subagents in single swarm
Lifespan: MAX 1 session unless marked Persistent

Exceeding limits requires:
• Terminate existing subagents first
• Or escalate for exception approval
```

---

## TERMINATION

### Normal Completion
```
1. Subagent reports completion
2. Parent verifies deliverable
3. Parent extracts learnings to ReasoningBank
4. Subagent file archived or deleted
5. AgentDB updated with outcome
```

### Early Termination
```
1. Parent determines task no longer needed
2. Parent terminates via claude-flow
3. Partial work preserved if valuable
4. Reason logged in decision_log
```

### Timeout Termination
```
1. Subagent exceeds time budget
2. Auto-terminate triggered
3. Parent notified
4. Partial work evaluated
5. Escalate if critical task
```

---

## ANTI-PATTERNS

```
❌ Spawning to avoid doing work yourself
❌ Spawning without clear deliverable
❌ Fire-and-forget spawning
❌ Spawning across domain boundaries
❌ Letting subagents accumulate
❌ Spawning subagents that spawn subagents
❌ Using subagents as "thinking" agents
```

---

**Version**: 1.0
**Last Updated**: [Date]
**Authority**: SOP
**Subject To**: Constitution, Core Policies
