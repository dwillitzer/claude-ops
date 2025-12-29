# Workspace Governance & Hygiene

Workspace hygiene and artifact governance patterns.

> **Document ID**: HYGIENE | **Version**: 1.0.5 | **Dependencies**: [MAIN]

---

## 🔗 Related Documents

### From This Ecosystem:
- **[Main Operations Guide](../core/CLAUDE-DIRECTOR.md)** - Authorization matrix and patterns
- **[Async Patterns](director-async.md)** - Async coordination rules
- **[Setup Guide](../core/director-init.md)** - Environment configuration
- **[Master Index](../INDEX.md)** - Complete navigation system

### Cross-References:
- See `[MAIN:authorization-matrix]` for complete authorization tiers
- See `[ASYNC:recursive-spawning]` for director promotion patterns
- See `[CONFIG:agent-settings]` for configuration examples

---

## 🧹 ARTIFACT AUTHORIZATION TIERS

| Tier | Agent Type | Create Files | AgentDB |
|------|------------|--------------|---------|
| **1** | Directors | ✅ Yes | ✅ Yes |
| **2** | Document Agents | ✅ Authorized only | ✅ Yes |
| **3** | Workers | ❌ No | ✅ Required |

---

## 📝 PROMPT PATTERNS

### Worker (No Files)
```
WORKSPACE HYGIENE:
- Do NOT create files
- Store ALL findings in AgentDB:
  npx agentdb reflexion store "[session]" "[task]" [score] [success] "[data]"
- Return summary only (max 10 points)
```

### Director (Authorized)
```
AUTHORIZATION: Create institutional documents.
- [name]-synthesis.md
- [name]-recommendations.md
Store details in AgentDB. Workers store there too.
```

### Document Agent (Scoped)
```
AUTHORIZATION SCOPE:
- Create: [specific-doc].md
- NOT authorized: Other file types
Store research in AgentDB.
```

---

## 💾 AGENTDB FLOW

```bash
# Workers store findings
npx agentdb reflexion store "worker-001" "task" 0.9 true "findings..."

# Directors query consolidated
npx agentdb query --query "topic" --k 20 --synthesize-context

# Directors create authorized docs from synthesis
# → institutional-report.md
```

---

## 🔄 CLEANUP

```bash
# Weekly consolidation
npx agentdb skill consolidate 3 0.7 7 true

# Sync institutional knowledge
npx agentdb sync push --server [host:port] --incremental
```

---

## ❌ ANTI-PATTERNS

```
Worker creates report.md        → ❌ Store in AgentDB
Worker creates findings.json    → ❌ Store in AgentDB  
Worker creates analysis.txt     → ❌ Store in AgentDB
Director creates synthesis.md   → ✅ Authorized
```
