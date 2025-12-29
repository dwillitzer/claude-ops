# Claude Director Playbook - Index

> **Use this gist as your operational playbook for multi-agent orchestration.**

---

## 🎯 Quick Start (For Agents)

**Read ONE file based on your need:**

| Need | File | When |
|------|------|------|
| **Full Setup** | `CLAUDE-DIRECTOR.md` | Starting a project, need everything |
| **Quick Reference** | `director-ops.md` | Know the basics, need command reference |
| **Async Patterns** | `director-async.md` | Working with non-blocking agents |
| **Workspace Rules** | `director-hygiene.md` | Artifact governance |
| **Initial Setup** | `director-init.md` | First-time environment setup |

---

## 📋 For Humans

### Option 1: Full Playbook (Recommended)
```
Download CLAUDE-DIRECTOR.md → Save as CLAUDE.md in project root
```

### Option 2: Slash Commands
```
Copy director-*.md files → .claude/commands/
Now available as: /director-init, /director-ops, /director-async, /director-hygiene
```

### Option 3: Context Injection (Web)
```
"Fetch [raw-url]/CLAUDE-DIRECTOR.md and use as your operational playbook"
```

---

## 🔧 Dependencies

```bash
# Initialize (run once per project)
npx claude-flow@alpha init --sparc
npx agentdb init ./agent-memory.db --dimension 1536 --preset medium
npx claude-flow@alpha hive-mind init
```

---

## 📦 File Descriptions

| File | Lines | Purpose |
|------|-------|---------|
| `CLAUDE-DIRECTOR.md` | 744 | Complete operational playbook |
| `director-ops.md` | 130 | Quick command reference |
| `director-async.md` | 107 | Async/non-blocking patterns |
| `director-hygiene.md` | 80 | Artifact governance rules |
| `director-init.md` | 68 | Setup instructions |
| `example-config.json` | 85 | Template generator config |

---

## 🎯 Core Principles

1. **Director Pattern**: You strategize, agents implement
2. **Parallel Always**: One message = all agent deployments
3. **Async Monitoring**: `TaskOutput(id, block=false)`
4. **Workspace Hygiene**: Workers → AgentDB, Directors → Documents
5. **Recursive Spawning**: Directors can spawn their own teams

---

*Playbook v2.2 | Claude Flow 2.7.47+ | CLI v2.0.69+*
