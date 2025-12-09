const chalk = require('chalk');
const { exec } = require('child_process');
const { promisify } = require('util');
const { validateInput } = require('../lib/security-loader');

const execAsync = promisify(exec);

/**
 * Spawn command - Spawn directors with WASM security validation
 */
async function spawnCommand(target, options) {
    console.log(chalk.cyan.bold(`\n🐝 Spawning: ${target}\n`));

    // WASM Security: Validate spawn target
    const targetValidation = await validateInput(target, 'director');
    if (!targetValidation.safe) {
        console.error(chalk.red(`❌ Security Error: ${targetValidation.reason}`));
        process.exit(1);
    }

    // Map targets to directors
    const directorMap = {
        'all': ['architecture', 'business', 'design', 'engineering', 'research', 'documentation', 'operations', 'security'],
        'strategic': ['architecture', 'business', 'operations', 'security'],
        'tactical': ['design', 'engineering', 'documentation'],
        'adaptive': ['research']
    };

    const directors = directorMap[target] || [target];

    // WASM Security: Validate director type
    if (options.type) {
        const typeValidation = await validateInput(options.type, 'queenbee_type');
        if (!typeValidation.safe) {
            console.error(chalk.red(`❌ Invalid queenbee type: ${options.type}`));
            process.exit(1);
        }
    }

    console.log(chalk.gray(`Directors: ${directors.join(', ')}`));
    console.log(chalk.gray(`Type: ${options.type || 'auto'}`));
    console.log(chalk.gray(`Workers: ${options.workers}`));
    console.log(chalk.gray(`Consensus: ${options.consensus}\n`));

    try {
        for (const director of directors) {
            const queenbeeType = options.type || getDefaultQueenbeeType(director);
            const consensus = options.consensus || getDefaultConsensus(director);

            console.log(chalk.yellow(`⏳ Spawning ${director}...`));

            // Build claude-flow command
            const cmd = buildSpawnCommand(director, {
                queenbeeType,
                workers: options.workers,
                consensus,
                encryption: options.encryption
            });

            // Execute spawn
            await execAsync(cmd);

            console.log(chalk.green(`✓ ${director} spawned\n`));
        }

        console.log(chalk.green.bold('✅ All directors spawned successfully!\n'));
        console.log(chalk.cyan('Next: claude-ops status'));

    } catch (error) {
        console.error(chalk.red(`❌ Spawn failed: ${error.message}`));
        process.exit(1);
    }
}

function getDefaultQueenbeeType(director) {
    const strategic = ['architecture', 'business', 'operations', 'security'];
    const adaptive = ['research'];

    if (strategic.includes(director)) return 'strategic';
    if (adaptive.includes(director)) return 'adaptive';
    return 'tactical';
}

function getDefaultConsensus(director) {
    if (director === 'business') return 'weighted';
    if (['operations', 'security'].includes(director)) return 'byzantine';
    return 'majority';
}

function buildSpawnCommand(director, options) {
    const parts = [
        'npx claude-flow@alpha hive-mind spawn',
        `"${director} director"`,
        `--queen-type ${options.queenbeeType}`,
        `--max-workers ${options.workers}`,
        `--consensus ${options.consensus}`,
        `--config .claude/agents/${director}-director.md`
    ];

    if (options.encryption) {
        parts.push('--encryption');
    }

    return parts.join(' ');
}

module.exports = spawnCommand;
