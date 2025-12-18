const chalk = require('chalk');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

/**
 * Status command - Show director and swarm status
 */
async function statusCommand(options) {
    console.log(chalk.cyan.bold('\n📊 Claude-Ops Status\n'));

    try {
        // Get hive-mind status
        const { stdout } = await execAsync('npx claude-flow@alpha hive-mind status');

        if (options.verbose) {
            console.log(stdout);
        } else {
            // Parse and show summary
            console.log(chalk.gray(stdout));
        }

        // Show quick actions
        console.log(chalk.cyan('\n🎯 Quick Actions:'));
        console.log(chalk.white('   claude-ops spawn <director>    # Spawn specific director'));
        console.log(chalk.white('   claude-ops handoff <from> <to> # Create handoff'));
        console.log(chalk.white('   npx claude-flow hive-mind metrics # Detailed metrics\n'));

    } catch (error) {
        console.log(chalk.yellow('⚠️  No active hive-mind sessions'));
        console.log(chalk.gray('\nStart with: claude-ops spawn all\n'));
    }
}

module.exports = statusCommand;
