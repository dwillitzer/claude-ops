# Claude-Flow Queenbee & Hive-Mind Architecture

## Overview

Claude-ops uses a **director-based multi-agent system** orchestrated by claude-flow's queenbee/hive-mind capabilities for scalable AI agent coordination.

## Architecture Layers

### 1. **Directors (Main Context - Loaded)**
Located in: `/claude-ops/agents/`

**8 Specialized Directors:**
- Architecture Director - System design, patterns
- Business Director - Strategy, priorities
- Design Director - UX/DX, interfaces
- Engineering Director - Implementation, CI/CD
- Research Director - Best practices exploration  
- Documentation Director - Formal docs
- Operations Director - Production, monitoring
- Security Director - Security architecture, compliance

**How They Work:**
- Loaded directly into main Claude context (primary agents)
- Coordinate via queenbee pattern
- Delegate to specialized teams via AgentDB queries

### 2. **Teams (Queried via AgentDB - On-Demand)**
Located in: `/claude-ops/teams/`

**Domain-Specific Teams:**
- Team members are NOT loaded into primary context
- Discovered dynamically via AgentDB queries
- Only pulled in when specialized expertise needed
- Examples: Frontend team, Backend team, DevOps team, etc.

**Key Insight:**
> Directors use documentation for **institutional knowledge** (SOPs, principles)
> Directors use **AgentDB** to communicate with teams (runtime queries)

### 3. **Memory Bank (Shared Knowledge)**
Located in: `/claude-ops/memory-bank/`

**Structure:**
```
memory-bank/
├── active/          # Current context and open issues
├── constitutional/  # Core principles and constitution  
├── core/           # Execution policies and frameworks
├── decision_log/   # Decision tracking templates
├── index/          # Memory indexing
└── sops/           # Standard operating procedures
```

**Purpose:**
- **Constitutional**: Core principles (for humans AND agents)
- **SOPs**: Operational procedures (spawning, handoffs, etc.)
- **Core**: Execution frameworks
- **Active**: Current state tracking

## Claude-Flow Integration

### Hive-Mind System

```bash
# Initialize hive mind in a folder
claude-flow hive-mind init

# Spawn swarm with objective
claude-flow hive-mind spawn "Build microservices"

# With Claude Code spawning
claude-flow hive-mind spawn "Build API" --claude

# Auto-spawn coordinated instances
claude-flow hive-mind spawn "Research AI" --auto-spawn
```

**Queenbee Types:**
- `strategic` - High-level coordination
- `tactical` - Execution-focused
- `adaptive` - Dynamic adjustment

**Configuration** (`.hive-mind/config.json`):
```json
{
  "defaults": {
    "queenType": "strategic",
    "maxWorkers": 8,
    "consensusAlgorithm": "majority",
    "autoScale": true
  }
}
```

### ReasoningBank Memory

**Features:**
- SQLite-based learning memory
- 46% faster execution vs documentation lookup
- Agents communicate via AgentDB (not documentation)

```bash
# Initialize ReasoningBank
claude-flow agent memory init

# Check status
claude-flow agent memory status

# List memories
claude-flow agent memory list
```

**Key Principle:**
> Documentation = Institutional knowledge (for humans)
> AgentDB = Runtime communication (for agents)

## Initialization Pattern

### For New Folders/Projects:

**Step 1: Initialize claude-flow**
```bash
cd /path/to/new-project
npx claude-flow init --monitoring
```

**Step 2: Initialize Hive-Mind**
```bash
npx claude-flow hive-mind init
```

**Step 3: Initialize ReasoningBank**
```bash
npx claude-flow agent memory init
```

**Step 4: Spawn Directors (Non-Interactive)**
```bash
# Using CLI in non-interactive mode
npx claude-flow hive-mind spawn "Initialize project structure" \
  --queen-type strategic \
  --max-workers 8 \
  --auto-spawn
```

### For Agentic Teams Using MCP:

**MCP Integration:**
```bash
# Add claude-flow MCP server
claude mcp add claude-flow npx claude-flow@alpha mcp start

# Available MCP tools:
# - mcp__claude-flow__agents_spawn_parallel (10-20x faster spawning)
# - mcp__claude-flow__query_control (pause/resume/terminate)
# - mcp__claude-flow__query_list (view active queries)
```

**Parallel Agent Spawning:**
```javascript
// Via MCP tool
mcp__claude-flow__agents_spawn_parallel({
  agents: [
    { type: "architecture", name: "arch-director" },
    { type: "engineering", name: "eng-director" },
    { type: "security", name: "sec-director" }
  ]
})
// Result: 3 agents in 150ms instead of 2250ms
```

## Communication Patterns

### Director ↔ Director
- Via queenbee coordination
- Consensus building (majority/weighted/byzantine)
- Shared memory-bank access

### Director ↔ Team
- Via AgentDB queries (NOT documentation)
- On-demand expertise pulling
- Dynamic team member discovery

### Agent ↔ Memory
- **ReasoningBank** for learned patterns
- **Memory-bank** for institutional knowledge
- **AgentDB** for runtime state

## Workflow Example

**Scenario: "Build REST API"**

1. **Queenbee** receives objective
2. **Strategic Director** (Architecture) spawns
3. Director queries **AgentDB** for:
   - Backend engineering team
   - API design specialist
   - Security reviewer
4. Team members collaborate via **AgentDB**
5. Decisions logged to **memory-bank/decision_log**
6. Learning stored in **ReasoningBank**
7. SOPs updated in **memory-bank/sops**

## Key Differentiators

**What makes this unique:**
1. **Hybrid Knowledge System**
   - Documentation = Institutional (humans + agents)
   - AgentDB = Runtime (agents only)
   - ReasoningBank = Learning (agents only)

2. **Director Pattern**
   - 8 directors in main context (lean)
   - Unlimited teams via AgentDB (scalable)
   - Queenbee coordination (intelligent)

3. **MCP Native**
   - 90+ MCP tools available
   - Parallel spawning (10-20x faster)
   - Real-time query control

4. **Neural Networking**
   - Swarm intelligence
   - Pattern learning
   - Adaptive topology

## Best Practices

### ✅ DO:
- Use AgentDB for agent-to-agent communication
- Keep directors in main context (max 8)
- Use teams for specialized expertise (via queries)
- Initialize ReasoningBank for new projects
- Use documentation for institutional knowledge

### ❌ DON'T:
- Load all teams into main context (bloat)
- Use documentation for agent communication (slow)
- Skip ReasoningBank initialization (46% slower)
- Spawn agents sequentially (use parallel MCP tool)

---

**Version**: 1.0  
**Date**: 2025-12-09  
**Source**: claude-flow v2.7.47 + claude-ops v2.0
