/**
 * Tmux Orchestrator Command
 * Spawns directors in tmux panes for parallel multi-agent execution
 */

const { execSync, spawn } = require('child_process');
const chalk = require('chalk');
const path = require('path');

// Default directors
const ALL_DIRECTORS = [
    'architecture',
    'engineering',
    'research',
    'operations',
    'design',
    'business',
    'documentation',
    'security'
];

/**
 * Check if tmux is available
 */
function hasTmux() {
    try {
        execSync('which tmux', { stdio: 'ignore' });
        return true;
    } catch {
        return false;
    }
}

/**
 * Check if session exists
 */
function sessionExists(sessionName) {
    try {
        execSync(`tmux has-session -t ${sessionName} 2>/dev/null`);
        return true;
    } catch {
        return false;
    }
}

/**
 * Start orchestration session
 */
async function start(options) {
    if (!hasTmux()) {
        console.log(chalk.red('Error: tmux is not installed'));
        process.exit(1);
    }

    const sessionName = options.session || 'claude-ops';
    const directors = options.directors ? options.directors.split(',') : ['engineering', 'architecture', 'research', 'operations'];
    const cwd = process.cwd();

    console.log(chalk.cyan.bold('Claude-Ops Tmux Orchestrator'));
    console.log(chalk.gray('═'.repeat(50)));

    if (sessionExists(sessionName)) {
        console.log(chalk.yellow(`Session "${sessionName}" already exists`));
        console.log(chalk.gray(`Run: tmux attach -t ${sessionName}`));
        return;
    }

    console.log(chalk.white('Session:'), chalk.green(sessionName));
    console.log(chalk.white('Directors:'), chalk.green(directors.join(', ')));
    console.log('');

    // Create session with hive coordinator
    execSync(`tmux new-session -d -s ${sessionName} -n hive -c "${cwd}"`, { stdio: 'ignore' });

    // Configure pane borders
    execSync(`tmux set-option -t ${sessionName} pane-border-status top`, { stdio: 'ignore' });

    // Send initial command to hive pane
    execSync(`tmux send-keys -t ${sessionName} "echo '🐝 Hive Coordinator'" Enter`, { stdio: 'ignore' });
    execSync(`tmux send-keys -t ${sessionName} "node bin/claude-ops.js hive status --verbose" Enter`, { stdio: 'ignore' });

    // Create panes for directors (up to 4 in a grid)
    const maxPanes = Math.min(directors.length, 4);

    for (let i = 0; i < maxPanes; i++) {
        const director = directors[i];

        if (i === 0) {
            // Split horizontally for first director
            execSync(`tmux split-window -h -t ${sessionName} -c "${cwd}"`, { stdio: 'ignore' });
        } else if (i === 1) {
            // Split pane 0 vertically
            execSync(`tmux select-pane -t ${sessionName}:0.0`, { stdio: 'ignore' });
            execSync(`tmux split-window -v -t ${sessionName} -c "${cwd}"`, { stdio: 'ignore' });
        } else if (i === 2) {
            // Split pane 1 vertically
            execSync(`tmux select-pane -t ${sessionName}:0.1`, { stdio: 'ignore' });
            execSync(`tmux split-window -v -t ${sessionName} -c "${cwd}"`, { stdio: 'ignore' });
        } else if (i === 3) {
            // Split for 4th pane
            execSync(`tmux select-pane -t ${sessionName}:0.2`, { stdio: 'ignore' });
            execSync(`tmux split-window -v -t ${sessionName} -c "${cwd}"`, { stdio: 'ignore' });
        }

        // Initialize director in pane
        execSync(`tmux send-keys -t ${sessionName} "echo '🎯 ${director.toUpperCase()} Director'" Enter`, { stdio: 'ignore' });
        execSync(`tmux send-keys -t ${sessionName} "node bin/claude-ops.js hive sync ${director} --status active" Enter`, { stdio: 'ignore' });
    }

    // Select first pane
    execSync(`tmux select-pane -t ${sessionName}:0.0`, { stdio: 'ignore' });

    console.log(chalk.green('✓ Orchestration session created'));
    console.log('');
    console.log(chalk.white('To attach:'), chalk.cyan(`tmux attach -t ${sessionName}`));
    console.log(chalk.white('To kill:'), chalk.cyan(`tmux kill-session -t ${sessionName}`));

    if (options.attach) {
        console.log('');
        console.log(chalk.gray('Attaching to session...'));
        const attach = spawn('tmux', ['attach', '-t', sessionName], {
            stdio: 'inherit'
        });
    }
}

/**
 * Stop orchestration session
 */
async function stop(options) {
    const sessionName = options.session || 'claude-ops';

    if (!sessionExists(sessionName)) {
        console.log(chalk.yellow(`Session "${sessionName}" does not exist`));
        return;
    }

    // Sync all directors to idle before stopping
    console.log(chalk.cyan('Stopping orchestration session...'));

    try {
        execSync(`node bin/claude-ops.js hive sync --status idle`, { stdio: 'ignore' });
    } catch {}

    execSync(`tmux kill-session -t ${sessionName}`, { stdio: 'ignore' });
    console.log(chalk.green(`✓ Session "${sessionName}" stopped`));
}

/**
 * List orchestration sessions
 */
async function list() {
    if (!hasTmux()) {
        console.log(chalk.red('Error: tmux is not installed'));
        return;
    }

    try {
        const sessions = execSync('tmux list-sessions 2>/dev/null', { encoding: 'utf8' });
        console.log(chalk.cyan.bold('Tmux Sessions'));
        console.log(chalk.gray('─'.repeat(40)));
        console.log(sessions);
    } catch {
        console.log(chalk.yellow('No tmux sessions running'));
    }
}

/**
 * Send command to a director pane
 */
async function send(director, command, options) {
    const sessionName = options.session || 'claude-ops';

    if (!sessionExists(sessionName)) {
        console.log(chalk.red(`Session "${sessionName}" does not exist`));
        return;
    }

    // Find pane for director (simplified - assumes standard layout)
    const paneMap = {
        'hive': '0.0',
        'engineering': '0.1',
        'architecture': '0.2',
        'research': '0.3',
        'operations': '0.4'
    };

    const pane = paneMap[director] || '0.1';

    execSync(`tmux send-keys -t ${sessionName}:${pane} "${command}" Enter`, { stdio: 'ignore' });
    console.log(chalk.green(`✓ Sent to ${director}: ${command}`));
}

module.exports = {
    start,
    stop,
    list,
    send
};
