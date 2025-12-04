# AGENTS DIRECTORY
**Location**: .claude/agents/
**Authority**: Human creates directors, directors reference but do not modify

---

## DIRECTORS

| Director | Domain | Special Authority |
|----------|--------|-------------------|
| [architecture-director.md](architecture-director.md) | System design, patterns, tech decisions | Makes architecture decisions |
| [business-director.md](business-director.md) | Strategy, priorities, resources | Arbitrates conflicts, allocates resources |
| [design-director.md](design-director.md) | UX, DX, interfaces, API contracts | Defines interfaces |
| [engineering-director.md](engineering-director.md) | Implementation, code, CI/CD | Writes code |
| [research-director.md](research-director.md) | Research, exploration, best practices | Creates research docs (exception) |
| [documentation-director.md](documentation-director.md) | All formal documentation | Only agent that creates docs |

---

## RULES

1. **Directors are peers** — No director outranks another (except Business for arbitration)
2. **Domain boundaries are strict** — Directors operate in their domain only
3. **Handoffs required** — Cross-domain work requires explicit handoff
4. **Constitution is supreme** — All directors subject to Constitution

---

## ADDING NEW DIRECTORS

Only humans may create new directors. New directors must:
1. Have clearly defined, non-overlapping domain
2. Follow director template structure
3. Integrate with handoff protocol
4. Be registered in this README

---

## CONTEXT LOADING

All directors in this directory are loaded into main agent context.
Subagents (.claude/subagents/) are NOT in context — query via AgentDB.

---

**Version**: 1.0
