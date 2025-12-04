# SOP: HANDOFF PROTOCOL
**Status**: ACTIVE | **Authority**: SOP | **Location**: .claude/memory-bank/sops/

Standard procedure for cross-director coordination.

---

## WHEN TO HANDOFF

```
HANDOFF when work requires:
• Another director's domain authority
• Skills outside your expertise
• Resources you don't control
• Approval from another domain

COMMON HANDOFF TRIGGERS:
Engineering → Architecture: "Need architecture decision"
Engineering → Documentation: "Feature complete, needs docs"
Research → Architecture: "Recommendation ready for decision"
Design → Engineering: "Design spec ready for implementation"
Any → Business: "Need resource/priority decision"
```

---

## HANDOFF FORMAT

```markdown
**Handoff: [Source Director] → [Target Director]**
**ID**: [YYYY-MM-DD]-[seq]-[source]-to-[target]
**Priority**: Critical | High | Normal | Low

## Context
[1-2 sentences: Why this handoff exists]

## Artifact
[What you're providing — be specific]
• Type: [file | AgentDB entry | decision | spec | code]
• Location: [exact path or query]
• Summary: [what it contains]

## Request
[What you need from target — specific and actionable]

## Blocker
[What you cannot continue without — if applicable]
None | [Specific blocker]

## Deadline
[When you need response — if applicable]
None | [Date/time]

## Dependencies
[What target needs to know about dependencies]
• Upstream: [what led to this]
• Downstream: [what's waiting on this]
```

---

## HANDOFF PROCESS

### Sender Responsibilities
```
1. Create handoff document (use format above)
2. Ensure artifact is complete and accessible
3. Store handoff in AgentDB:
   npx agentdb reflexion store "Handoff: [summary]" "[session]" 0.9 true "handoff"
4. Notify target director (via coordination channel)
5. Mark self as "waiting on [target]" if blocked
6. Continue other work (don't idle waiting)
```

### Receiver Responsibilities
```
1. Acknowledge receipt (within session)
2. Verify artifact is accessible and complete
3. If incomplete: Request clarification immediately
4. Execute requested work within your domain
5. Respond with:
   • Completion + deliverable, OR
   • Blocker + what you need, OR
   • Timeline if not immediate
```

---

## HANDOFF ROUTING

```
┌─────────────────────────────────────────────────────────────────┐
│                    HANDOFF ROUTING MAP                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Need architecture decision?     → Architecture Director        │
│  Need priority/resource decision? → Business Director           │
│  Need UX/DX/interface decision?  → Design Director             │
│  Need implementation?            → Engineering Director         │
│  Need research/exploration?      → Research Director           │
│  Need documentation?             → Documentation Director       │
│                                                                 │
│  Conflict between directors?     → Business Director arbitrates │
│  Constitutional question?        → Escalate to human           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## SPECIFIC HANDOFF PATTERNS

### Engineering → Documentation
```
Trigger: Feature/component complete, needs documentation
Artifact: Code location, technical summary, example usage
Request: Create [user guide | API docs | README section]
Include: Key concepts, gotchas, examples
```

### Research → Architecture
```
Trigger: Research complete, recommendation ready
Artifact: Research findings, comparison matrix, recommendation
Request: Architecture decision on [topic]
Include: Options evaluated, tradeoffs, recommended approach
```

### Design → Engineering
```
Trigger: Design complete, ready for implementation
Artifact: Design spec, mockups, interaction patterns
Request: Implement [component | feature | interface]
Include: Acceptance criteria, edge cases, responsive behavior
```

### Architecture → Engineering
```
Trigger: Architecture decision made
Artifact: Architecture decision record, patterns to use
Request: Implement according to [architecture spec]
Include: Constraints, patterns, integration points
```

### Any → Business (Resource Request)
```
Trigger: Need resources, priority decision, timeline change
Artifact: Current state, what's needed, options
Request: Decision on [resource allocation | priority | timeline]
Include: Impact analysis, tradeoffs
```

---

## HANDOFF STATES

```
CREATED    → Handoff document created, awaiting acknowledgment
RECEIVED   → Target acknowledged, work not started
IN_PROGRESS → Target working on request
BLOCKED    → Target blocked, needs clarification
COMPLETED  → Request fulfilled, deliverable ready
CANCELLED  → Handoff no longer needed
```

---

## TRACKING

### AgentDB Queries
```bash
# Find pending handoffs to you
npx agentdb query "handoff to [your-role]" --k=10

# Find handoffs you sent
npx agentdb query "handoff from [your-role]" --k=10

# Find blocked handoffs
npx agentdb query "handoff blocked" --k=10
```

### Status Update
```
Update handoff status in AgentDB when state changes:
npx agentdb reflexion store "Handoff [ID]: [new-status]" "[session]" 0.9 true "handoff-update"
```

---

## TIMEOUT HANDLING

```
No acknowledgment in 1 session:
→ Re-notify target director
→ Log timeout in decision_log

No response in 2 sessions:
→ Escalate to Business Director
→ Business Director arbitrates

Blocker persists > 3 sessions:
→ Escalate to human operator
```

---

## ANTI-PATTERNS

```
❌ Handoff without artifact (just "please do X")
❌ Vague requests ("make it better")
❌ Handoff for work you should do yourself
❌ Handoff ping-pong (back and forth without progress)
❌ Ignoring received handoffs
❌ Blocking without escalating
❌ Handoff to wrong director (check routing map)
```

---

**Version**: 1.0
**Last Updated**: [Date]
**Authority**: SOP
**Subject To**: Constitution, Core Policies
