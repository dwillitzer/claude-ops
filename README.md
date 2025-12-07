# Claude-Ops Agent System

A structured multi-agent orchestration system for Claude-based AI workflows.

## Directory Structure

```
.claude/
├── agents/           # Director-level agents (loaded into main context)
├── teams/            # Domain-specific teams (queried via AgentDB)
└── memory-bank/      # Shared memory structures
    ├── active/       # Current context and issues
    ├── constitutional/  # Core principles and constitution
    ├── core/         # Execution policies and frameworks
    ├── decision_log/ # Decision tracking templates
    ├── index/        # Memory indexing
    └── sops/         # Standard operating procedures
```

## Agents Overview

The system uses a **director-based architecture** with eight specialized directors:

- **Architecture Director**: System design, patterns, technical decisions
- **Business Director**: Strategy, priorities, resource allocation
- **Design Director**: UX/DX, interfaces, API contracts
- **Engineering Director**: Implementation, code, CI/CD
- **Research Director**: Research, exploration, best practices
- **Documentation Director**: Formal documentation
- **Operations Director**: Production operations, monitoring, reliability
- **Security Director**: Security architecture, risk management, compliance

See [`agents/README.md`](agents/README.md) for complete director documentation.

## Teams

Directors collaborate with domain-specific teams in their respective areas. Team members are discovered via AgentDB queries when their specialized expertise is needed.

See [`teams/README.md`](teams/README.md) for team collaboration and coordination.

## Memory Bank

The memory bank provides shared knowledge structures:

- **Active Context**: Current work and open issues
- **Constitutional**: Core principles and governance
- **Core**: Execution policies and frameworks  
- **SOPs**: Standard operating procedures (handoffs, spawning, etc.)
- **Decision Log**: Template for tracking decisions

## Getting Started

1. Review the [agents directory](agents/) to understand the director system
2. Check the [memory-bank/constitutional](memory-bank/constitutional/) for core principles
3. See [memory-bank/sops](memory-bank/sops/) for operational procedures

## Branch Strategy

- `main`: Production-ready agent configurations
- `dev`: Development and experimental configurations
- `research-foundations`: Original research and foundational work

---

**Version**: 2.0  
**Last Updated**: 2025-12-04
