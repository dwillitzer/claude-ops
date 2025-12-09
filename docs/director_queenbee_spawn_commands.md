# Director Queenbee Spawn Commands

## Exact Commands to Spawn Claude-Ops Directors as Queenbees

Based on claude-ops director structure + claude-flow hive-mind system.

---

## Environment Setup

These commands use **relative paths** and work in multiple deployment scenarios:

### Option 1: Project-Specific (Recommended)
```bash
cd /path/to/your-project  # Project root where .claude/ exists
npx claude-flow@alpha hive-mind spawn "..." --config .claude/agents/architecture-director.md
```

### Option 2: Global ~/.claude
```bash
cd ~/.claude
npx claude-flow@alpha hive-mind spawn "..." --config agents/architecture-director.md
```

### Option 3: Using Environment Variable
```bash
export CLAUDE_DIR="/path/to/.claude"
npx claude-flow@alpha hive-mind spawn "..." --config $CLAUDE_DIR/agents/architecture-director.md
```

**Key Point**: All commands below use `.claude/agents/` relative paths. Run them from your project root or adjust paths accordingly.

---

## Individual Director Spawn Commands

### 1. Architecture Director (Strategic Queenbee)
```bash
npx claude-flow@alpha hive-mind spawn \
  "System architecture and technical design leadership" \
  --queen-type strategic \
  --max-workers 8 \
  --consensus majority \
  --auto-scale \
  --config .claude/agents/architecture-director.md
```

**Why Strategic**: Makes high-level architecture decisions, system design patterns, technology selection.

---

### 2. Business Director (Strategic Queenbee - Authority)
```bash
npx claude-flow@alpha hive-mind spawn \
  "Business strategy, priorities, and resource allocation" \
  --queen-type strategic \
  --max-workers 8 \
  --consensus weighted \
  --auto-scale \
  --config .claude/agents/business-director.md
```

**Why Strategic + Weighted Consensus**: Arbitrates conflicts, highest authority for business decisions.

---

### 3. Design Director (Tactical Queenbee)
```bash
npx claude-flow@alpha hive-mind spawn \
  "UX/DX design, interfaces, and API contracts" \
  --queen-type tactical \
  --max-workers 6 \
  --consensus majority \
  --config .claude/agents/design-director.md
```

**Why Tactical**: Execution-focused for interface design, hands-on UX/DX work.

---

### 4. Engineering Director (Tactical Queenbee)
```bash
npx claude-flow@alpha hive-mind spawn \
  "Code implementation, CI/CD, and engineering excellence" \
  --queen-type tactical \
  --max-workers 10 \
  --consensus majority \
  --auto-scale \
  --config .claude/agents/engineering-director.md
```

**Why Tactical + More Workers**: Hands-on implementation, often needs more parallel workers for coding tasks.

---

### 5. Research Director (Adaptive Queenbee)
```bash
npx claude-flow@alpha hive-mind spawn \
  "Research, exploration, and best practices discovery" \
  --queen-type adaptive \
  --max-workers 6 \
  --consensus majority \
  --config .claude/agents/research-director.md
```

**Why Adaptive**: Explores different approaches, adapts based on findings, non-deterministic paths.

---

### 6. Documentation Director (Tactical Queenbee)
```bash
npx claude-flow@alpha hive-mind spawn \
  "Formal documentation creation and maintenance" \
  --queen-type tactical \
  --max-workers 4 \
  --consensus majority \
  --config .claude/agents/documentation-director.md
```

**Why Tactical + Fewer Workers**: Focused execution for docs, less parallelization needed.

---

### 7. Operations Director (Strategic Queenbee)
```bash
npx claude-flow@alpha hive-mind spawn \
  "Production operations, monitoring, and reliability" \
  --queen-type strategic \
  --max-workers 8 \
  --consensus byzantine \
  --auto-scale \
  --encryption \
  --config .claude/agents/operations-director.md
```

**Why Strategic + Byzantine Consensus + Encryption**: Manages production systems, needs fault tolerance and security.

---

### 8. Security Director (Strategic Queenbee)
```bash
npx claude-flow@alpha hive-mind spawn \
  "Security architecture, risk management, and compliance" \
  --queen-type strategic \
  --max-workers 6 \
  --consensus byzantine \
  --encryption \
  --config .claude/agents/security-director.md
```

**Why Strategic + Byzantine + Encryption**: Final security authority, zero trust model, fault-tolerant decisions.

---

## Full Team Initialization (Sequential)

```bash
#!/bin/bash
# spawn-all-directors.sh
# Run this from project root or ~/.claude directory

# Detect .claude directory location
if [ -d ".claude/agents" ]; then
    AGENT_DIR=".claude/agents"
elif [ -d "agents" ]; then
    AGENT_DIR="agents"
else
    echo "Error: Cannot find agents directory"
    echo "Run this from project root (where .claude exists) or from .claude directory"
    exit 1
fi

echo "Spawning all 8 directors as queenbees..."
echo "Using agents from: $AGENT_DIR"

# Strategic Directors
npx claude-flow@alpha hive-mind spawn "Architecture leadership" --queen-type strategic --max-workers 8 --consensus majority --config $AGENT_DIR/architecture-director.md &
npx claude-flow@alpha hive-mind spawn "Business strategy" --queen-type strategic --max-workers 8 --consensus weighted --config $AGENT_DIR/business-director.md &
npx claude-flow@alpha hive-mind spawn "Operations leadership" --queen-type strategic --max-workers 8 --consensus byzantine --encryption --config $AGENT_DIR/operations-director.md &
npx claude-flow@alpha hive-mind spawn "Security oversight" --queen-type strategic --max-workers 6 --consensus byzantine --encryption --config $AGENT_DIR/security-director.md &

# Tactical Directors
npx claude-flow@alpha hive-mind spawn "Design execution" --queen-type tactical --max-workers 6 --config $AGENT_DIR/design-director.md &
npx claude-flow@alpha hive-mind spawn "Engineering implementation" --queen-type tactical --max-workers 10 --auto-scale --config $AGENT_DIR/engineering-director.md &
npx claude-flow@alpha hive-mind spawn "Documentation creation" --queen-type tactical --max-workers 4 --config $AGENT_DIR/documentation-director.md &

# Adaptive Director
npx claude-flow@alpha hive-mind spawn "Research exploration" --queen-type adaptive --max-workers 6 --config $AGENT_DIR/research-director.md &

wait
echo "All directors spawned successfully!"
```

---

## MCP-Based Parallel Spawning (10-20x Faster)

```bash
# Using claude-flow MCP tool for parallel spawning
# Must have: claude mcp add claude-flow npx claude-flow@alpha mcp start

# Via MCP tool (call from Claude Code or MCP client)
mcp__claude-flow__agents_spawn_parallel({
  "agents": [
    {
      "type": "custom",
      "name": "architecture-director",
      "config": ".claude/agents/architecture-director.md",
      "queen_type": "strategic",
      "max_workers": 8,
      "consensus": "majority"
    },
    {
      "type": "custom",
      "name": "business-director",
      "config": ".claude/agents/business-director.md",
      "queen_type": "strategic",
      "max_workers": 8,
      "consensus": "weighted"
    },
    {
      "type": "custom",
      "name": "design-director",
      "config": ".claude/agents/design-director.md",
      "queen_type": "tactical",
      "max_workers": 6
    },
    {
      "type": "custom",
      "name": "engineering-director",
      "config": ".claude/agents/engineering-director.md",
      "queen_type": "tactical",
      "max_workers": 10,
      "auto_scale": true
    },
    {
      "type": "custom",
      "name": "research-director",
      "config": ".claude/agents/research-director.md",
      "queen_type": "adaptive",
      "max_workers": 6
    },
    {
      "type": "custom",
      "name": "documentation-director",
      "config": ".claude/agents/documentation-director.md",
      "queen_type": "tactical",
      "max_workers": 4
    },
    {
      "type": "custom",
      "name": "operations-director",
      "config": ".claude/agents/operations-director.md",
      "queen_type": "strategic",
      "max_workers": 8,
      "consensus": "byzantine",
      "encryption": true
    },
    {
      "type": "custom",
      "name": "security-director",
      "config": ".claude/agents/security-director.md",
      "queen_type": "strategic",
      "max_workers": 6,
      "consensus": "byzantine",
      "encryption": true
    }
  ]
})

# Result: All 8 directors spawned in ~150-200ms instead of 2-3 seconds
```

---

## With Claude Code Coordination

```bash
# Spawn with automatic Claude Code CLI opening for each director
npx claude-flow@alpha hive-mind spawn \
  "Full director team initialization" \
  --claude \
  --auto-spawn \
  --config .claude/agents/architecture-director.md,.claude/agents/business-director.md,.claude/agents/design-director.md,.claude/agents/engineering-director.md,.claude/agents/research-director.md,.claude/agents/documentation-director.md,.claude/agents/operations-director.md,.claude/agents/security-director.md
```

---

## With Swarm Strategies

Each director can use different swarm strategies based on their work type:

```bash
# Architecture: research + development
claude-flow swarm "Design microservices architecture" \
  --strategy research \
  --mode hierarchical \
  --config agents/architecture-director.md

# Engineering: development + optimization
claude-flow swarm "Implement authentication system" \
  --strategy development \
  --mode distributed \
  --max-agents 10 \
  --parallel \
  --config agents/engineering-director.md

# Research: research + analysis
claude-flow swarm "Evaluate AI frameworks" \
  --strategy research \
  --mode mesh \
  --read-only \
  --config agents/research-director.md

# Security: analysis + testing
claude-flow swarm "Security audit codebase" \
  --strategy testing \
  --mode centralized \
  --analysis \
  --config agents/security-director.md

# Operations: maintenance + monitoring
claude-flow swarm "Monitor production metrics" \
  --strategy maintenance \
  --mode hybrid \
  --background \
  --config agents/operations-director.md
```

---

## Queenbee Types Mapped to Directors

| Director | Queenbee Type | Why |
|----------|--------------|-----|
| Architecture | **Strategic** | High-level system design decisions |
| Business | **Strategic** | Highest authority, arbitration, resource allocation |
| Operations | **Strategic** | Production oversight, critical decisions |
| Security | **Strategic** | Zero-trust final authority |
| Design | **Tactical** | Execution-focused UX/DX work |
| Engineering | **Tactical** | Hands-on code implementation |
| Documentation | **Tactical** | Focused doc creation |
| Research | **Adaptive** | Explores different approaches, non-deterministic |

---

## Consensus Algorithms by Director

| Director | Consensus | Why |
|----------|-----------|-----|
| Business | **Weighted** | Authority-based decisions |
| Operations | **Byzantine** | Fault tolerance for production |
| Security | **Byzantine** | Zero-trust security model |
| Others | **Majority** | Standard democratic consensus |

---

## Key Command Options Reference

```bash
--queen-type <type>       # strategic | tactical | adaptive
--max-workers <n>         # Default: 8
--consensus <type>        # majority | weighted | byzantine
--auto-scale             # Enable auto-scaling
--encryption             # Enable encrypted communication
--monitor                # Real-time dashboard
--claude                 # Open Claude Code CLI
--auto-spawn             # Automatically spawn instances
--execute                # Execute immediately (non-interactive)
--parallel               # 2.8-4.4x speed improvement
--config <path>          # Director config file path
```

---

**Usage**: Copy these commands and customize per your needs. The MCP parallel spawn is HIGHLY recommended for production (10-20x faster).

**Version**: 1.0  
**Date**: 2025-12-09  
**Source**: claude-ops v2.0 + claude-flow v2.7.47
