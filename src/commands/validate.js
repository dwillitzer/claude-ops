/**
 * Validation Commands
 * Constitutional compliance and operational validation
 */

const chalk = require('chalk');
const ora = require('ora');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Validation directories
const CONSTITUTION_PATH = 'memory-bank/constitutional/CONSTITUTION.md';
const EXECUTION_POLICY_PATH = 'memory-bank/core/EXECUTION_POLICY.md';
const DIRECTORS_DIR = 'directors';
const TEAMS_DIR = 'teams';

/**
 * Run daily constitutional check
 */
async function daily(options) {
    const spinner = ora('Running daily constitutional check...').start();
    const results = {
        passed: [],
        warnings: [],
        failed: [],
        timestamp: new Date().toISOString()
    };

    try {
        // Check 1: Constitution exists and is readable
        const constitutionPath = path.join(process.cwd(), CONSTITUTION_PATH);
        if (fs.existsSync(constitutionPath)) {
            const content = fs.readFileSync(constitutionPath, 'utf8');
            if (content.includes('ARTICLE I') && content.includes('ARTICLE VIII')) {
                results.passed.push('Constitution file present with all articles');
            } else {
                results.warnings.push('Constitution may be incomplete (missing articles)');
            }
        } else {
            results.failed.push('Constitution file not found');
        }

        // Check 2: Execution Policy exists
        const execPolicyPath = path.join(process.cwd(), EXECUTION_POLICY_PATH);
        if (fs.existsSync(execPolicyPath)) {
            const content = fs.readFileSync(execPolicyPath, 'utf8');
            if (content.includes('QUALITY GATES')) {
                results.passed.push('Execution Policy with Quality Gates present');
            } else {
                results.warnings.push('Execution Policy missing Quality Gates section');
            }
        } else {
            results.failed.push('Execution Policy not found');
        }

        // Check 3: Director files exist (check both 'directors/' and 'agents/' for compatibility)
        const directorsPath = path.join(process.cwd(), DIRECTORS_DIR);
        const agentsPath = path.join(process.cwd(), 'agents');
        const actualPath = fs.existsSync(directorsPath) ? directorsPath :
                           fs.existsSync(agentsPath) ? agentsPath : null;

        if (actualPath) {
            const directors = fs.readdirSync(actualPath).filter(f => f.endsWith('.md'));
            const requiredDirectors = ['architecture', 'business', 'design', 'engineering', 'research', 'documentation', 'operations', 'security'];

            for (const req of requiredDirectors) {
                if (directors.some(d => d.includes(req))) {
                    results.passed.push(`Director present: ${req}`);
                } else {
                    results.failed.push(`Missing director: ${req}`);
                }
            }
        } else {
            results.failed.push('Directors directory not found');
        }

        // Check 4: Validation team exists
        const validationTeamPath = path.join(process.cwd(), TEAMS_DIR, 'validation');
        if (fs.existsSync(validationTeamPath)) {
            const validators = fs.readdirSync(validationTeamPath);
            if (validators.length >= 3) {
                results.passed.push('Validation team present');
            } else {
                results.warnings.push('Validation team incomplete');
            }
        } else {
            results.warnings.push('Validation team directory not found');
        }

        // Check 5: Active context exists (Lighthouse principle)
        const activeContextPath = path.join(process.cwd(), 'memory-bank/active/activeContext.md');
        if (fs.existsSync(activeContextPath)) {
            results.passed.push('Active context present (Lighthouse compliance)');
        } else {
            results.warnings.push('No active context - Lighthouse principle may be violated');
        }

        spinner.stop();

        // Report results
        console.log(chalk.cyan.bold('Daily Constitutional Check'));
        console.log(chalk.gray('═'.repeat(50)));
        console.log('');

        if (results.passed.length > 0) {
            console.log(chalk.green.bold('✓ Passed:'));
            for (const item of results.passed) {
                console.log(chalk.green(`  ✓ ${item}`));
            }
            console.log('');
        }

        if (results.warnings.length > 0) {
            console.log(chalk.yellow.bold('⚠ Warnings:'));
            for (const item of results.warnings) {
                console.log(chalk.yellow(`  ⚠ ${item}`));
            }
            console.log('');
        }

        if (results.failed.length > 0) {
            console.log(chalk.red.bold('✗ Failed:'));
            for (const item of results.failed) {
                console.log(chalk.red(`  ✗ ${item}`));
            }
            console.log('');
        }

        // Summary
        console.log(chalk.gray('─'.repeat(50)));
        const total = results.passed.length + results.warnings.length + results.failed.length;
        console.log(
            chalk.white('Summary:'),
            chalk.green(`${results.passed.length} passed`),
            chalk.yellow(`${results.warnings.length} warnings`),
            chalk.red(`${results.failed.length} failed`)
        );

        if (results.failed.length === 0) {
            console.log(chalk.green.bold('\n✓ Constitutional compliance: PASS'));
        } else {
            console.log(chalk.red.bold('\n✗ Constitutional compliance: FAIL'));
            process.exit(1);
        }

        return results;
    } catch (error) {
        spinner.fail(chalk.red('Validation failed'));
        console.error(chalk.red(error.message));
        process.exit(1);
    }
}

/**
 * Run weekly operational validation
 */
async function weekly(options) {
    const spinner = ora('Running weekly operational validation...').start();
    const results = {
        maritime: { lighthouse: [], navigator: [], constellation: [] },
        quality: [],
        timestamp: new Date().toISOString()
    };

    try {
        // Maritime Philosophy checks

        // Lighthouse: Check for session orientation patterns
        const progressDir = path.join(process.cwd(), 'memory-bank/progress_log');
        if (fs.existsSync(progressDir)) {
            const logs = fs.readdirSync(progressDir).filter(f => f.endsWith('.md'));
            results.maritime.lighthouse.push(`Progress logs present: ${logs.length} files`);
        } else {
            results.maritime.lighthouse.push('⚠ No progress logs found');
        }

        // Navigator: Check for learnings capture
        const learningsDir = path.join(process.cwd(), 'memory-bank/learnings');
        if (fs.existsSync(learningsDir)) {
            const learnings = fs.readdirSync(learningsDir);
            results.maritime.navigator.push(`Learnings captured: ${learnings.length} files`);
        } else {
            results.maritime.navigator.push('⚠ No learnings directory');
        }

        // Constellation: Check for feature tracking
        const featureDir = path.join(process.cwd(), 'memory-bank/feature_lists');
        if (fs.existsSync(featureDir)) {
            const features = fs.readdirSync(featureDir).filter(f => f.endsWith('.json'));
            results.maritime.constellation.push(`Feature lists present: ${features.length} files`);
        } else {
            results.maritime.constellation.push('⚠ No feature tracking');
        }

        // Hive coordination check
        const hiveProgressPath = path.join(process.cwd(), 'memory-bank/active/hive-progress.json');
        if (fs.existsSync(hiveProgressPath)) {
            const hiveData = JSON.parse(fs.readFileSync(hiveProgressPath, 'utf8'));
            results.maritime.constellation.push(`Hive coordination active: ${Object.keys(hiveData.directors || {}).length} directors`);
        }

        // Quality gates check
        const featureListPath = path.join(process.cwd(), 'memory-bank/feature_lists/active.json');
        if (fs.existsSync(featureListPath)) {
            const featureList = JSON.parse(fs.readFileSync(featureListPath, 'utf8'));
            const completed = featureList.features?.filter(f => f.status === 'completed') || [];
            const properlyValidated = completed.filter(f =>
                f.validation?.gates?.filter(g => g.status === 'passed').length === 7
            );
            results.quality.push(`Features completed: ${completed.length}`);
            results.quality.push(`Properly validated: ${properlyValidated.length}`);

            if (completed.length > 0 && properlyValidated.length < completed.length) {
                results.quality.push(`⚠ ${completed.length - properlyValidated.length} features completed without full validation`);
            }
        }

        spinner.stop();

        // Report
        console.log(chalk.cyan.bold('Weekly Operational Validation'));
        console.log(chalk.gray('═'.repeat(60)));
        console.log('');

        console.log(chalk.white.bold('Maritime Philosophy Compliance:'));
        console.log('');

        console.log(chalk.yellow('🏠 Lighthouse (Orientation):'));
        for (const item of results.maritime.lighthouse) {
            console.log(chalk.gray(`  ${item}`));
        }
        console.log('');

        console.log(chalk.blue('🧭 Navigator (Learning):'));
        for (const item of results.maritime.navigator) {
            console.log(chalk.gray(`  ${item}`));
        }
        console.log('');

        console.log(chalk.magenta('⭐ Constellation (Coordination):'));
        for (const item of results.maritime.constellation) {
            console.log(chalk.gray(`  ${item}`));
        }
        console.log('');

        console.log(chalk.white.bold('Quality Gates:'));
        for (const item of results.quality) {
            console.log(chalk.gray(`  ${item}`));
        }

        console.log('');
        console.log(chalk.gray('─'.repeat(60)));
        console.log(chalk.green('✓ Weekly validation complete'));

        return results;
    } catch (error) {
        spinner.fail(chalk.red('Validation failed'));
        console.error(chalk.red(error.message));
        process.exit(1);
    }
}

/**
 * Validate a specific feature
 */
async function feature(featureId, options) {
    // Delegate to feature validate command
    const featureCmd = require('./feature');
    return featureCmd.validate(featureId, options);
}

/**
 * Check compliance status
 */
async function compliance(options) {
    console.log(chalk.cyan.bold('Compliance Report'));
    console.log(chalk.gray('═'.repeat(60)));
    console.log('');

    const checks = [
        { name: 'Constitution Present', path: CONSTITUTION_PATH },
        { name: 'Execution Policy Present', path: EXECUTION_POLICY_PATH },
        { name: 'Directors Configured', path: DIRECTORS_DIR, altPath: 'agents', isDir: true },
        { name: 'Validation Team Present', path: 'teams/validation', isDir: true },
        { name: 'Memory Bank Active', path: 'memory-bank/active', isDir: true },
        { name: 'Feature Tracking', path: 'memory-bank/feature_lists', isDir: true },
        { name: 'Progress Logging', path: 'memory-bank/progress_log', isDir: true }
    ];

    let passed = 0;
    let failed = 0;

    for (const check of checks) {
        const fullPath = path.join(process.cwd(), check.path);
        const altPath = check.altPath ? path.join(process.cwd(), check.altPath) : null;
        const exists = fs.existsSync(fullPath) || (altPath && fs.existsSync(altPath));

        if (exists) {
            console.log(chalk.green('✓'), chalk.white(check.name));
            passed++;
        } else {
            console.log(chalk.red('✗'), chalk.white(check.name));
            failed++;
        }
    }

    console.log('');
    console.log(chalk.gray('─'.repeat(60)));

    const percentage = Math.round((passed / checks.length) * 100);
    const percentColor = percentage >= 80 ? chalk.green : percentage >= 60 ? chalk.yellow : chalk.red;

    console.log(chalk.white('Compliance Score:'), percentColor(`${percentage}%`));
    console.log(chalk.gray(`${passed}/${checks.length} checks passed`));

    if (percentage < 100) {
        console.log('');
        console.log(chalk.yellow('Recommendations:'));
        if (!fs.existsSync(path.join(process.cwd(), 'teams/validation'))) {
            console.log(chalk.gray('  - Create validation team directory'));
        }
        if (!fs.existsSync(path.join(process.cwd(), 'memory-bank/feature_lists'))) {
            console.log(chalk.gray('  - Initialize feature tracking'));
        }
    }

    return { passed, failed, percentage };
}

/**
 * Generate validation report
 */
async function report(options) {
    const spinner = ora('Generating validation report...').start();

    try {
        // Run all validations
        const dailyResults = await daily({ quiet: true }).catch(() => null);
        const weeklyResults = await weekly({ quiet: true }).catch(() => null);
        const complianceResults = await compliance({ quiet: true }).catch(() => null);

        spinner.stop();

        const report = {
            generated: new Date().toISOString(),
            daily: dailyResults,
            weekly: weeklyResults,
            compliance: complianceResults
        };

        if (options.output) {
            const format = options.format || 'json';
            const outputPath = options.output;

            if (format === 'json') {
                fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
            } else {
                // Markdown format
                let md = `# Validation Report\n\nGenerated: ${report.generated}\n\n`;
                md += `## Daily Check\n${JSON.stringify(dailyResults, null, 2)}\n\n`;
                md += `## Weekly Check\n${JSON.stringify(weeklyResults, null, 2)}\n\n`;
                md += `## Compliance\n${JSON.stringify(complianceResults, null, 2)}\n`;
                fs.writeFileSync(outputPath, md);
            }

            console.log(chalk.green(`Report saved to ${outputPath}`));
        } else {
            console.log(JSON.stringify(report, null, 2));
        }

        return report;
    } catch (error) {
        spinner.fail(chalk.red('Report generation failed'));
        console.error(chalk.red(error.message));
        process.exit(1);
    }
}

module.exports = {
    daily,
    weekly,
    feature,
    compliance,
    report
};
