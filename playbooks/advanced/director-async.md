# Async Agent Patterns

Async agent patterns for real-time coordination and recursive spawning.

> **Document ID**: ASYNC | **Version**: 1.2.0 | **Dependencies**: [MAIN]

---

## 🔗 Related Documents

### From This Ecosystem:
- **[Main Operations Guide](../core/CLAUDE-DIRECTOR.md)** - Core orchestration patterns
- **[Workspace Governance](director-hygiene.md)** - Artifact management rules
- **[Setup Guide](../core/director-init.md)** - First-time initialization
- **[Master Index](../INDEX.md)** - Complete navigation system

### Cross-References:
- See `[MAIN:async-agent-patterns]` for comprehensive async documentation
- See `[HYGIENE:artifact-governance]` for artifact creation rules
- See `[OPS:daily-workflows]` for operational procedures

---

## 🔄 ASYNC AGENT BASICS

### Non-Blocking Spawn & Check
```javascript
// Spawn (returns immediately)
Task("researcher", "Analyze topic...", "researcher")
// Returns agentId

// Check status (NON-BLOCKING)
TaskOutput(agentId, block=false)

// Wait for completion (BLOCKING)  
TaskOutput(agentId, block=true)
```

### Read Output Directly
```bash
cat /tmp/claude/-[project-path]/tasks/[agentId].output
```

---

## 🎯 MID-FLIGHT CORRECTION

```javascript
// Agent starts
Task("designer", "Audit https://example.com", "designer")
// agentId: a4abf71

// Check progress
TaskOutput(a4abf71, block=false)
// Wrong URL!

// Launch corrector
Task("corrector", 
     "URGENT: Tell a4abf71 to change to /app URL",
     "coordinator")
```

---

## 🏢 RECURSIVE DIRECTOR SPAWN

```javascript
Task("Division Director",
     `You are DIRECTOR of [Division].
      
      AS A DIRECTOR:
      1. Spawn 3-4 specialists using Task()
      2. Monitor with TaskOutput(id, block=false)
      3. Send corrections if needed
      4. Synthesize findings
      
      SPAWN:
      - Specialist 1: [task]
      - Specialist 2: [task]
      - Specialist 3: [task]`,
     "system-architect")
```

### Hierarchy Pattern
```
CEO (You)
└── COO (Claude Director)
    ├── Research Director (spawned)
    │   ├── Analyst 1
    │   ├── Analyst 2
    │   └── Analyst 3
    └── Design Director (spawned)
        ├── Designer 1
        ├── Designer 2
        └── Designer 3
```

---

## ⚡ QUICK PATTERNS

**Spawn + Monitor:**
```javascript
Task("worker", "...", "coder")  // Returns id
TaskOutput(id, block=false)     // Check anytime
```

**Correct Running Agent:**
```javascript
Task("corrector", "Tell [id] to change approach", "coordinator")
```

**Director Promotion:**
```javascript
Task("Director", "You are DIRECTOR. Spawn your team...", "system-architect")
```

---

## 📍 OUTPUT LOCATIONS

```bash
/tmp/claude/-[project-path]/tasks/[agentId].output
```
