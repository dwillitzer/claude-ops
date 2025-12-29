# [PROJECT_NAME] - Claude Code Director Operations

> **Branch:** `[branch]` | **Audit:** [DATE] | **Ready:** [X]%
> **Path:** [Strategic description]
> **Document ID**: MAIN | **Version**: 3.4.2 | **Dependencies**: [ASYNC, HYGIENE, INIT]

---

## 📊 DOCUMENTATION ECOSYSTEM GRAPH

```mermaid
graph TD
    INDEX[📋 INDEX.md<br/>Navigation Hub] --> MAIN[🎯 THIS DOC<br/>CLAUDE-DIRECTOR.md]
    INDEX --> ASYNC[⚡ director-async.md<br/>Async Patterns]
    INDEX --> HYGIENE[🧹 director-hygiene.md<br/>Governance]
    INDEX --> INIT[🚀 director-init.md<br/>Setup]
    INDEX --> OPS[⚙️ director-ops.md<br/>Operations]
    INDEX --> CONFIG[⚙️ example-config.json<br/>Template]

    MAIN --> ASYNC
    MAIN --> HYGIENE
    MAIN --> INIT
    ASYNC --> MAIN
    HYGIENE --> MAIN
    INIT --> MAIN

    style MAIN fill:#ff6b6b
    style INDEX fill:#4ecdc4
    style ASYNC fill:#45b7d1
    style HYGIENE fill:#96ceb4
    style INIT fill:#feca57
    style OPS fill:#ff9ff3
    style CONFIG fill:#54a0ff
```

## 🔗 SMART NAVIGATION SYSTEM

### 📚 Complete Documentation (7 Documents)

| Document | Purpose | Key Sections |
|----------|---------|--------------|
| **[THIS DOC - Main Operations](CLAUDE-DIRECTOR.md)** | Complete orchestration playbook | All core patterns |
| **[Async Patterns](../advanced/director-async.md)** | Non-blocking execution | Real-time coordination |
| **[Workspace Governance](../advanced/director-hygiene.md)** | Artifact management | Authorization matrix |
| **[Setup Guide](../core/director-init.md)** | First-time configuration | Environment setup |
| **[Operations Manual](../core/director-ops.md)** | Daily workflows | Command reference |
| **[Master Index](../INDEX.md)** | Complete navigation | Quick start matrix |
| **[Configuration](../examples/example-config.json)** | Ready-to-use template | Settings file |

### 🧭 Contextual Navigation

**Current Section**: Main Document Overview
**Related Content:**
- **Setup Prerequisites**: `[director-init.md](INIT:claude-flow-setup)`
- **Async Implementation**: `[director-async.md](ASYNC:non-blocking)`
- **Governance Rules**: `[director-hygiene.md](HYGIENE:authorization-matrix)`
- **Daily Operations**: `[director-ops.md](OPS:daily-workflows)`

**Cross-Reference Format**: `[Document](ID:section)` - Click to navigate

---## 🚀 QUICK START (Director Setup)

### First-Time Setup (Run Once)

```bash
# 1. Initialize Claude Flow (creates .claude/, .hive-mind/, agents)
npx claude-flow@alpha init --sparc

# 2. Initialize AgentDB for persistent memory
npx agentdb init ./agent-memory.db --dimension 1536 --preset medium

# 3. Initialize Hive Mind coordination
npx claude-flow@alpha hive-mind init
```

### Session Start (Every Session)

```bash
# Query existing knowledge before starting work
npx agentdb query --query "project context previous work" --k 5 --synthesize-context

# Check hive mind status
npx claude-flow@alpha hive-mind status
```

### Session End (Every Session)

```bash
# Store session learnings
npx agentdb reflexion store "session-$(date +%s)" "[task]" 0.85 true "[lessons]"

# Train patterns from session
npx claude-flow@alpha training pattern-learn --operation "[operation]" --outcome "success"
```

---

## 🎯 DIRECTOR PATTERN (MANDATORY)

```
┌─────────────────────────────────────────────────────────────┐
│  YOU ARE THE CAPTAIN - NEVER THE IMPLEMENTER                │
│                                                             │
│  ✓ Strategic planning        ✗ Writing code directly        │
│  ✓ Synthesizing reports      ✗ Sequential agent deployment  │
│  ✓ Coordinating workstreams  ✗ Holding raw data in context  │
│  ✓ Stakeholder communication ✗ Skipping AgentDB persistence │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚡ AGENT DEPLOYMENT

### GOLDEN RULE: One Message = All Operations

**CLI (v2.0.69+) - TRUE PARALLEL, NO MCP REQUIRED:**
```
# Deploy ALL agents in ONE message using Task tool directly
Task("security-audit", "Audit auth system for vulnerabilities...", "security")
Task("arch-review", "Review service architecture...", "architect")  
Task("perf-analysis", "Analyze latency bottlenecks...", "analyzer")
```

### Deployment Matrix

| Environment | Method | Parallelism | MCP Required |
|-------------|--------|-------------|--------------|
| **CLI v2.1+** | Task tool (direct) | ✅ True | ❌ No |
| **CLI Async** | Task + `block=false` | ✅ True | ❌ No |
| **Hive Mind** | `--claude --auto-spawn` | ✅ True | ❌ No |
| **Swarm** | `--claude` or `--executor` | ✅ True | ❌ No |
| **Web v2.0.x** | MCP tools | ⚠️ Simulated | ✅ Yes |
| **tmux + CLI** | Multiple instances | ✅ True | ❌ No |

---

## 🔄 ASYNC AGENT PATTERNS (CLI v2.0.69+)

### Non-Blocking Agent Spawn

```javascript
// Spawn agent without waiting for completion
Task("researcher", "Analyze Chrome MCP tools...", "researcher")
// Agent runs in background, returns immediately

// Check status anytime (NON-BLOCKING)
TaskOutput(agentId, block=false)

// Wait for completion (BLOCKING)
TaskOutput(agentId, block=true)
```

### Real-Time Agent Communication

```bash
# Read agent output anytime (even while running)
cat /tmp/claude/-[project-path]/tasks/[agentId].output

# Check what agent is currently doing
TaskOutput(a4abf71, block=false)

# See progress updates via system reminders (automatic)
```

### Mid-Flight Correction Pattern

```javascript
// Agent starts work
Task("designer", "Audit UI at https://example.com", "designer")
// Returns agentId: a4abf71

// Check progress (non-blocking)
TaskOutput(a4abf71, block=false)
// See they're on wrong URL!

// Launch CORRECTION AGENT to redirect
Task("corrector", 
     "URGENT: Tell agent a4abf71 to change from example.com to example.com/app", 
     "coordinator")

// Correction agent communicates with running agent
// Both coordinate in real-time
```

### Direct Output File Communication

```bash
# Read what agent is doing right now
cat /tmp/claude/-home-user-projects/tasks/a4abf71.output

# Send message by writing to their stream
echo "CORRECTION: Change to /app URL" >> /tmp/claude/.../tasks/a4abf71.output
```

---

## 🏢 RECURSIVE DIRECTOR SPAWNING (ADVANCED)

### Promote Agents to Directors

```javascript
// Spawn an agent and TELL THEM they are a Director
Task("Chrome Research Director",
     `You are the DIRECTOR of Chrome Research & Development.
      
      Your mission: Comprehensively analyze Chrome MCP integration.
      
      AS A DIRECTOR, you must:
      1. Spawn your own specialist team (3-4 agents)
      2. Coordinate their work
      3. Synthesize findings into executive report
      
      Spawn these specialists:
      - Chrome Tools Analyst: Map all chrome-* MCP tools
      - Native Integration Tester: Test claude --chrome vs MCP
      - Performance Benchmark Agent: Measure speed/memory/CPU
      - Documentation Specialist: Create integration guide
      
      Use Task() to spawn each specialist.
      Use TaskOutput(id, block=false) to monitor progress.
      Synthesize all findings when complete.`,
     "system-architect")
```

### Corporate Hierarchy Pattern

```
CEO (You - Human)
└── COO (Claude Director - This Context)
    ├── Chrome Research Director (spawned agent)
    │   ├── Chrome Tools Analyst
    │   ├── Native Integration Tester
    │   ├── Performance Benchmark Agent
    │   └── Documentation Specialist
    └── UI/UX Design Director (spawned agent)
        ├── Visual Design Analyst
        ├── UX Flow Specialist
        ├── Accessibility Expert
        └── Responsive Design Tester
```

### Multi-Level Director Spawn

```javascript
// Spawn two Director-level agents simultaneously
Task("researcher", 
     "You are DIRECTOR of Research Division. Spawn 3-4 specialists to analyze [topic]. Coordinate and synthesize.",
     "system-architect")

Task("designer",
     "You are DIRECTOR of Design Division. Spawn 3-4 specialists to audit [target]. Coordinate and synthesize.", 
     "system-architect")

// Directors will spawn their own teams
// Monitor with TaskOutput(id, block=false)
// Each Director manages 4-6 agents = 10-12 total agents running
```

### Director Promotion Prompt Template

```
You are the DIRECTOR of [DIVISION NAME].

Your mission: [OBJECTIVE]

AS A DIRECTOR, you must:
1. Spawn your own specialist team using Task()
2. Monitor progress with TaskOutput(id, block=false)  
3. Send corrections if agents go off-track
4. Synthesize all findings into executive report
5. Store lessons in AgentDB when complete

SPAWN THESE SPECIALISTS:
- [Specialist 1]: [Task description]
- [Specialist 2]: [Task description]
- [Specialist 3]: [Task description]
- [Specialist 4]: [Task description]

COORDINATION RULES:
- Check each agent status every few minutes
- Launch correction agents if needed
- Aggregate findings, don't duplicate work
- Report synthesized summary only (max 10 points)
```

---

## 👑 QUEEN-LED HIVE MIND

### Queen Types

| Type | Use Case | Behavior |
|------|----------|----------|
| `strategic` | Complex multi-phase projects | Long-term planning, resource optimization |
| `tactical` | Sprint-based work | Short-term goals, rapid iteration |
| `adaptive` | Uncertain requirements | Dynamic adjustment, learning-based |

### Consensus Algorithms

| Algorithm | Threshold | Use Case |
|-----------|-----------|----------|
| `majority` | >50% | Quick decisions, low risk |
| `weighted` | Variable | Expert-weighted votes |
| `unanimous` | 100% | Critical decisions, high risk |
| `byzantine` | 2/3 + 1 | Fault-tolerant, distributed |

### Hive Mind Commands

```bash
# Initialize
npx claude-flow@alpha hive-mind init

# Spawn intelligent swarm with Claude Code instances
npx claude-flow@alpha hive-mind spawn "[objective]" --claude --auto-spawn

# Execute immediately without prompts
npx claude-flow@alpha hive-mind spawn "[objective]" --execute --verbose

# Full control spawn
npx claude-flow@alpha hive-mind spawn "[objective]" \
  --queen-type strategic \
  --max-workers 8 \
  --consensus weighted \
  --auto-spawn \
  --monitor

# Interactive wizard
npx claude-flow@alpha hive-mind wizard

# Status and monitoring
npx claude-flow@alpha hive-mind status
npx claude-flow@alpha hive-mind metrics
npx claude-flow@alpha hive-mind sessions

# Memory and consensus
npx claude-flow@alpha hive-mind memory
npx claude-flow@alpha hive-mind consensus

# Session management
npx claude-flow@alpha hive-mind resume [session-id]
npx claude-flow@alpha hive-mind stop
```

### Swarm Commands

```bash
# Development workflow with Claude Code
npx claude-flow@alpha swarm "Build REST API" --claude

# Use built-in executor
npx claude-flow@alpha swarm "Optimize queries" --executor --parallel

# Analysis mode (read-only, safe for audits)
npx claude-flow@alpha swarm "Security audit" --analysis --strategy research

# Full options
npx claude-flow@alpha swarm "[objective]" \
  --strategy development \
  --mode hierarchical \
  --max-agents 8 \
  --parallel \
  --monitor
```

---

## 🧠 NEURAL NETWORKING & LEARNING

### Training Commands

```bash
# Train neural patterns from recent operations
npx claude-flow@alpha training neural-train --data recent --model task-predictor

# Train from specific swarm session
npx claude-flow@alpha training neural-train --data "swarm-123" --epochs 100

# Learn from operation outcomes
npx claude-flow@alpha training pattern-learn --operation "code-review" --outcome "success"

# Update agent models with insights
npx claude-flow@alpha training model-update --agent-type coordinator --operation-result "efficient"
```

### Model Types

| Model | Purpose |
|-------|---------|
| `task-predictor` | Predict optimal task assignments |
| `agent-selector` | Select best agent for work type |
| `performance-optimizer` | Optimize execution patterns |
| `coordinator-predictor` | Improve coordination decisions |

---

## 🤖 AGENT TYPES

### Core Agents (Use Task Tool Directly)

| Agent | Model | Tools | Use Case |
|-------|-------|-------|----------|
| `researcher` | haiku/sonnet | Read, Grep, Web | Information gathering |
| `coder` | sonnet | All | Implementation |
| `reviewer` | sonnet | Read, Grep | Code quality |
| `tester` | sonnet | All | Test creation |
| `architect` | opus | All | System design |
| `system-architect` | opus | All | **Director-level** decisions |
| `Explore` | haiku | Read, Glob, Grep | Quick discovery |
| `planner` | opus | All | Strategic planning |
| `debugger` | sonnet | All | Bug investigation |
| `analyzer` | sonnet | Read, Grep, Bash | Performance analysis |
| `coordinator` | sonnet | All | Multi-agent orchestration |

### SPARC Specialized Agents (54 available)

```bash
# List all available agents
npx claude-flow@alpha agents list

# Spawn specific SPARC agent
npx claude-flow@alpha sparc run architect "Design microservices"
npx claude-flow@alpha sparc run tdd "Implement auth module"
npx claude-flow@alpha sparc run swarm-coordinator "Manage development swarm"
```

### Coordination Topologies

```bash
# Initialize with specific topology
npx claude-flow@alpha coordination swarm-init --topology hierarchical --max-agents 8
npx claude-flow@alpha coordination swarm-init --topology mesh --max-agents 12

# Spawn coordinated agent
npx claude-flow@alpha coordination agent-spawn --type developer --name "api-dev" --swarm-id swarm-123

# Orchestrate task across swarm
npx claude-flow@alpha coordination task-orchestrate --task "Build REST API" --strategy parallel --share-results
```

| Topology | Structure | Use Case |
|----------|-----------|----------|
| `hierarchical` | Tree (Director → Workers) | Clear chain of command |
| `mesh` | Peer-to-peer | Collaborative, equal agents |
| `ring` | Sequential handoff | Pipeline workflows |
| `star` | Central coordinator | Hub-and-spoke |
| `hybrid` | Mixed | Complex requirements |

---

## 🧹 WORKSPACE HYGIENE & ARTIFACT GOVERNANCE

### The Problem: Artifact Sprawl
```
❌ WITHOUT GOVERNANCE:
Agent 1 → creates report.md
Agent 2 → creates analysis.txt  
Agent 3 → creates findings.json
Agent 4 → creates summary.md
... 50 files later, workspace is chaos
```

### The Solution: AgentDB + Authorization Tiers

```
✅ WITH GOVERNANCE:
┌─────────────────────────────────────────────────────────────┐
│  ARTIFACT CREATION AUTHORIZATION                            │
│                                                             │
│  TIER 1 - DIRECTORS: Can create institutional documents     │
│  TIER 2 - DOCUMENT AGENTS: Authorized for specific outputs  │
│  TIER 3 - WORKERS: Store in AgentDB ONLY, no file creation  │
└─────────────────────────────────────────────────────────────┘
```

### Authorization Matrix

| Agent Type | Create Files | AgentDB Storage | Use Case |
|------------|--------------|-----------------|----------|
| **Director** | ✅ Yes | ✅ Yes | Synthesis reports, roadmaps |
| **Document Agent** | ✅ Yes (authorized) | ✅ Yes | SOPs, guides, specs |
| **Worker/Specialist** | ❌ No | ✅ Yes (required) | Findings, analysis, data |
| **Explorer** | ❌ No | ⚠️ Optional | Quick lookups |

### Worker Agent Prompt Pattern (No Artifacts)

```
Your task: [specific work]

WORKSPACE HYGIENE RULES:
- Do NOT create files or artifacts
- Store ALL findings in AgentDB:
  npx agentdb reflexion store "[session]" "[task]" [score] [success] "[findings]"
- Return synthesized summary only (max 10 points)
- Raw data stays in AgentDB, insights flow up to Director
```

### Director Agent Prompt Pattern (Authorized Artifacts)

```
You are DIRECTOR of [Division].

AUTHORIZATION: You ARE authorized to create institutional documents.

Create these artifacts:
- [Division]-synthesis-report.md (executive summary)
- [Division]-recommendations.md (actionable items)

Store detailed findings in AgentDB for future reference.
Coordinate workers - they store in AgentDB, YOU create documents.
```

### Document Agent Prompt Pattern (Specific Authorization)

```
You are a DOCUMENT AGENT authorized to create: [specific document type]

AUTHORIZATION SCOPE:
- Create: [authorized-doc].md
- Update: Existing [doc-type] files
- NOT authorized: Other file types

Store research/findings in AgentDB.
Only create the specifically authorized document.
```

### AgentDB as Central Knowledge Store

```bash
# Workers store findings (not files)
npx agentdb reflexion store "worker-001" "security scan" 0.9 true \
  "Found 3 vulnerabilities: SQL injection in /api/users, XSS in comments, CSRF missing"

# Directors query consolidated knowledge
npx agentdb query --query "security vulnerabilities" --k 20 --synthesize-context

# Directors THEN create institutional documents from synthesized knowledge
# → security-audit-report.md (authorized artifact)
```

### Cleanup Pattern

```bash
# Workers: Nothing to clean (stored in AgentDB)

# Directors: Consolidate and archive
npx agentdb skill consolidate 3 0.7 7 true

# Sync institutional knowledge across team
npx agentdb sync push --server [host:port] --incremental
```

---

## 💾 AGENTDB PERSISTENCE

### Core Commands

```bash
# Initialize database
npx agentdb init ./agent-memory.db --dimension 1536 --preset medium

# Store episode/finding after work
npx agentdb reflexion store "[session-id]" "[task]" [reward] [success] "[critique]"
# Example:
npx agentdb reflexion store "session-001" "security audit" 0.9 true "Found 3 vulnerabilities"

# Query knowledge base before work
npx agentdb query --query "[search terms]" --k 10 --synthesize-context

# Store discovered patterns
npx agentdb store-pattern --type "experience" --domain "[domain]" \
  --pattern '{"pattern": "data"}' --confidence 0.9

# Weekly consolidation (CRITICAL)
npx agentdb skill consolidate 3 0.7 7 true
npx agentdb learner run 3 0.6 0.7

# Team sync (QUIC protocol)
npx agentdb sync push --server [host:port] --incremental
npx agentdb sync pull --server [host:port] --incremental
```

---

## 📊 CONTEXT CONSERVATION

```
┌─────────────────────────────────────────────────────────────┐
│  AGENTS SYNTHESIZE → DIRECTOR STRATEGIZES                   │
│                                                             │
│  • Agents do heavy lifting AND distill findings             │
│  • Report back ONLY synthesized summary (max 10 points)     │
│  • Director context stays open for strategic planning       │
│  • Raw data stays with agents, insights flow up             │
│  • Store detailed findings in AgentDB for persistence       │
└─────────────────────────────────────────────────────────────┘
```

### Agent Synthesis Prompt Pattern

```
Your task: [specific work]

IMPORTANT - Before reporting back:
1. Complete your analysis
2. Synthesize findings into max 10 key points
3. Identify blockers, risks, and recommendations
4. Return ONLY the distilled summary, not raw data
5. Store detailed findings:
   npx agentdb reflexion store "[session]" "[task]" [score] [success] "[notes]"
```

---

## 🛠️ COMMON DEPLOYMENTS

### Full Codebase Audit (Recursive Directors)

```javascript
// Spawn two Director-level agents
Task("Security Director",
     "You are DIRECTOR of Security. Spawn specialists for: auth audit, vulnerability scan, compliance check, penetration test. Synthesize findings.",
     "system-architect")

Task("Architecture Director", 
     "You are DIRECTOR of Architecture. Spawn specialists for: code review, performance analysis, scalability audit, tech debt assessment. Synthesize findings.",
     "system-architect")

// Results in 10-12 agents total (2 Directors + 4 specialists each)
```

### Using Hive Mind

```bash
npx claude-flow@alpha hive-mind spawn "Comprehensive codebase audit" \
  --queen-type strategic --max-workers 10 --claude --auto-spawn
```

### Feature Development Pipeline

```bash
npx claude-flow@alpha swarm "Build [feature]" \
  --strategy development --max-agents 5 --claude
```

**Pipeline:** researcher → architect → coder → tester → reviewer

### Bug Investigation

```bash
npx claude-flow@alpha swarm "Investigate [bug]" \
  --strategy analysis --max-agents 3 --analysis
```

---

## ⚡ KEY FLAGS REFERENCE

| Flag | Effect |
|------|--------|
| `--claude` | Opens/generates Claude Code CLI commands |
| `--auto-spawn` | Automatically spawn Claude Code instances |
| `--execute` | Execute spawn commands immediately (no prompts) |
| `--parallel` | Enable parallel execution (2.8-4.4x speedup) |
| `--analysis` | Read-only mode (no code changes) |
| `--monitor` | Real-time monitoring dashboard |
| `--verbose` | Detailed logging |
| `block=false` | Non-blocking TaskOutput (check without waiting) |
| `block=true` | Blocking TaskOutput (wait for completion) |

---

## 📁 PROJECT STRUCTURE

```
[PROJECT]/
├── cmd/                    # Entry points
├── internal/               # Core logic
│   ├── api/               # API handlers
│   ├── auth/              # Authentication  
│   ├── database/          # Data layer
│   └── [domain]/          # Domain logic
├── deployment/            # Infrastructure
├── .claude/               # Claude Code config
│   ├── commands/          # Slash commands (SPARC agents here)
│   └── settings.json      # Hooks, permissions
├── .hive-mind/            # Hive Mind state
│   ├── hive.db           # Collective memory
│   └── config.json       # Queen/worker config
├── agent-memory.db        # AgentDB persistence
├── /tmp/claude/.../tasks/ # Async agent outputs (runtime)
└── CLAUDE.md              # This file
```

---

## ⚠️ RULES

### ALWAYS
- [ ] Deploy agents in parallel (ONE message = ALL operations)
- [ ] Use `TaskOutput(id, block=false)` to monitor async agents
- [ ] Send correction agents if workers go off-track
- [ ] Store lessons in AgentDB after every session
- [ ] Query AgentDB before starting new work
- [ ] Synthesize before reporting (max 10 points)
- [ ] Run weekly consolidation: `npx agentdb skill consolidate 3 0.7 7 true`
- [ ] **WORKERS: Store in AgentDB, NOT files**
- [ ] **DIRECTORS: Create institutional docs, store details in AgentDB**

### NEVER
- [ ] Write implementation code as director
- [ ] Deploy agents sequentially when parallel is available
- [ ] Wait for agents when `block=false` would work
- [ ] Report raw data (synthesize first)
- [ ] Skip AgentDB persistence
- [ ] Ignore P0 blockers
- [ ] **Let workers create artifact files (AgentDB only)**
- [ ] **Create documents without Director/Document Agent authorization**

---

## 🔧 TROUBLESHOOTING

```bash
# Reset Hive Mind
npx claude-flow@alpha hive-mind init --force

# Export state before reset
npx claude-flow@alpha hive-mind memory --export

# Check system status
npx claude-flow@alpha status

# Check async agent output directly
cat /tmp/claude/-[project-path]/tasks/[agentId].output

# List running agents
npx claude-flow@alpha hive-mind status
```

---

## 📋 PROJECT SPECIFICS

### Technology Stack
| Layer | Technology |
|-------|------------|
| **Language** | [language] |
| **Framework** | [framework] |
| **Database** | [database] |
| **Auth** | [auth] |
| **Deployment** | [deployment] |

### Current Metrics
| Metric | Value |
|--------|-------|
| Production Readiness | [X]% |
| Critical Blockers | [N] |
| Test Coverage | [X]% |

### Blockers (P0)
1. [blocker 1]
2. [blocker 2]

### Roadmap
**Phase 1:** [Name] (Week X-Y) - [Priority]
- [ ] Task 1
- [ ] Task 2

---

## 💡 REMEMBER

```
┌─────────────────────────────────────────────────────────────┐
│  YOU ARE THE CAPTAIN                                        │
│                                                             │
│  • Delegate implementation to agents                        │
│  • Deploy agents in parallel (ALWAYS)                       │
│  • Use async patterns: TaskOutput(id, block=false)          │
│  • Promote agents to Directors for complex work             │
│  • Send correction agents mid-flight when needed            │
│  • Synthesize, don't implement                              │
│  • Store lessons learned after every session                │
│  • Train neural patterns for continuous improvement         │
│                                                             │
│  WORKSPACE HYGIENE:                                         │
│  • Workers → AgentDB (no files)                             │
│  • Directors → Institutional docs + AgentDB                 │
│  • AgentDB is the source of truth, not file sprawl          │
└─────────────────────────────────────────────────────────────┘
```

---

*Template v2.2 | Claude Flow 2.7.47+ | CLI v2.0.69+ | AgentDB Governance Model*
