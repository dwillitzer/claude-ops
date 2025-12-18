#!/usr/bin/env node
/**
 * Claude-Ops MCP Server
 * Model Context Protocol server for Claude Code integration
 *
 * Provides tools for:
 * - Session management (start, checkpoint, resume)
 * - Feature tracking (add, update, validate)
 * - Progress logging
 * - Hive coordination
 * - Validation commands
 */

const readline = require('readline');
const { getSessionManager } = require('../lib/session-manager');
const featureCmd = require('../commands/feature');
const progressCmd = require('../commands/progress');
const hiveCmd = require('../commands/hive');
const validateCmd = require('../commands/validate');

// MCP Protocol version
const PROTOCOL_VERSION = '2024-11-05';

// Server info
const SERVER_INFO = {
    name: 'claude-ops',
    version: '2.0.0',
    description: 'Claude-Ops multi-agent orchestration tools'
};

// Available tools
const TOOLS = [
    {
        name: 'session_start',
        description: 'Start a new Claude Code session with optional director and feature assignment',
        inputSchema: {
            type: 'object',
            properties: {
                director: { type: 'string', description: 'Assign to a specific director' },
                feature: { type: 'string', description: 'Associate with a feature ID' },
                type: { type: 'string', default: 'claude-code', description: 'Session type' }
            }
        }
    },
    {
        name: 'session_checkpoint',
        description: 'Create a checkpoint in the current session',
        inputSchema: {
            type: 'object',
            properties: {
                name: { type: 'string', description: 'Checkpoint name' },
                notes: { type: 'string', description: 'Checkpoint notes' },
                state: { type: 'object', description: 'State to save' }
            }
        }
    },
    {
        name: 'session_resume',
        description: 'Resume a previous session',
        inputSchema: {
            type: 'object',
            properties: {
                sessionId: { type: 'string', description: 'Session ID to resume' },
                checkpointId: { type: 'string', description: 'Optional checkpoint to restore' }
            },
            required: ['sessionId']
        }
    },
    {
        name: 'session_list',
        description: 'List all sessions',
        inputSchema: {
            type: 'object',
            properties: {
                status: { type: 'string', enum: ['active', 'paused', 'completed'] },
                director: { type: 'string' }
            }
        }
    },
    {
        name: 'feature_add',
        description: 'Add a new feature to track',
        inputSchema: {
            type: 'object',
            properties: {
                name: { type: 'string', description: 'Feature name' },
                description: { type: 'string', description: 'Feature description' },
                director: { type: 'string', description: 'Assigned director' },
                priority: { type: 'string', enum: ['low', 'normal', 'high', 'critical'] }
            },
            required: ['name']
        }
    },
    {
        name: 'feature_update',
        description: 'Update a feature',
        inputSchema: {
            type: 'object',
            properties: {
                featureId: { type: 'string', description: 'Feature ID' },
                status: { type: 'string', enum: ['pending', 'in_progress', 'blocked', 'validating', 'completed'] },
                notes: { type: 'string' }
            },
            required: ['featureId']
        }
    },
    {
        name: 'feature_validate',
        description: 'Validate a feature through quality gates',
        inputSchema: {
            type: 'object',
            properties: {
                featureId: { type: 'string', description: 'Feature ID' },
                gate: { type: 'string', description: 'Specific gate to validate' },
                result: { type: 'string', enum: ['passed', 'failed'] }
            },
            required: ['featureId']
        }
    },
    {
        name: 'feature_list',
        description: 'List features',
        inputSchema: {
            type: 'object',
            properties: {
                status: { type: 'string' },
                director: { type: 'string' }
            }
        }
    },
    {
        name: 'progress_log',
        description: 'Log a progress entry',
        inputSchema: {
            type: 'object',
            properties: {
                message: { type: 'string', description: 'Progress message' },
                type: { type: 'string', enum: ['progress', 'milestone', 'decision', 'blocker', 'resolved', 'learning', 'handoff'] },
                feature: { type: 'string', description: 'Associated feature' },
                director: { type: 'string', description: 'Associated director' }
            },
            required: ['message']
        }
    },
    {
        name: 'hive_status',
        description: 'Get hive coordination status',
        inputSchema: {
            type: 'object',
            properties: {}
        }
    },
    {
        name: 'hive_sync',
        description: 'Sync director state in hive',
        inputSchema: {
            type: 'object',
            properties: {
                director: { type: 'string', description: 'Director to sync' },
                status: { type: 'string', enum: ['active', 'idle', 'blocked', 'waiting'] },
                task: { type: 'string', description: 'Current task' }
            }
        }
    },
    {
        name: 'hive_broadcast',
        description: 'Broadcast message to directors',
        inputSchema: {
            type: 'object',
            properties: {
                message: { type: 'string', description: 'Broadcast message' },
                priority: { type: 'string', enum: ['low', 'normal', 'high', 'critical'] },
                targets: { type: 'string', description: 'Comma-separated target directors' }
            },
            required: ['message']
        }
    },
    {
        name: 'validate_daily',
        description: 'Run daily constitutional validation',
        inputSchema: {
            type: 'object',
            properties: {}
        }
    },
    {
        name: 'validate_compliance',
        description: 'Check compliance status',
        inputSchema: {
            type: 'object',
            properties: {}
        }
    }
];

/**
 * Handle tool calls
 */
async function handleToolCall(name, args) {
    const sessionManager = getSessionManager();

    try {
        switch (name) {
            case 'session_start': {
                const session = sessionManager.createSession({
                    type: args.type || 'claude-code',
                    director: args.director,
                    feature: args.feature
                });
                return {
                    success: true,
                    sessionId: session.id,
                    message: `Session started: ${session.id}`
                };
            }

            case 'session_checkpoint': {
                const checkpoint = sessionManager.createCheckpoint({
                    name: args.name,
                    notes: args.notes,
                    state: args.state
                });
                return {
                    success: true,
                    checkpointId: checkpoint.id,
                    message: `Checkpoint created: ${checkpoint.name}`
                };
            }

            case 'session_resume': {
                const session = sessionManager.resumeSession(args.sessionId);
                if (!session) {
                    return { success: false, error: 'Session not found' };
                }
                if (args.checkpointId) {
                    sessionManager.restoreCheckpoint(args.checkpointId);
                }
                return {
                    success: true,
                    sessionId: session.id,
                    message: `Session resumed: ${session.id}`
                };
            }

            case 'session_list': {
                const sessions = sessionManager.listSessions({
                    status: args.status,
                    director: args.director
                });
                return {
                    success: true,
                    sessions: sessions.map(s => ({
                        id: s.id,
                        type: s.type,
                        status: s.status,
                        director: s.director,
                        createdAt: s.createdAt
                    }))
                };
            }

            case 'feature_add': {
                // Suppress console output for MCP
                const originalLog = console.log;
                console.log = () => {};
                try {
                    const feature = await featureCmd.add(args.name, {
                        description: args.description,
                        director: args.director,
                        priority: args.priority
                    });
                    return {
                        success: true,
                        featureId: feature.id,
                        message: `Feature added: ${feature.name}`
                    };
                } finally {
                    console.log = originalLog;
                }
            }

            case 'feature_update': {
                const originalLog = console.log;
                console.log = () => {};
                try {
                    const feature = await featureCmd.update(args.featureId, {
                        status: args.status,
                        notes: args.notes
                    });
                    return {
                        success: true,
                        featureId: feature.id,
                        message: `Feature updated: ${feature.name}`
                    };
                } finally {
                    console.log = originalLog;
                }
            }

            case 'feature_validate': {
                const originalLog = console.log;
                console.log = () => {};
                try {
                    const feature = await featureCmd.validate(args.featureId, {
                        gate: args.gate,
                        result: args.result
                    });
                    return {
                        success: true,
                        featureId: feature.id,
                        validationStatus: feature.validation.status
                    };
                } finally {
                    console.log = originalLog;
                }
            }

            case 'feature_list': {
                const fs = require('fs');
                const path = require('path');
                const listPath = path.join(process.cwd(), 'memory-bank/feature_lists/active.json');
                if (fs.existsSync(listPath)) {
                    const data = JSON.parse(fs.readFileSync(listPath, 'utf8'));
                    let features = data.features || [];
                    if (args.status) {
                        features = features.filter(f => f.status === args.status);
                    }
                    if (args.director) {
                        features = features.filter(f => f.director === args.director);
                    }
                    return {
                        success: true,
                        features: features.map(f => ({
                            id: f.id,
                            name: f.name,
                            status: f.status,
                            priority: f.priority,
                            director: f.director
                        }))
                    };
                }
                return { success: true, features: [] };
            }

            case 'progress_log': {
                const originalLog = console.log;
                console.log = () => {};
                try {
                    await progressCmd.log(args.message, {
                        type: args.type,
                        feature: args.feature,
                        director: args.director
                    });
                    return {
                        success: true,
                        message: 'Progress logged'
                    };
                } finally {
                    console.log = originalLog;
                }
            }

            case 'hive_status': {
                const fs = require('fs');
                const path = require('path');
                const statePath = path.join(process.cwd(), 'memory-bank/active/hive-progress.json');
                if (fs.existsSync(statePath)) {
                    const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
                    return {
                        success: true,
                        hive: {
                            lastUpdated: state.lastUpdated,
                            directors: Object.entries(state.directors).map(([name, data]) => ({
                                name,
                                status: data.status,
                                currentTask: data.currentTask
                            })),
                            pendingHandoffs: state.pendingHandoffs?.length || 0
                        }
                    };
                }
                return { success: true, hive: { directors: [], pendingHandoffs: 0 } };
            }

            case 'hive_sync': {
                const originalLog = console.log;
                console.log = () => {};
                try {
                    await hiveCmd.sync(args.director, {
                        status: args.status,
                        task: args.task
                    });
                    return {
                        success: true,
                        message: `Director ${args.director || 'all'} synced`
                    };
                } finally {
                    console.log = originalLog;
                }
            }

            case 'hive_broadcast': {
                const originalLog = console.log;
                console.log = () => {};
                try {
                    await hiveCmd.broadcast(args.message, {
                        priority: args.priority,
                        targets: args.targets
                    });
                    return {
                        success: true,
                        message: 'Broadcast sent'
                    };
                } finally {
                    console.log = originalLog;
                }
            }

            case 'validate_daily': {
                const originalLog = console.log;
                const originalExit = process.exit;
                console.log = () => {};
                process.exit = () => {};
                try {
                    const results = await validateCmd.daily({ quiet: true });
                    return {
                        success: true,
                        validation: results
                    };
                } finally {
                    console.log = originalLog;
                    process.exit = originalExit;
                }
            }

            case 'validate_compliance': {
                const originalLog = console.log;
                console.log = () => {};
                try {
                    const results = await validateCmd.compliance({ quiet: true });
                    return {
                        success: true,
                        compliance: results
                    };
                } finally {
                    console.log = originalLog;
                }
            }

            default:
                return { success: false, error: `Unknown tool: ${name}` };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Send JSON-RPC response
 */
function sendResponse(id, result) {
    const response = {
        jsonrpc: '2.0',
        id,
        result
    };
    console.log(JSON.stringify(response));
}

/**
 * Send JSON-RPC error
 */
function sendError(id, code, message) {
    const response = {
        jsonrpc: '2.0',
        id,
        error: { code, message }
    };
    console.log(JSON.stringify(response));
}

/**
 * Handle JSON-RPC request
 */
async function handleRequest(request) {
    const { id, method, params } = request;

    switch (method) {
        case 'initialize':
            sendResponse(id, {
                protocolVersion: PROTOCOL_VERSION,
                serverInfo: SERVER_INFO,
                capabilities: {
                    tools: {}
                }
            });
            break;

        case 'tools/list':
            sendResponse(id, { tools: TOOLS });
            break;

        case 'tools/call':
            const result = await handleToolCall(params.name, params.arguments || {});
            sendResponse(id, {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
            });
            break;

        case 'notifications/initialized':
            // No response needed for notifications
            break;

        default:
            sendError(id, -32601, `Method not found: ${method}`);
    }
}

/**
 * Start MCP server
 */
function startServer() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    rl.on('line', async (line) => {
        try {
            const request = JSON.parse(line);
            await handleRequest(request);
        } catch (error) {
            sendError(null, -32700, 'Parse error');
        }
    });

    // Handle process signals
    process.on('SIGINT', () => process.exit(0));
    process.on('SIGTERM', () => process.exit(0));
}

// Start server if run directly
if (require.main === module) {
    startServer();
}

module.exports = {
    startServer,
    handleToolCall,
    TOOLS
};
