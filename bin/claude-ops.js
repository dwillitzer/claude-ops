#!/usr/bin/env node

/**
 * Claude-Ops CLI v2.0
 * Director-based multi-agent orchestration with WASM security,
 * long-running agent support, and Maritime Philosophy compliance
 */

const { program } = require('commander');
const chalk = require('chalk');

// Command modules
const initCommand = require('../src/commands/init');
const spawnCommand = require('../src/commands/spawn');
const statusCommand = require('../src/commands/status');
const handoffCommand = require('../src/commands/handoff');
const codeCommand = require('../src/commands/code');
const featureCommand = require('../src/commands/feature');
const progressCommand = require('../src/commands/progress');
const validateCommand = require('../src/commands/validate');
const hiveCommand = require('../src/commands/hive');

// ASCII art logo
const logo = `
${chalk.cyan('╔═══════════════════════════════════════════════════╗')}
${chalk.cyan('║')}  ${chalk.bold.white('Claude-Ops CLI')} ${chalk.gray('v2.0.0')}                        ${chalk.cyan('║')}
${chalk.cyan('║')}  ${chalk.gray('Director-based Multi-Agent Orchestration')}      ${chalk.cyan('║')}
${chalk.cyan('║')}  ${chalk.blue('🏠 Lighthouse')} ${chalk.blue('🧭 Navigator')} ${chalk.blue('⭐ Constellation')}  ${chalk.cyan('║')}
${chalk.cyan('╚═══════════════════════════════════════════════════╝')}
`;

program
    .name('claude-ops')
    .description('Director-based multi-agent orchestration CLI with Maritime Philosophy')
    .version('2.0.0')
    .addHelpText('before', logo);

// ============================================================================
// ORIGINAL COMMANDS (v1.0)
// ============================================================================

// Init command
program
    .command('init')
    .description('Initialize claude-ops in a directory')
    .option('-s, --scope <type>', 'Scope: project (default), user, or global', 'project')
    .option('-p, --path <path>', 'Custom path for global scope')
    .option('-i, --interactive', 'Interactive setup wizard', false)
    .option('--directors <list>', 'Comma-separated list of directors to include', 'all')
    .option('--minimal', 'Minimal setup (no ReasoningBank, no hive-mind)', false)
    .action(initCommand);

// Spawn command
program
    .command('spawn <target>')
    .description('Spawn directors or teams')
    .option('-t, --type <type>', 'Queenbee type: strategic, tactical, adaptive')
    .option('-w, --workers <n>', 'Max workers', '8')
    .option('-c, --consensus <type>', 'Consensus algorithm: majority, weighted, byzantine', 'majority')
    .option('--encryption', 'Enable encrypted communication', false)
    .action(spawnCommand);

// Status command
program
    .command('status')
    .description('Show status of directors and swarms')
    .option('-v, --verbose', 'Verbose output', false)
    .action(statusCommand);

// Handoff command
program
    .command('handoff <from> <to> <context>')
    .description('Create director handoff')
    .option('-p, --priority <level>', 'Priority: low, normal, high', 'normal')
    .action(handoffCommand);

// ============================================================================
// CLAUDE CODE INTEGRATION COMMANDS (v2.0)
// ============================================================================

const codeCmd = program
    .command('code')
    .description('Claude Code session management');

codeCmd
    .command('start')
    .description('Start a new Claude Code session')
    .option('-d, --director <name>', 'Assign to director')
    .option('-f, --feature <id>', 'Associate with feature')
    .option('-m, --model <name>', 'Model to use')
    .option('-p, --prompt <text>', 'Initial prompt')
    .action(codeCommand.start);

codeCmd
    .command('run [prompt]')
    .description('Run Claude Code with session tracking')
    .option('-d, --director <name>', 'Assign to director')
    .option('-f, --feature <id>', 'Associate with feature')
    .option('-m, --model <name>', 'Model to use')
    .action(codeCommand.run);

codeCmd
    .command('resume <sessionId>')
    .description('Resume a previous session')
    .option('-c, --checkpoint <id>', 'Restore from checkpoint')
    .action(codeCommand.resume);

codeCmd
    .command('sessions')
    .description('List all sessions')
    .option('-s, --status <status>', 'Filter by status')
    .option('-d, --director <name>', 'Filter by director')
    .option('-v, --verbose', 'Show more details')
    .action(codeCommand.sessions);

codeCmd
    .command('checkpoint')
    .description('Create checkpoint in current session')
    .option('-n, --name <name>', 'Checkpoint name')
    .option('--notes <text>', 'Checkpoint notes')
    .option('--state <json>', 'State to save (JSON)')
    .option('--files <list>', 'Files to track (comma-separated)')
    .action(codeCommand.checkpoint);

codeCmd
    .command('complete')
    .description('Complete current session')
    .option('-s, --session <id>', 'Session ID')
    .option('-o, --outcome <outcome>', 'Outcome: success, partial, failed')
    .option('--notes <text>', 'Completion notes')
    .action(codeCommand.complete);

// ============================================================================
// FEATURE TRACKING COMMANDS (v2.0)
// ============================================================================

const featureCmd = program
    .command('feature')
    .description('Feature tracking with 7-gate validation');

featureCmd
    .command('add <name>')
    .description('Add a new feature')
    .option('-d, --description <text>', 'Feature description')
    .option('--director <name>', 'Assigned director')
    .option('-p, --priority <level>', 'Priority: low, normal, high, critical')
    .option('--dependencies <list>', 'Dependencies (comma-separated)')
    .option('-l, --list <name>', 'Feature list name', 'active')
    .action(featureCommand.add);

featureCmd
    .command('update <featureId>')
    .description('Update a feature')
    .option('-s, --status <status>', 'Status: pending, in_progress, blocked, validating, completed')
    .option('-d, --description <text>', 'Update description')
    .option('--director <name>', 'Reassign director')
    .option('-p, --priority <level>', 'Update priority')
    .option('--notes <text>', 'Add progress note')
    .option('-l, --list <name>', 'Feature list name', 'active')
    .action(featureCommand.update);

featureCmd
    .command('list')
    .description('List all features')
    .option('-s, --status <status>', 'Filter by status')
    .option('-d, --director <name>', 'Filter by director')
    .option('-l, --list <name>', 'Feature list name', 'active')
    .action(featureCommand.list);

featureCmd
    .command('show <featureId>')
    .description('Show feature details')
    .option('-l, --list <name>', 'Feature list name', 'active')
    .option('-v, --verbose', 'Show progress history')
    .action(featureCommand.show);

featureCmd
    .command('validate <featureId>')
    .description('Validate feature through quality gates')
    .option('-g, --gate <name>', 'Specific gate to validate')
    .option('-r, --result <result>', 'Validation result: passed, failed')
    .option('--validator <name>', 'Validator identifier')
    .option('--notes <text>', 'Validation notes')
    .option('-l, --list <name>', 'Feature list name', 'active')
    .action(featureCommand.validate);

featureCmd
    .command('complete <featureId>')
    .description('Complete a feature (requires all gates passed)')
    .option('--force', 'Force completion (CONSTITUTIONAL VIOLATION)')
    .option('--notes <text>', 'Completion notes')
    .option('-l, --list <name>', 'Feature list name', 'active')
    .action(featureCommand.complete);

// ============================================================================
// PROGRESS LOGGING COMMANDS (v2.0)
// ============================================================================

const progressCmd = program
    .command('progress')
    .description('Progress logging and tracking');

progressCmd
    .command('log <message>')
    .description('Log progress entry')
    .option('-t, --type <type>', 'Type: progress, milestone, decision, blocker, resolved, learning, handoff')
    .option('-f, --feature <id>', 'Associated feature')
    .option('-d, --director <name>', 'Associated director')
    .option('-s, --session <id>', 'Associated session')
    .option('--tags <list>', 'Tags (comma-separated)')
    .action(progressCommand.log);

progressCmd
    .command('view')
    .description('View progress log')
    .option('--date <date>', 'Date to view (YYYY-MM-DD)')
    .option('--raw', 'Show raw markdown')
    .action(progressCommand.view);

progressCmd
    .command('search <query>')
    .description('Search progress logs')
    .option('-l, --limit <n>', 'Max results')
    .action(progressCommand.search);

progressCmd
    .command('summary')
    .description('Show progress summary')
    .option('-d, --days <n>', 'Number of days', '7')
    .action(progressCommand.summary);

progressCmd
    .command('export')
    .description('Export progress logs')
    .option('--from <date>', 'Start date')
    .option('--to <date>', 'End date')
    .option('-f, --format <format>', 'Format: md, json')
    .option('-o, --output <path>', 'Output file path')
    .action(progressCommand.export);

// ============================================================================
// VALIDATION COMMANDS (v2.0)
// ============================================================================

const validateCmd = program
    .command('validate')
    .description('Constitutional and operational validation');

validateCmd
    .command('daily')
    .description('Run daily constitutional check')
    .action(validateCommand.daily);

validateCmd
    .command('weekly')
    .description('Run weekly operational validation')
    .action(validateCommand.weekly);

validateCmd
    .command('feature <featureId>')
    .description('Validate specific feature')
    .option('-g, --gate <name>', 'Specific gate')
    .option('-l, --list <name>', 'Feature list name', 'active')
    .action(validateCommand.feature);

validateCmd
    .command('compliance')
    .description('Check overall compliance status')
    .action(validateCommand.compliance);

validateCmd
    .command('report')
    .description('Generate validation report')
    .option('-o, --output <path>', 'Output file path')
    .option('-f, --format <format>', 'Format: json, md')
    .action(validateCommand.report);

// ============================================================================
// HIVE COORDINATION COMMANDS (v2.0)
// ============================================================================

const hiveCmd = program
    .command('hive')
    .description('Hive mind coordination');

hiveCmd
    .command('status')
    .description('Show hive coordination status')
    .option('-v, --verbose', 'Show blockers and details')
    .action(hiveCommand.status);

hiveCmd
    .command('sync [director]')
    .description('Sync director state')
    .option('-s, --status <status>', 'Set status: active, idle, blocked, waiting')
    .option('-t, --task <task>', 'Set current task')
    .option('-b, --blocker <text>', 'Add blocker')
    .option('--clear-blockers', 'Clear all blockers')
    .action(hiveCommand.sync);

hiveCmd
    .command('broadcast <message>')
    .description('Broadcast message to directors')
    .option('-f, --from <name>', 'Sender identifier')
    .option('-p, --priority <level>', 'Priority: low, normal, high, critical')
    .option('-t, --targets <list>', 'Target directors (comma-separated)')
    .action(hiveCommand.broadcast);

hiveCmd
    .command('consensus <topic>')
    .description('Request consensus from directors')
    .option('-d, --description <text>', 'Topic description')
    .option('-o, --options <list>', 'Vote options (comma-separated)')
    .option('--threshold <n>', 'Required votes for consensus')
    .option('--deadline <date>', 'Voting deadline')
    .action(hiveCommand.consensus);

hiveCmd
    .command('vote <requestId> <choice>')
    .description('Vote on consensus request')
    .option('-d, --director <name>', 'Voting director')
    .option('--notes <text>', 'Vote notes')
    .action(hiveCommand.vote);

hiveCmd
    .command('metrics')
    .description('Show hive metrics')
    .action(hiveCommand.metrics);

hiveCmd
    .command('init')
    .description('Initialize hive state')
    .option('--clear-all', 'Clear all history')
    .action(hiveCommand.init);

// ============================================================================
// Parse and execute
// ============================================================================

program.parse(process.argv);

// Show help if no command
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
