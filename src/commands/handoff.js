const chalk = require('chalk');
const fs = require('fs').promises;
const path = require('path');
const { validateInput } = require('../lib/security-loader');

/**
 * Handoff command - Create validated director handoffs
 */
async function handoffCommand(from, to, context, options) {
    console.log(chalk.cyan.bold('\n🤝 Creating Director Handoff\n'));

    // WASM Security: Validate directors
    const fromValidation = await validateInput(from, 'director');
    const toValidation = await validateInput(to, 'director');
    const contextValidation = await validateInput(context, 'handoff_context');

    if (!fromValidation.safe) {
        console.error(chalk.red(`❌ Invalid source director: ${from}`));
        process.exit(1);
    }

    if (!toValidation.safe) {
        console.error(chalk.red(`❌ Invalid target director: ${to}`));
        process.exit(1);
    }

    if (!contextValidation.safe) {
        console.error(chalk.red(`❌ Security Error: ${contextValidation.reason}`));
        process.exit(1);
    }

    // Create handoff entry
    const handoff = {
        timestamp: new Date().toISOString(),
        from,
        to,
        context: contextValidation.sanitized || context,
        priority: options.priority,
        status: 'pending'
    };

    console.log(chalk.gray(`From: ${chalk.yellow(from)}`));
    console.log(chalk.gray(`To: ${chalk.yellow(to)}`));
    console.log(chalk.gray(`Context: ${context}`));
    console.log(chalk.gray(`Priority: ${options.priority}\n`));

    try {
        // Write to decision log
        const logPath = path.join(process.cwd(), '.claude', 'memory-bank', 'decision_log');
        await fs.mkdir(logPath, { recursive: true });

        const filename = `handoff_${from}_${to}_${Date.now()}.json`;
        await fs.writeFile(
            path.join(logPath, filename),
            JSON.stringify(handoff, null, 2)
        );

        console.log(chalk.green(`✓ Handoff created: ${filename}\n`));
        console.log(chalk.cyan('Next: Director should acknowledge handoff'));

    } catch (error) {
        console.error(chalk.red(`❌ Handoff failed: ${error.message}`));
        process.exit(1);
    }
}

module.exports = handoffCommand;
