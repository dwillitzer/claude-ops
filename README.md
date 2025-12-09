# Claude-Ops CLI

**Director-based multi-agent orchestration CLI with WASM security hardening**

[![npm version](https://img.shields.io/npm/v/claude-ops.svg)](https://www.npmjs.com/package/claude-ops)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🐝 **Queenbee Orchestration**: Strategic, tactical, and adaptive director coordination
- 🔐 **WASM Security**: Rust-compiled security layer prevents prompt injection, data leaks
- 🚀 **Simple Commands**: `init`, `spawn`, `status`, `handoff`
- 📦 **Zero Project Pollution**: CLI lives in npm, templates copy on init
- 🎯 **Three Scopes**: Project (.claude), user (~/.claude), or custom global paths

## Installation

```bash
# Global install
npm install -g claude-ops

# Or use with npx (no install)
npx claude-ops <command>
```

## Quick Start

```bash
# Initialize (interactive wizard)
claude-ops init --interactive

# Or quick init in current directory
claude-ops init

# Spawn all 8 directors
claude-ops spawn all

# Check status
claude-ops status
```

## Commands

### `init` - Initialize Structure

```bash
# Current directory (default)
claude-ops init

# User home (~/.claude)
claude-ops init --scope user

# Custom global path
claude-ops init --scope global --path /opt/claude-ops

# Interactive wizard
claude-ops init --interactive

# Minimal setup (no ReasoningBank/hive-mind)
claude-ops init --minimal

# Specific directors only
claude-ops init --directors architecture,engineering,security
```

### `spawn` - Spawn Directors

```bash
# All 8 directors
claude-ops spawn all

# Strategic directors only
claude-ops spawn strategic

# Tactical directors only
claude-ops spawn tactical

# Single director
claude-ops spawn architecture

# Custom configuration
claude-ops spawn engineering --type tactical --workers 12 --encryption
```

### `status` - Show Status

```bash
# Show status
claude-ops status

# Verbose output
claude-ops status --verbose
```

### `handoff` - Create Director Handoff

```bash
# Create handoff
claude-ops handoff architecture engineering "Implement auth system"

# High priority
claude-ops handoff security operations "Critical patch" --priority high
```

## Director Types

| Director | Queenbee Type | Consensus | Workers |
|----------|--------------|-----------|---------|
| Architecture | Strategic | Majority | 8 |
| Business | Strategic | Weighted | 8 |
| Operations | Strategic | Byzantine | 8 |
| Security | Strategic | Byzantine | 6 |
| Design | Tactical | Majority | 6 |
| Engineering | Tactical | Majority | 10 |
| Documentation | Tactical | Majority | 4 |
| Research | Adaptive | Majority | 6 |

## WASM Security Layer

The Rust-compiled WASM module provides:

- **Prompt Injection Detection**: Jailbreaks, role manipulation, system prompt leakage
- **Routing Validation**: Cross-domain handoff validation
- **Input Sanitization**: Path traversal, XSS, control character filtering
- **Memory Safety**: WASM sandbox prevents data leaks

## Directory Structure

After `claude-ops init`:

```
.claude/
├── agents/                    # 8 director templates
│   ├── architecture-director.md
│   ├── business-director.md
│   ├── design-director.md
│   ├── engineering-director.md
│   ├── research-director.md
│   ├── documentation-director.md
│   ├── operations-director.md
│   └── security-director.md
├── teams/                     # Team-specific agents (AgentDB)
├── memory-bank/               # Shared knowledge
│   ├── active/
│   ├── constitutional/
│   ├── core/
│   ├── decision_log/
│   ├── index/
│   └── sops/
└── .hive-mind/               # Hive-mind configuration
    └── config.json
```

## Integration with Claude-Flow

Claude-ops wraps `claude-flow` for simplicity but provides:

1. **Director-aware abstractions** (spawn all, spawn strategic)
2. **WASM security validation** on all inputs
3. **Template management** from core claude-ops repo
4. **Simplified command surface** (4 commands vs 30+)

## Development

```bash
# Clone repo
git clone https://github.com/dwillitzer/claude-ops-cli
cd claude-ops-cli

# Install dependencies
npm install

# Build WASM module
npm run build:wasm

# Test locally
npm link
claude-ops --help
```

## Publishing

```bash
# Build WASM first
npm run build:wasm

# Publish to npm
npm version patch
npm publish
```

## License

MIT © Daniel Willitzer

## Related

- [claude-ops](https://github.com/dwillitzer/claude-ops) - Core director framework
- [claude-flow](https://github.com/ruvnet/claude-flow) - Underlying orchestration system

---

**Version**: 0.1.0  
**Author**: Daniel Willitzer <daniel@willitzer.com>
