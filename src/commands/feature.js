/**
 * Feature Tracking Commands
 * Manages feature lifecycle with 7-gate validation pipeline
 */

const chalk = require('chalk');
const ora = require('ora');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Feature list directory
const FEATURE_DIR = 'memory-bank/feature_lists';

// 7-gate validation pipeline
const VALIDATION_GATES = [
    { id: 1, name: 'isolation', description: 'Feature Isolation Test', required: true },
    { id: 2, name: 'tests', description: 'Feature Test Execution (>80% coverage)', required: true },
    { id: 3, name: 'runtime', description: 'Runtime Validation', required: true },
    { id: 4, name: 'stubs', description: 'Stub Detection', required: true },
    { id: 5, name: 'qa', description: 'QA Validation', required: true },
    { id: 6, name: 'production', description: 'Production Validation', required: true },
    { id: 7, name: 'constitutional', description: 'Constitutional Review', required: true }
];

/**
 * Get feature list path
 */
function getFeatureListPath(listName = 'active') {
    return path.join(process.cwd(), FEATURE_DIR, `${listName}.json`);
}

/**
 * Ensure feature directory exists
 */
function ensureFeatureDir() {
    const dir = path.join(process.cwd(), FEATURE_DIR);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

/**
 * Load feature list
 */
function loadFeatureList(listName = 'active') {
    const listPath = getFeatureListPath(listName);
    if (fs.existsSync(listPath)) {
        return JSON.parse(fs.readFileSync(listPath, 'utf8'));
    }
    return {
        name: listName,
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        features: []
    };
}

/**
 * Save feature list
 */
function saveFeatureList(list) {
    ensureFeatureDir();
    list.updated = new Date().toISOString();
    const listPath = getFeatureListPath(list.name);
    fs.writeFileSync(listPath, JSON.stringify(list, null, 2));
}

/**
 * Add a new feature
 */
async function add(name, options) {
    const spinner = ora('Adding feature...').start();

    try {
        const list = loadFeatureList(options.list || 'active');

        const feature = {
            id: uuidv4(),
            name,
            description: options.description || '',
            director: options.director || null,
            priority: options.priority || 'normal',
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            validation: {
                status: 'not_started',
                gates: VALIDATION_GATES.map(g => ({
                    ...g,
                    status: 'pending',
                    passedAt: null,
                    passedBy: null,
                    notes: ''
                }))
            },
            dependencies: options.dependencies ? options.dependencies.split(',') : [],
            blockers: [],
            progress: []
        };

        list.features.push(feature);
        saveFeatureList(list);

        spinner.succeed(chalk.green('Feature added'));
        console.log('');
        console.log(chalk.cyan('Feature ID:'), feature.id);
        console.log(chalk.cyan('Name:'), feature.name);
        console.log(chalk.cyan('Priority:'), feature.priority);
        console.log(chalk.cyan('Director:'), feature.director || 'unassigned');

        return feature;
    } catch (error) {
        spinner.fail(chalk.red('Failed to add feature'));
        console.error(chalk.red(error.message));
        process.exit(1);
    }
}

/**
 * Update a feature
 */
async function update(featureId, options) {
    const spinner = ora('Updating feature...').start();

    try {
        const list = loadFeatureList(options.list || 'active');
        const feature = list.features.find(f => f.id === featureId || f.id.startsWith(featureId));

        if (!feature) {
            spinner.fail(chalk.red('Feature not found'));
            process.exit(1);
        }

        // Update allowed fields
        if (options.status) feature.status = options.status;
        if (options.description) feature.description = options.description;
        if (options.director) feature.director = options.director;
        if (options.priority) feature.priority = options.priority;
        if (options.notes) {
            feature.progress.push({
                timestamp: new Date().toISOString(),
                type: 'note',
                content: options.notes
            });
        }

        feature.updatedAt = new Date().toISOString();
        saveFeatureList(list);

        spinner.succeed(chalk.green('Feature updated'));
        console.log('');
        console.log(chalk.cyan('Feature:'), feature.name);
        console.log(chalk.cyan('Status:'), feature.status);

        return feature;
    } catch (error) {
        spinner.fail(chalk.red('Failed to update feature'));
        console.error(chalk.red(error.message));
        process.exit(1);
    }
}

/**
 * List features
 */
async function list(options) {
    const featureList = loadFeatureList(options.list || 'active');

    if (featureList.features.length === 0) {
        console.log(chalk.yellow('No features found'));
        console.log(chalk.gray('Add a feature with'), chalk.white('claude-ops feature add <name>'));
        return;
    }

    console.log(chalk.cyan.bold(`Feature List: ${featureList.name}`));
    console.log(chalk.gray('─'.repeat(70)));
    console.log('');

    // Filter by status if provided
    let features = featureList.features;
    if (options.status) {
        features = features.filter(f => f.status === options.status);
    }
    if (options.director) {
        features = features.filter(f => f.director === options.director);
    }

    // Priority order
    const priorityOrder = { critical: 0, high: 1, normal: 2, low: 3 };
    features.sort((a, b) => (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2));

    for (const feature of features) {
        const statusColor = {
            pending: chalk.gray,
            in_progress: chalk.yellow,
            blocked: chalk.red,
            validating: chalk.cyan,
            completed: chalk.green
        }[feature.status] || chalk.gray;

        const priorityColor = {
            critical: chalk.red.bold,
            high: chalk.yellow,
            normal: chalk.white,
            low: chalk.gray
        }[feature.priority] || chalk.white;

        // Gate progress
        const passedGates = feature.validation.gates.filter(g => g.status === 'passed').length;
        const gateProgress = `[${passedGates}/${VALIDATION_GATES.length}]`;

        console.log(
            chalk.white(feature.id.substring(0, 8)),
            statusColor(`[${feature.status}]`),
            priorityColor(`(${feature.priority})`),
            chalk.cyan(gateProgress)
        );
        console.log(chalk.white(`  ${feature.name}`));
        if (feature.description) {
            console.log(chalk.gray(`  ${feature.description.substring(0, 60)}${feature.description.length > 60 ? '...' : ''}`));
        }
        if (feature.director) {
            console.log(chalk.gray('  Director:'), chalk.cyan(feature.director));
        }
        console.log('');
    }

    // Summary
    const statusCounts = {};
    for (const f of featureList.features) {
        statusCounts[f.status] = (statusCounts[f.status] || 0) + 1;
    }

    console.log(chalk.gray('─'.repeat(70)));
    console.log(
        chalk.gray('Total:'), featureList.features.length,
        Object.entries(statusCounts).map(([s, c]) => `${s}: ${c}`).join(' | ')
    );
}

/**
 * Validate a feature through gates
 */
async function validate(featureId, options) {
    const spinner = ora('Running validation...').start();

    try {
        const list = loadFeatureList(options.list || 'active');
        const feature = list.features.find(f => f.id === featureId || f.id.startsWith(featureId));

        if (!feature) {
            spinner.fail(chalk.red('Feature not found'));
            process.exit(1);
        }

        // If specific gate specified
        if (options.gate) {
            const gate = feature.validation.gates.find(g => g.name === options.gate || g.id === parseInt(options.gate));
            if (!gate) {
                spinner.fail(chalk.red('Gate not found'));
                process.exit(1);
            }

            // Check if previous gates are passed
            const gateIndex = feature.validation.gates.indexOf(gate);
            const previousUnpassed = feature.validation.gates
                .slice(0, gateIndex)
                .filter(g => g.status !== 'passed');

            if (previousUnpassed.length > 0) {
                spinner.fail(chalk.red('Previous gates not passed'));
                console.log(chalk.yellow('Must pass gates in order:'));
                for (const g of previousUnpassed) {
                    console.log(chalk.gray(`  - Gate ${g.id}: ${g.name}`));
                }
                process.exit(1);
            }

            // Pass the gate
            gate.status = options.result || 'passed';
            gate.passedAt = new Date().toISOString();
            gate.passedBy = options.validator || 'cli';
            gate.notes = options.notes || '';

            feature.progress.push({
                timestamp: new Date().toISOString(),
                type: 'gate_validation',
                gate: gate.name,
                result: gate.status
            });

            feature.updatedAt = new Date().toISOString();
            saveFeatureList(list);

            spinner.succeed(chalk.green(`Gate ${gate.id} (${gate.name}): ${gate.status}`));
        } else {
            // Show validation status
            spinner.stop();
            console.log(chalk.cyan.bold(`Validation Status: ${feature.name}`));
            console.log(chalk.gray('─'.repeat(50)));
            console.log('');

            for (const gate of feature.validation.gates) {
                const statusIcon = {
                    passed: chalk.green('✓'),
                    failed: chalk.red('✗'),
                    pending: chalk.gray('○'),
                    skipped: chalk.yellow('⊘')
                }[gate.status] || chalk.gray('?');

                console.log(
                    statusIcon,
                    chalk.white(`Gate ${gate.id}:`),
                    chalk.cyan(gate.name),
                    chalk.gray(`- ${gate.description}`)
                );

                if (gate.passedAt) {
                    console.log(chalk.gray(`    Passed: ${new Date(gate.passedAt).toLocaleString()} by ${gate.passedBy}`));
                }
                if (gate.notes) {
                    console.log(chalk.gray(`    Notes: ${gate.notes}`));
                }
            }

            // Overall status
            const passedCount = feature.validation.gates.filter(g => g.status === 'passed').length;
            const allPassed = passedCount === VALIDATION_GATES.length;

            console.log('');
            console.log(chalk.gray('─'.repeat(50)));
            console.log(
                chalk.white('Progress:'),
                allPassed ? chalk.green.bold('ALL GATES PASSED') : chalk.yellow(`${passedCount}/${VALIDATION_GATES.length} gates passed`)
            );

            if (allPassed) {
                console.log(chalk.green.bold('✓ Feature ready for completion'));
            } else {
                const nextGate = feature.validation.gates.find(g => g.status === 'pending');
                if (nextGate) {
                    console.log(chalk.gray('Next gate:'), chalk.cyan(nextGate.name));
                }
            }
        }

        return feature;
    } catch (error) {
        spinner.fail(chalk.red('Failed to validate feature'));
        console.error(chalk.red(error.message));
        process.exit(1);
    }
}

/**
 * Complete a feature (requires all gates passed)
 */
async function complete(featureId, options) {
    const spinner = ora('Completing feature...').start();

    try {
        const list = loadFeatureList(options.list || 'active');
        const feature = list.features.find(f => f.id === featureId || f.id.startsWith(featureId));

        if (!feature) {
            spinner.fail(chalk.red('Feature not found'));
            process.exit(1);
        }

        // Check all gates passed
        const passedGates = feature.validation.gates.filter(g => g.status === 'passed').length;
        if (passedGates < VALIDATION_GATES.length && !options.force) {
            spinner.fail(chalk.red('Not all validation gates passed'));
            console.log(chalk.yellow(`${passedGates}/${VALIDATION_GATES.length} gates passed`));
            console.log(chalk.gray('Use'), chalk.white('--force'), chalk.gray('to complete anyway (CONSTITUTIONAL VIOLATION)'));
            process.exit(1);
        }

        if (options.force && passedGates < VALIDATION_GATES.length) {
            console.log(chalk.red.bold('⚠ CONSTITUTIONAL VIOLATION: Completing without full validation'));
            feature.progress.push({
                timestamp: new Date().toISOString(),
                type: 'violation',
                content: 'Forced completion without full gate validation'
            });
        }

        feature.status = 'completed';
        feature.completedAt = new Date().toISOString();
        feature.updatedAt = new Date().toISOString();
        feature.validation.status = 'completed';
        feature.progress.push({
            timestamp: new Date().toISOString(),
            type: 'completed',
            content: options.notes || 'Feature completed'
        });

        saveFeatureList(list);

        spinner.succeed(chalk.green('Feature completed'));
        console.log('');
        console.log(chalk.cyan('Feature:'), feature.name);
        console.log(chalk.cyan('Gates Passed:'), `${passedGates}/${VALIDATION_GATES.length}`);
        console.log(chalk.cyan('Completed At:'), new Date(feature.completedAt).toLocaleString());

        return feature;
    } catch (error) {
        spinner.fail(chalk.red('Failed to complete feature'));
        console.error(chalk.red(error.message));
        process.exit(1);
    }
}

/**
 * Show feature details
 */
async function show(featureId, options) {
    const list = loadFeatureList(options.list || 'active');
    const feature = list.features.find(f => f.id === featureId || f.id.startsWith(featureId));

    if (!feature) {
        console.log(chalk.red('Feature not found'));
        process.exit(1);
    }

    console.log(chalk.cyan.bold(`Feature: ${feature.name}`));
    console.log(chalk.gray('─'.repeat(60)));
    console.log('');
    console.log(chalk.white('ID:'), feature.id);
    console.log(chalk.white('Status:'), feature.status);
    console.log(chalk.white('Priority:'), feature.priority);
    console.log(chalk.white('Director:'), feature.director || 'unassigned');
    console.log(chalk.white('Created:'), new Date(feature.createdAt).toLocaleString());
    console.log(chalk.white('Updated:'), new Date(feature.updatedAt).toLocaleString());

    if (feature.description) {
        console.log('');
        console.log(chalk.white('Description:'));
        console.log(chalk.gray(feature.description));
    }

    if (feature.dependencies.length > 0) {
        console.log('');
        console.log(chalk.white('Dependencies:'));
        for (const dep of feature.dependencies) {
            console.log(chalk.gray(`  - ${dep}`));
        }
    }

    // Validation gates
    console.log('');
    console.log(chalk.white('Validation Gates:'));
    for (const gate of feature.validation.gates) {
        const status = gate.status === 'passed' ? chalk.green('✓') : chalk.gray('○');
        console.log(`  ${status} ${gate.name}`);
    }

    // Progress history
    if (options.verbose && feature.progress.length > 0) {
        console.log('');
        console.log(chalk.white('Progress History:'));
        for (const entry of feature.progress.slice(-10)) {
            console.log(chalk.gray(`  [${new Date(entry.timestamp).toLocaleString()}] ${entry.type}: ${entry.content || ''}`));
        }
    }
}

module.exports = {
    add,
    update,
    list,
    validate,
    complete,
    show
};
