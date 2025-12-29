# director-ops

Operational reference for Director Pattern multi-agent orchestration.

---

## 🚀 DEPLOYMENT COMMANDS

### Hive Mind (Recommended)
```bash
# Quick spawn with Claude Code
npx claude-flow@alpha hive-mind spawn "[objective]" --claude --auto-spawn

# Full control
npx claude-flow@alpha hive-mind spawn "[objective]" \
  --queen-type strategic \
  --max-workers 8 \
  --consensus weighted \
  --execute \
  --monitor
```

### Swarm
```bash
# Development workflow
npx claude-flow@alpha swarm "[objective]" --strategy development --claude

# Analysis (read-only)
npx claude-flow@alpha swarm "[objective]" --analysis --parallel
```

### Direct Task (CLI v2.1+ - No MCP)
```
Task("name", "prompt...", "agent-type")
```

---

## 👑 QUEEN TYPES

| Type | When to Use |
|------|-------------|
| `strategic` | Multi-phase, complex projects |
| `tactical` | Sprint work, rapid iteration |
| `adaptive` | Uncertain requirements |

---

## 🤖 AGENT QUICK REF

| Need | Agent | Model |
|------|-------|-------|
| Research | `researcher` | haiku |
| Code | `coder` | sonnet |
| Review | `reviewer` | sonnet |
| Test | `tester` | sonnet |
| Design | `architect` | opus |
| Explore | `Explore` | haiku |
| Plan | `planner` | opus |
| Debug | `debugger` | sonnet |

---

## 💾 AGENTDB

```bash
# Query before work
npx agentdb query --query "[topic]" --k 10 --synthesize-context

# Store after work
npx agentdb reflexion store "[session]" "[task]" [0-1] [true/false] "[notes]"

# Weekly consolidation
npx agentdb skill consolidate 3 0.7 7 true
```

---

## 🧠 NEURAL TRAINING

```bash
# Train from recent
npx claude-flow@alpha training neural-train --data recent --model task-predictor

# Learn pattern
npx claude-flow@alpha training pattern-learn --operation "[op]" --outcome "success"

# Update model
npx claude-flow@alpha training model-update --agent-type coordinator --operation-result "efficient"
```

---

## ⚡ KEY FLAGS

| Flag | Effect |
|------|--------|
| `--claude` | Opens Claude Code CLI |
| `--auto-spawn` | Auto-spawn instances |
| `--execute` | Run immediately |
| `--parallel` | 2.8-4.4x speedup |
| `--analysis` | Read-only mode |
| `--monitor` | Live dashboard |
| `--verbose` | Detailed logs |

---

## 📊 STATUS COMMANDS

```bash
npx claude-flow@alpha hive-mind status
npx claude-flow@alpha hive-mind metrics
npx claude-flow@alpha hive-mind sessions
npx claude-flow@alpha status
```

---

## 🛠️ TROUBLESHOOTING

```bash
# Reset hive mind
npx claude-flow@alpha hive-mind init --force

# Export state
npx claude-flow@alpha hive-mind memory --export

# Stop swarm
npx claude-flow@alpha hive-mind stop
```
