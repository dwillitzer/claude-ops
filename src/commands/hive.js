/**
 * Hive Coordination Commands
 * Cross-director coordination and hive-mind operations
 */

const chalk = require('chalk');
const ora = require('ora');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Hive state file
const HIVE_STATE_PATH = 'memory-bank/active/hive-progress.json';

// Available directors
const DIRECTORS = [
    'architecture',
    'business',
    'design',
    'engineering',
    'research',
    'documentation',
    'operations',
    'security'
];

/**
 * Load hive state
 */
function loadHiveState() {
    const statePath = path.join(process.cwd(), HIVE_STATE_PATH);
    if (fs.existsSync(statePath)) {
        const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
        // Ensure all required fields exist (backwards compatibility)
        if (!state.broadcasts) state.broadcasts = [];
        if (!state.consensusRequests) state.consensusRequests = [];
        if (!state.pendingHandoffs) state.pendingHandoffs = [];
        return state;
    }

    // Initialize default state
    const defaultState = {
        version: '1.0.0',
        lastUpdated: new Date().toISOString(),
        activeCoordination: null,
        directors: {},
        pendingHandoffs: [],
        broadcasts: [],
        consensusRequests: []
    };

    for (const director of DIRECTORS) {
        defaultState.directors[director] = {
            status: 'idle',
            lastActivity: null,
            currentTask: null,
            blockers: [],
            contributions: 0
        };
    }

    return defaultState;
}

/**
 * Save hive state
 */
function saveHiveState(state) {
    const dir = path.dirname(path.join(process.cwd(), HIVE_STATE_PATH));
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    state.lastUpdated = new Date().toISOString();
    const statePath = path.join(process.cwd(), HIVE_STATE_PATH);
    fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
}

/**
 * Show hive status
 */
async function status(options) {
    const state = loadHiveState();

    console.log(chalk.cyan.bold('Hive Mind Status'));
    console.log(chalk.gray('═'.repeat(60)));
    console.log(chalk.gray(`Last Updated: ${new Date(state.lastUpdated).toLocaleString()}`));
    console.log('');

    // Director status
    console.log(chalk.white.bold('Directors:'));
    console.log('');

    for (const [name, director] of Object.entries(state.directors)) {
        const statusColor = {
            active: chalk.green,
            idle: chalk.gray,
            blocked: chalk.red,
            waiting: chalk.yellow
        }[director.status] || chalk.gray;

        const statusIcon = {
            active: '●',
            idle: '○',
            blocked: '✗',
            waiting: '◐'
        }[director.status] || '?';

        console.log(
            statusColor(statusIcon),
            chalk.white(name.padEnd(15)),
            statusColor(`[${director.status}]`),
            chalk.gray(director.currentTask || '')
        );

        if (options.verbose && director.blockers.length > 0) {
            for (const blocker of director.blockers) {
                console.log(chalk.red(`    ⚠ Blocker: ${blocker}`));
            }
        }
    }

    // Active coordination
    if (state.activeCoordination) {
        console.log('');
        console.log(chalk.yellow.bold('Active Coordination:'));
        console.log(chalk.white(`  Type: ${state.activeCoordination.type}`));
        console.log(chalk.white(`  Started: ${new Date(state.activeCoordination.startedAt).toLocaleString()}`));
        console.log(chalk.white(`  Participants: ${state.activeCoordination.participants.join(', ')}`));
    }

    // Pending handoffs
    if (state.pendingHandoffs.length > 0) {
        console.log('');
        console.log(chalk.yellow.bold(`Pending Handoffs (${state.pendingHandoffs.length}):`));
        for (const handoff of state.pendingHandoffs.slice(0, 5)) {
            console.log(chalk.gray(`  ${handoff.from} → ${handoff.to}: ${handoff.context.substring(0, 40)}...`));
        }
    }

    // Stats
    console.log('');
    console.log(chalk.gray('─'.repeat(60)));
    const activeCount = Object.values(state.directors).filter(d => d.status === 'active').length;
    const blockedCount = Object.values(state.directors).filter(d => d.status === 'blocked').length;
    console.log(
        chalk.white('Summary:'),
        chalk.green(`${activeCount} active`),
        chalk.gray(`${DIRECTORS.length - activeCount - blockedCount} idle`),
        chalk.red(`${blockedCount} blocked`)
    );

    return state;
}

/**
 * Sync director state
 */
async function sync(director, options) {
    const spinner = ora(`Syncing ${director || 'all directors'}...`).start();

    try {
        const state = loadHiveState();

        if (director) {
            // Sync specific director
            if (!DIRECTORS.includes(director)) {
                spinner.fail(chalk.red(`Unknown director: ${director}`));
                process.exit(1);
            }

            state.directors[director].status = options.status || 'active';
            state.directors[director].lastActivity = new Date().toISOString();
            if (options.task) {
                state.directors[director].currentTask = options.task;
            }
            if (options.blocker) {
                state.directors[director].blockers.push(options.blocker);
            }
            if (options.clearBlockers) {
                state.directors[director].blockers = [];
            }

            saveHiveState(state);
            spinner.succeed(chalk.green(`Synced: ${director}`));
        } else {
            // Sync all - read from director files if available
            const directorsDir = path.join(process.cwd(), 'directors');
            if (fs.existsSync(directorsDir)) {
                for (const dir of DIRECTORS) {
                    state.directors[dir].lastActivity = new Date().toISOString();
                }
            }
            saveHiveState(state);
            spinner.succeed(chalk.green('All directors synced'));
        }

        return state;
    } catch (error) {
        spinner.fail(chalk.red('Sync failed'));
        console.error(chalk.red(error.message));
        process.exit(1);
    }
}

/**
 * Broadcast message to all directors
 */
async function broadcast(message, options) {
    const spinner = ora('Broadcasting message...').start();

    try {
        const state = loadHiveState();

        const broadcastEntry = {
            id: uuidv4(),
            timestamp: new Date().toISOString(),
            from: options.from || 'system',
            priority: options.priority || 'normal',
            message,
            targets: options.targets ? options.targets.split(',') : DIRECTORS,
            acknowledged: []
        };

        state.broadcasts.push(broadcastEntry);

        // Keep only last 50 broadcasts
        if (state.broadcasts.length > 50) {
            state.broadcasts = state.broadcasts.slice(-50);
        }

        saveHiveState(state);

        spinner.succeed(chalk.green('Broadcast sent'));
        console.log('');
        console.log(chalk.cyan('Broadcast ID:'), broadcastEntry.id.substring(0, 8));
        console.log(chalk.cyan('From:'), broadcastEntry.from);
        console.log(chalk.cyan('Priority:'), broadcastEntry.priority);
        console.log(chalk.cyan('Targets:'), broadcastEntry.targets.join(', '));
        console.log(chalk.cyan('Message:'), message);

        return broadcastEntry;
    } catch (error) {
        spinner.fail(chalk.red('Broadcast failed'));
        console.error(chalk.red(error.message));
        process.exit(1);
    }
}

/**
 * Request consensus from directors
 */
async function consensus(topic, options) {
    const spinner = ora('Creating consensus request...').start();

    try {
        const state = loadHiveState();

        const consensusRequest = {
            id: uuidv4(),
            timestamp: new Date().toISOString(),
            topic,
            description: options.description || '',
            options: options.options ? options.options.split(',') : ['approve', 'reject'],
            requiredVotes: options.threshold ? parseInt(options.threshold) : Math.ceil(DIRECTORS.length / 2) + 1,
            deadline: options.deadline || null,
            votes: {},
            status: 'open'
        };

        state.consensusRequests.push(consensusRequest);
        saveHiveState(state);

        spinner.succeed(chalk.green('Consensus request created'));
        console.log('');
        console.log(chalk.cyan('Request ID:'), consensusRequest.id.substring(0, 8));
        console.log(chalk.cyan('Topic:'), topic);
        console.log(chalk.cyan('Options:'), consensusRequest.options.join(', '));
        console.log(chalk.cyan('Required Votes:'), consensusRequest.requiredVotes);

        return consensusRequest;
    } catch (error) {
        spinner.fail(chalk.red('Failed to create consensus request'));
        console.error(chalk.red(error.message));
        process.exit(1);
    }
}

/**
 * Vote on consensus request
 */
async function vote(requestId, choice, options) {
    const spinner = ora('Recording vote...').start();

    try {
        const state = loadHiveState();

        const request = state.consensusRequests.find(
            r => r.id === requestId || r.id.startsWith(requestId)
        );

        if (!request) {
            spinner.fail(chalk.red('Consensus request not found'));
            process.exit(1);
        }

        if (request.status !== 'open') {
            spinner.fail(chalk.red('Consensus request is closed'));
            process.exit(1);
        }

        const voter = options.director || 'anonymous';

        if (!request.options.includes(choice)) {
            spinner.fail(chalk.red(`Invalid choice. Options: ${request.options.join(', ')}`));
            process.exit(1);
        }

        request.votes[voter] = {
            choice,
            timestamp: new Date().toISOString(),
            notes: options.notes || ''
        };

        // Check if consensus reached
        const voteCount = {};
        for (const v of Object.values(request.votes)) {
            voteCount[v.choice] = (voteCount[v.choice] || 0) + 1;
        }

        for (const [choice, count] of Object.entries(voteCount)) {
            if (count >= request.requiredVotes) {
                request.status = 'resolved';
                request.outcome = choice;
                request.resolvedAt = new Date().toISOString();
            }
        }

        saveHiveState(state);

        spinner.succeed(chalk.green('Vote recorded'));
        console.log('');
        console.log(chalk.cyan('Voter:'), voter);
        console.log(chalk.cyan('Choice:'), choice);
        console.log(chalk.cyan('Total Votes:'), Object.keys(request.votes).length);

        if (request.status === 'resolved') {
            console.log('');
            console.log(chalk.green.bold(`✓ Consensus reached: ${request.outcome}`));
        }

        return request;
    } catch (error) {
        spinner.fail(chalk.red('Failed to record vote'));
        console.error(chalk.red(error.message));
        process.exit(1);
    }
}

/**
 * Show hive metrics
 */
async function metrics(options) {
    const state = loadHiveState();

    console.log(chalk.cyan.bold('Hive Metrics'));
    console.log(chalk.gray('═'.repeat(60)));
    console.log('');

    // Director activity
    const activeDirectors = Object.entries(state.directors)
        .filter(([_, d]) => d.lastActivity)
        .sort((a, b) => new Date(b[1].lastActivity) - new Date(a[1].lastActivity));

    console.log(chalk.white.bold('Director Activity (Most Recent):'));
    for (const [name, data] of activeDirectors) {
        const ago = data.lastActivity
            ? timeSince(new Date(data.lastActivity))
            : 'never';
        console.log(chalk.gray(`  ${name.padEnd(15)}`), chalk.cyan(ago));
    }
    console.log('');

    // Contributions
    const contributions = Object.entries(state.directors)
        .sort((a, b) => b[1].contributions - a[1].contributions);

    console.log(chalk.white.bold('Contributions:'));
    for (const [name, data] of contributions) {
        const bar = '█'.repeat(Math.min(data.contributions, 20));
        console.log(chalk.gray(`  ${name.padEnd(15)}`), chalk.green(bar), data.contributions);
    }
    console.log('');

    // Handoff stats
    console.log(chalk.white.bold('Handoffs:'));
    console.log(chalk.gray(`  Pending: ${state.pendingHandoffs.length}`));
    console.log('');

    // Consensus stats
    const openConsensus = state.consensusRequests.filter(r => r.status === 'open').length;
    const resolvedConsensus = state.consensusRequests.filter(r => r.status === 'resolved').length;
    console.log(chalk.white.bold('Consensus Requests:'));
    console.log(chalk.gray(`  Open: ${openConsensus}`));
    console.log(chalk.gray(`  Resolved: ${resolvedConsensus}`));
    console.log('');

    // Broadcast stats
    console.log(chalk.white.bold('Broadcasts:'));
    console.log(chalk.gray(`  Total: ${state.broadcasts.length}`));

    return state;
}

/**
 * Calculate time since a date
 */
function timeSince(date) {
    const seconds = Math.floor((new Date() - date) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

/**
 * Initialize hive state
 */
async function init(options) {
    const spinner = ora('Initializing hive state...').start();

    try {
        const state = loadHiveState();

        // Reset all directors to idle
        for (const director of DIRECTORS) {
            state.directors[director] = {
                status: 'idle',
                lastActivity: new Date().toISOString(),
                currentTask: null,
                blockers: [],
                contributions: 0
            };
        }

        state.activeCoordination = null;
        if (options.clearAll) {
            state.pendingHandoffs = [];
            state.broadcasts = [];
            state.consensusRequests = [];
        }

        saveHiveState(state);

        spinner.succeed(chalk.green('Hive initialized'));
        console.log('');
        console.log(chalk.cyan('Directors:'), DIRECTORS.length);
        console.log(chalk.gray('All directors set to idle state'));

        return state;
    } catch (error) {
        spinner.fail(chalk.red('Initialization failed'));
        console.error(chalk.red(error.message));
        process.exit(1);
    }
}

module.exports = {
    status,
    sync,
    broadcast,
    consensus,
    vote,
    metrics,
    init
};
