const chalk = require('chalk');
const inquirer = require('inquirer');
const ora = require('ora');
const fs = require('fs').promises;
const path = require('path');
const { validateInput } = require('../lib/security-loader');
const TemplateManager = require('../lib/template-manager');

/**
 * Init command - Initialize claude-ops structure
 */
async function initCommand(options) {
    console.log(chalk.cyan.bold('\n🚀 Claude-Ops Initialization\n'));

    let targetPath;
    let scope = options.scope;
    let directors = options.directors;
    let minimal = options.minimal;

    // Interactive mode
    if (options.interactive) {
        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'scope',
                message: 'Where should claude-ops be initialized?',
                choices: [
                    { name: 'Current directory (project-specific)', value: 'project' },
                    { name: 'User home ~/.claude (user-wide)', value: 'user' },
                    { name: 'Custom path (global)', value: 'global' }
                ],
                default: 'project'
            },
            {
                type: 'input',
                name: 'customPath',
                message: 'Enter custom path:',
                when: (answers) => answers.scope === 'global',
                validate: (input) => input.length > 0 || 'Path cannot be empty'
            },
            {
                type: 'checkbox',
                name: 'directors',
                message: 'Select directors to initialize:',
                choices: [
                    { name: 'Architecture Director (Strategic)', value: 'architecture', checked: true },
                    { name: 'Business Director (Strategic)', value: 'business', checked: true },
                    { name: 'Design Director (Tactical)', value: 'design', checked: true },
                    { name: 'Engineering Director (Tactical)', value: 'engineering', checked: true },
                    { name: 'Research Director (Adaptive)', value: 'research', checked: true },
                    { name: 'Documentation Director (Tactical)', value: 'documentation', checked: true },
                    { name: 'Operations Director (Strategic)', value: 'operations', checked: true },
                    { name: 'Security Director (Strategic)', value: 'security', checked: true }
                ]
            },
            {
                type: 'confirm',
                name: 'reasoningBank',
                message: 'Initialize ReasoningBank (learning memory)?',
                default: true
            },
            {
                type: 'confirm',
                name: 'hiveMind',
                message: 'Initialize Hive-Mind system?',
                default: true
            }
        ]);

        scope = answers.scope;
        directors = answers.directors.join(',');
        minimal = !answers.reasoningBank && !answers.hiveMind;

        if (answers.customPath) {
            options.path = answers.customPath;
        }
    }

    // Determine target path
    switch (scope) {
        case 'user':
            targetPath = path.join(process.env.HOME || process.env.USERPROFILE, '.claude');
            break;
        case 'global':
            if (!options.path) {
                console.error(chalk.red('❌ Error: --path required for global scope'));
                process.exit(1);
            }
            targetPath = options.path;
            break;
        case 'project':
        default:
            targetPath = path.join(process.cwd(), '.claude');
            break;
    }

    // WASM Security: Validate target path
    const pathValidation = await validateInput(targetPath, 'path');
    if (!pathValidation.safe) {
        console.error(chalk.red(`❌ Security Error: ${pathValidation.reason}`));
        process.exit(1);
    }

    console.log(chalk.gray(`Target: ${targetPath}\n`));

    const spinner = ora('Initializing claude-ops...').start();

    try {
        // Create directory structure
        await fs.mkdir(targetPath, { recursive: true });
        await fs.mkdir(path.join(targetPath, 'agents'), { recursive: true });
        await fs.mkdir(path.join(targetPath, 'teams'), { recursive: true });
        await fs.mkdir(path.join(targetPath, 'memory-bank'), { recursive: true });

        spinner.text = 'Copying templates...';

        // Copy templates
        const templateManager = new TemplateManager();
        await templateManager.copyTemplates(targetPath, {
            directors: directors === 'all' ? 'all' : directors.split(','),
            minimal
        });

        spinner.succeed(chalk.green('✓ Claude-ops initialized successfully!'));

        // Summary
        console.log(chalk.cyan('\n📋 Summary:'));
        console.log(chalk.gray(`   Location: ${targetPath}`));
        console.log(chalk.gray(`   Scope: ${scope}`));
        console.log(chalk.gray(`   Directors: ${directors === 'all' ? '8 directors' : directors}`));
        console.log(chalk.gray(`   Mode: ${minimal ? 'Minimal' : 'Full'}`));

        console.log(chalk.cyan('\n🎯 Next steps:'));
        console.log(chalk.white('   1. cd into your project directory'));
        console.log(chalk.white('   2. claude-ops spawn all'));
        console.log(chalk.white('   3. claude-ops status\n'));

    } catch (error) {
        spinner.fail(chalk.red('✗ Initialization failed'));
        console.error(chalk.red(`Error: ${error.message}`));
        process.exit(1);
    }
}

module.exports = initCommand;
