#!/usr/bin/env node

/**
 * Claude-Ops CLI
 * Director-based multi-agent orchestration with WASM security
 */

const { program } = require('commander');
const chalk = require('chalk');
const initCommand = require('../src/commands/init');
const spawnCommand = require('../src/commands/spawn');
const statusCommand = require('../src/commands/status');
const handoffCommand = require('../src/commands/handoff');

// ASCII art logo
const logo = `
${chalk.cyan('╔═══════════════════════════════════════╗')}
${chalk.cyan('║')}  ${chalk.bold.white('Claude-Ops CLI')}                     ${chalk.cyan('║')}
${chalk.cyan('║')}  ${chalk.gray('Director-based Multi-Agent System')} ${chalk.cyan('║')}
${chalk.cyan('╚═══════════════════════════════════════╝')}
`;

program
    .name('claude-ops')
    .description('Director-based multi-agent orchestration CLI')
    .version('0.1.0')
    .addHelpText('before', logo);

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

// Parse and execute
program.parse(process.argv);

// Show help if no command
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
