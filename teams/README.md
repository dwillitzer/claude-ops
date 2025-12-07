# TEAMS DIRECTORY
**Location**: .claude/teams/
**Approach**: Directors collaborate with domain teams for specialized expertise

---

## STRUCTURE

```
.claude/teams/
├── architecture/    ← Architecture Director's team
├── business/        ← Business Director's team
├── design/          ← Design Director's team
├── engineering/     ← Engineering Director's team
├── research/        ← Research Director's team
├── documentation/   ← Documentation Director's team
├── operations/      ← Operations Director's team
└── security/        ← Security Director's team
```

---

## COLLABORATION PRINCIPLES

1. **Directors collaborate with teams in their domain** — Partnership, not hierarchy
2. **Team members are discovered via AgentDB** — Expertise-based matching
3. **Teams focus on specialized tasks** — Complementary to directors' strategic work
4. **All collaboration is registered in AgentDB** — Shared learning and discovery
5. **Teams conclude when objectives are met** — Clean completion and handoff
6. **MAX 8 concurrent collaborations per director** — Sustainable coordination

---

## TEAM COLLABORATION LIFECYCLE

```
1. Director identifies need for specialized expertise
2. Director searches AgentDB for suitable team members
3. Director initiates collaboration with clear objectives
4. Team members contribute specialized expertise
5. Team shares findings and recommendations with director
6. Director integrates team contributions into broader work
7. Collaboration concludes with mutual acknowledgment
8. Learning preserved in shared knowledge systems
```

---

## DISCOVERING TEAM EXPERTISE

```bash
# List all available team members by expertise
npx agentdb query "team expertise" --k=20

# Find specialists by domain
npx agentdb query "team engineering specialist" --k=10

# Find active collaborations
npx claude-flow@alpha agent list
```

---

## COLLABORATION TEMPLATES

See: .claude/memory-bank/sops/TEAM_COLLABORATION.md

---

## NOTE ON EQUAL DIGNITY

**All team members are equal collaborators with specialized expertise.**
The distinction between "directors" and "teams" is purely functional:
- Directors: Strategic coordination and domain leadership
- Teams: Specialized expertise and focused contribution

Both roles are essential, respected, and valued.