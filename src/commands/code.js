/**
 * Claude Code Integration Commands
 * Manages Claude Code sessions with checkpoint and resume support
 */

const chalk = require('chalk');
const ora = require('ora');
const { getSessionManager } = require('../lib/session-manager');

/**
 * Start a new Claude Code session
 */
async function start(options) {
    const spinner = ora('Starting new Claude Code session...').start();
    const sessionManager = getSessionManager();

    try {
        const session = sessionManager.createSession({
            type: 'claude-code',
            director: options.director || null,
            feature: options.feature || null,
            context: {
                prompt: options.prompt || null,
                model: options.model || 'default',
                workdir: process.cwd()
            }
        });

        spinner.succeed(chalk.green('Session started'));
        console.log('');
        console.log(chalk.cyan('Session ID:'), session.id);
        console.log(chalk.cyan('Director:'), session.director || 'none');
        console.log(chalk.cyan('Feature:'), session.feature || 'none');
        console.log('');
        console.log(chalk.gray('Use'), chalk.white('claude-ops code checkpoint'), chalk.gray('to save progress'));
        console.log(chalk.gray('Use'), chalk.white('claude-ops code resume ' + session.id), chalk.gray('to resume later'));

        return session;
    } catch (error) {
        spinner.fail(chalk.red('Failed to start session'));
        console.error(chalk.red(error.message));
        process.exit(1);
    }
}

/**
 * Run a Claude Code session (interactive or with prompt)
 */
async function run(prompt, options) {
    const sessionManager = getSessionManager();

    // Create or use existing session
    let session = sessionManager.getCurrentSession();
    if (!session) {
        session = sessionManager.createSession({
            type: 'claude-code',
            director: options.director || null,
            feature: options.feature || null,
            context: {
                prompt: prompt || null,
                model: options.model || 'default',
                workdir: process.cwd()
            }
        });
    }

    console.log(chalk.cyan('Claude Code Session:'), session.id);
    console.log('');

    if (prompt) {
        sessionManager.logProgress('prompt_received', { prompt });
        console.log(chalk.yellow('Prompt:'), prompt);
        console.log('');

        // In real implementation, this would invoke claude-code
        // For now, we just log the intent
        console.log(chalk.gray('To execute this prompt, run:'));
        console.log(chalk.white(`  npx claude-code "${prompt}"`));
    } else {
        console.log(chalk.gray('Interactive mode - session tracking active'));
        console.log(chalk.gray('Run claude-code commands as usual, checkpoints will be tracked'));
    }

    sessionManager.logProgress('session_started', { interactive: !prompt });
}

/**
 * Resume an existing session
 */
async function resume(sessionId, options) {
    const spinner = ora('Resuming session...').start();
    const sessionManager = getSessionManager();

    try {
        const session = sessionManager.resumeSession(sessionId);

        if (!session) {
            spinner.fail(chalk.red('Session not found'));
            console.log(chalk.gray('Use'), chalk.white('claude-ops code sessions'), chalk.gray('to list available sessions'));
            process.exit(1);
        }

        spinner.succeed(chalk.green('Session resumed'));
        console.log('');
        console.log(chalk.cyan('Session ID:'), session.id);
        console.log(chalk.cyan('Type:'), session.type);
        console.log(chalk.cyan('Director:'), session.director || 'none');
        console.log(chalk.cyan('Feature:'), session.feature || 'none');
        console.log(chalk.cyan('Created:'), new Date(session.createdAt).toLocaleString());
        console.log(chalk.cyan('Checkpoints:'), session.checkpoints.length);

        if (session.checkpoints.length > 0) {
            console.log('');
            console.log(chalk.yellow('Recent Checkpoints:'));
            const recent = session.checkpoints.slice(-3);
            for (const cp of recent) {
                console.log(chalk.gray(`  - ${cp.name}: ${cp.notes || 'No notes'}`));
            }
        }

        if (options.checkpoint) {
            const checkpoint = session.checkpoints.find(c => c.id === options.checkpoint);
            if (checkpoint) {
                sessionManager.restoreCheckpoint(options.checkpoint);
                console.log('');
                console.log(chalk.green('Restored from checkpoint:'), checkpoint.name);
            }
        }

        return session;
    } catch (error) {
        spinner.fail(chalk.red('Failed to resume session'));
        console.error(chalk.red(error.message));
        process.exit(1);
    }
}

/**
 * List all sessions
 */
async function sessions(options) {
    const sessionManager = getSessionManager();
    const allSessions = sessionManager.listSessions({
        status: options.status || null,
        director: options.director || null
    });

    if (allSessions.length === 0) {
        console.log(chalk.yellow('No sessions found'));
        return;
    }

    console.log(chalk.cyan.bold('Claude Code Sessions'));
    console.log(chalk.gray('─'.repeat(60)));
    console.log('');

    for (const session of allSessions) {
        const statusColor = {
            active: chalk.green,
            paused: chalk.yellow,
            completed: chalk.blue
        }[session.status] || chalk.gray;

        console.log(
            chalk.white(session.id.substring(0, 8)),
            statusColor(`[${session.status}]`),
            chalk.gray(session.type),
            session.director ? chalk.cyan(`@${session.director}`) : ''
        );
        console.log(
            chalk.gray('  Created:'),
            new Date(session.createdAt).toLocaleString(),
            chalk.gray('| Checkpoints:'),
            session.checkpoints.length
        );

        if (options.verbose && session.context?.prompt) {
            console.log(chalk.gray('  Prompt:'), session.context.prompt.substring(0, 50) + '...');
        }
        console.log('');
    }

    // Stats
    const stats = sessionManager.getStats();
    console.log(chalk.gray('─'.repeat(60)));
    console.log(
        chalk.gray('Total:'), stats.total,
        chalk.gray('| Active:'), chalk.green(stats.active),
        chalk.gray('| Completed:'), chalk.blue(stats.completed),
        chalk.gray('| Paused:'), chalk.yellow(stats.paused)
    );
}

/**
 * Create a checkpoint
 */
async function checkpoint(options) {
    const spinner = ora('Creating checkpoint...').start();
    const sessionManager = getSessionManager();

    try {
        // If no current session, find most recent active one
        let session = sessionManager.getCurrentSession();
        if (!session) {
            const activeSessions = sessionManager.listSessions({ status: 'active' });
            if (activeSessions.length > 0) {
                session = sessionManager.resumeSession(activeSessions[0].id);
            }
        }

        if (!session) {
            spinner.fail(chalk.red('No active session'));
            console.log(chalk.gray('Start a session with'), chalk.white('claude-ops code start'));
            process.exit(1);
        }

        const cp = sessionManager.createCheckpoint({
            name: options.name || null,
            notes: options.notes || '',
            state: options.state ? JSON.parse(options.state) : {},
            files: options.files ? options.files.split(',') : []
        });

        spinner.succeed(chalk.green('Checkpoint created'));
        console.log('');
        console.log(chalk.cyan('Checkpoint ID:'), cp.id);
        console.log(chalk.cyan('Name:'), cp.name);
        console.log(chalk.cyan('Session:'), session.id);

        if (cp.notes) {
            console.log(chalk.cyan('Notes:'), cp.notes);
        }

        return cp;
    } catch (error) {
        spinner.fail(chalk.red('Failed to create checkpoint'));
        console.error(chalk.red(error.message));
        process.exit(1);
    }
}

/**
 * Complete current session
 */
async function complete(options) {
    const spinner = ora('Completing session...').start();
    const sessionManager = getSessionManager();

    try {
        let session = sessionManager.getCurrentSession();
        if (!session && options.session) {
            session = sessionManager.resumeSession(options.session);
        }

        if (!session) {
            spinner.fail(chalk.red('No active session'));
            process.exit(1);
        }

        const completed = sessionManager.completeSession({
            outcome: options.outcome || 'success',
            notes: options.notes || ''
        });

        spinner.succeed(chalk.green('Session completed'));
        console.log('');
        console.log(chalk.cyan('Session ID:'), completed.id);
        console.log(chalk.cyan('Duration:'), calculateDuration(completed.createdAt, completed.completedAt));
        console.log(chalk.cyan('Checkpoints:'), completed.checkpoints.length);
        console.log(chalk.cyan('Progress entries:'), completed.progress.length);

        return completed;
    } catch (error) {
        spinner.fail(chalk.red('Failed to complete session'));
        console.error(chalk.red(error.message));
        process.exit(1);
    }
}

/**
 * Calculate duration between two timestamps
 */
function calculateDuration(start, end) {
    const ms = new Date(end) - new Date(start);
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
        return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
}

module.exports = {
    start,
    run,
    resume,
    sessions,
    checkpoint,
    complete
};
