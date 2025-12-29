# director-init

Initialize Director Pattern for multi-agent orchestration.

## Quick Setup

```bash
# Full initialization
npx claude-flow@alpha init --sparc && \
npx agentdb init ./agent-memory.db --dimension 1536 --preset medium && \
npx claude-flow@alpha hive-mind init
```

## Director Rules

**YOU ARE THE CAPTAIN - NEVER THE IMPLEMENTER**

1. **Parallel Only**: One message = all agent deployments
2. **Synthesize Up**: Agents distill, director strategizes  
3. **Persist Always**: Store lessons in AgentDB every session
4. **Query First**: Check AgentDB before starting work

## Agent Deployment (CLI - No MCP Required)

```
# Deploy ALL in ONE message
Task("agent-1", "task...", "researcher")
Task("agent-2", "task...", "coder")
Task("agent-3", "task...", "tester")
```

## Hive Mind (Queen-Led Parallel)

```bash
# Spawn with auto Claude Code instances
npx claude-flow@alpha hive-mind spawn "[objective]" --claude --auto-spawn

# Execute immediately
npx claude-flow@alpha hive-mind spawn "[objective]" --execute --verbose
```

## Key Flags

| Flag | Purpose |
|------|---------|
| `--claude` | Open Claude Code CLI |
| `--auto-spawn` | Auto-spawn instances |
| `--execute` | Execute immediately |
| `--analysis` | Read-only mode |

## Session Protocol

**Start:**
```bash
npx agentdb query --query "project context" --k 5 --synthesize-context
```

**End:**
```bash
npx agentdb reflexion store "session-$(date +%s)" "[task]" 0.85 true "[lessons]"
```

## Neural Training

```bash
npx claude-flow@alpha training neural-train --data recent --model task-predictor
npx claude-flow@alpha training pattern-learn --operation "[op]" --outcome "success"
```
