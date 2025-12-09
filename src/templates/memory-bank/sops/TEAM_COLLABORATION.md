# SOP: TEAM COLLABORATION
**Status**: ACTIVE | **Authority**: SOP | **Location**: .claude/memory-bank/sops/

Standard procedure for directors collaborating with specialized teams.

---

## WHEN TO COLLABORATE

```
COLLABORATE when:
• Specialized expertise is needed beyond director's domain
• Parallel work would accelerate progress
• Deep focus on a specific technical challenge is required
• Multiple perspectives would improve outcomes

DO NOT COLLABORATE when:
• Task is within director's core competency (do it yourself)
• Collaboration would add unnecessary complexity
• Timeline doesn't support team coordination
• Clear direction exists and execution is straightforward
```

---

## PRE-COLLABORATION CHECKLIST

```
[ ] Objective is specific and measurable
[ ] Expertise gap is clearly identified
[ ] Team availability confirmed via AgentDB
[ ] Collaboration scope is well-defined
[ ] Success criteria are objective
[ ] Context and resources are prepared
[ ] Timeline is realistic for team coordination
```

---

## COLLABORATION PROCESS

### Step 1: Identify Expertise Need
```
Search AgentDB for specialized team members:
npx agentdb query "[skill] specialist" --k=5
npx agentdb query "[domain] expert" --k=10
```

### Step 2: Initiate Collaboration
```markdown
**Collaboration Request: [Director] → [Team]**
**Date**: [YYYY-MM-DD]
**Domain**: [architecture/business/design/engineering/research/documentation]

## Purpose
[Clear statement of what we're trying to achieve together]

## Expertise Needed
[Specific skills or knowledge required]

## Context
[Relevant background, current work, constraints]

## Collaboration Scope
MULTIPLY:
- [Specific contribution 1]
- [Shared deliverable 2]
- [Joint analysis 3]

## Success Criteria
[Measurable outcomes that indicate successful collaboration]

## Timeline
[Realistic timeframe for collaboration]

## Coordination
[How we'll work together - handoffs, sync points, decision process]
```

### Step 3: Establish Working Agreement
```
Confirm with team:
• Shared understanding of objectives
• Communication frequency and method
• Decision-making process
• How progress will be shared
• Completion handoff process
```

### Step 4: Execute Collaboration
```
Director responsibilities:
• Provide necessary context and resources
• Be available for questions and guidance
• Remove blockers that team encounters
• Integrate team contributions into broader work

Team responsibilities:
• Apply specialized expertise to defined scope
• Communicate progress and findings clearly
• Escalate blockers promptly
• Deliver on agreed success criteria
```

### Step 5: Conclude Collaboration
```markdown
**Collaboration Completion: [Team] → [Director]**
**Date**: [YYYY-MM-DD]
**Original Purpose**: [Brief recap]

## Contributions Delivered
[Specific outcomes, artifacts, insights]

## Key Findings
[Important discoveries or recommendations]

## Integration Notes
[How director should incorporate the work]

## Follow-up Needed
[Any ongoing coordination or future collaboration]
```

---

## COLLABORATION PATTERNS

### Architecture + Teams
```
Pattern: Technical deep-dive
Team focus: Pattern evaluation, performance analysis, security review
Director role: Architecture decisions, system integration
```

### Engineering + Teams
```
Pattern: Implementation acceleration
Team focus: Feature development, testing, optimization
Director role: Code quality, system integration, deployment
```

### Research + Teams
```
Pattern: Specialized investigation
Team focus: Technology evaluation, benchmarking, competitive analysis
Director role: Synthesis, recommendations, handoff to relevant director
```

### Design + Teams
```
Pattern: User experience development
Team focus: UX research, interface design, accessibility review
Director role: Design decisions, system consistency, user journey
```

---

## COORDINATION GUIDELINES

### Communication
```
• Clear objectives and scope boundaries
• Regular progress updates (frequency agreed upfront)
• Prompt escalation of blockers or questions
• Mutual respect for expertise domains
• Shared commitment to success criteria
```

### Decision Making
```
• Team provides recommendations and analysis
• Director makes domain decisions with team input
• Significant disagreements documented in decision log
• Business Director facilitates cross-domain conflicts
```

### Quality Assurance
```
• Team work meets director's domain standards
• Director reviews and validates contributions
• Both parties share responsibility for outcomes
• Learnings captured in AgentDB for future reference
```

---

## SUSTAINABLE COLLABORATION

### Limits
```
Per director: MAX 8 concurrent team collaborations
Per project: MAX 5 teams working together
Duration: Typically 1-3 sessions per collaboration
```

### Signs to Scale Back
```
• Coordination overhead exceeds collaboration value
• Communication breakdowns become frequent
• Outcomes don't justify team coordination time
• Director context becomes too fragmented
```

### Success Indicators
```
• Collaboration delivers measurable value beyond individual effort
• Team expertise accelerates progress significantly
• Learning and capabilities are shared across the system
• Strong working relationships develop
```

---

## POSITIVE COLLABORATION EXAMPLES

### ✅ Effective Pattern
```
Director: "I need to evaluate 5 database technologies for scalability"
Team: "Database performance specialist provides benchmarks and analysis"
Result: "Informed architecture decision with comprehensive data"
```

### ✅ Good Handoff
```
Team: "Security review completed - found 3 high-priority issues"
Director: "Security architect addresses findings, updates architecture"
Result: "System security improved with clear next steps"
```

---

## ANTI-PATTERNS TO AVOID

```
❌ Unclear objectives or scope
❌ Team members given strategic decisions
❌ Directors abdicate responsibility to teams
❌ Collaboration without clear success criteria
❌ Ignoring team recommendations without explanation
❌ Letting collaborations continue indefinitely
❌ Poor communication or infrequent updates
```

---

## KNOWLEDGE SHARING

After each collaboration:
```
1. Team stores learnings in AgentDB
2. Director updates domain patterns
3. Both contribute to shared knowledge systems
4. Document collaboration insights for future reference
5. Share successful patterns with other directors
```

---

**Version**: 1.0
**Last Updated**: [Date]
**Authority**: SOP
**Subject To**: Constitution, Core Policies