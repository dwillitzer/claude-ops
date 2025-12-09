const fs = require('fs').promises;
const path = require('path');

/**
 * Template Manager
 * Manages copying of director and memory-bank templates
 */
class TemplateManager {
    constructor() {
        this.templateDir = path.join(__dirname, '..', 'templates');
    }

    /**
     * Copy templates to target directory
     */
    async copyTemplates(targetPath, options = {}) {
        const { directors = 'all', minimal = false } = options;

        // Copy agent templates from original claude-ops repo
        const agentsPath = path.join(targetPath, 'agents');
        await this.copyAgentTemplates(agentsPath, directors);

        // Copy memory-bank
        const memoryBankPath = path.join(targetPath, 'memory-bank');
        await this.copyMemoryBank(memoryBankPath, minimal);

        // Create empty teams directory
        const teamsPath = path.join(targetPath, 'teams');
        await fs.mkdir(teamsPath, { recursive: true });
        await fs.writeFile(
            path.join(teamsPath, 'README.md'),
            '# Teams Directory\n\nTeam-specific agents are discovered via AgentDB queries.\n'
        );

        // Initialize hive-mind if not minimal
        if (!minimal) {
            await this.initializeHiveMind(targetPath);
        }
    }

    /**
     * Copy agent director templates
     */
    async copyAgentTemplates(agentsPath, directors) {
        await fs.mkdir(agentsPath, { recursive: true });

        const directorTemplates = {
            'architecture': 'architecture-director.md',
            'business': 'business-director.md',
            'design': 'design-director.md',
            'engineering': 'engineering-director.md',
            'research': 'research-director.md',
            'documentation': 'documentation-director.md',
            'operations': 'operations-director.md',
            'security': 'security-director.md'
        };

        const directorList = directors === 'all'
            ? Object.keys(directorTemplates)
            : directors;

        // For now, create placeholder templates
        // In production, these would be copied from actual claude-ops repo
        for (const director of directorList) {
            const filename = directorTemplates[director];
            const content = this.generateDirectorTemplate(director);
            await fs.writeFile(path.join(agentsPath, filename), content);
        }
    }

    /**
     * Copy memory-bank structure
     */
    async copyMemoryBank(memoryBankPath, minimal) {
        const dirs = ['active', 'constitutional', 'core', 'decision_log', 'index'];

        if (!minimal) {
            dirs.push('sops');
        }

        for (const dir of dirs) {
            const dirPath = path.join(memoryBankPath, dir);
            await fs.mkdir(dirPath, { recursive: true });
            await fs.writeFile(
                path.join(dirPath, 'README.md'),
                `# ${dir.charAt(0).toUpperCase() + dir.slice(1)}\n\nMemory bank: ${dir}\n`
            );
        }
    }

    /**
     * Initialize hive-mind system
     */
    async initializeHiveMind(targetPath) {
        const hiveMindPath = path.join(targetPath, '.hive-mind');
        await fs.mkdir(hiveMindPath, { recursive: true });

        const config = {
            version: '2.0.0',
            initialized: new Date().toISOString(),
            defaults: {
                queenType: 'strategic',
                maxWorkers: 8,
                consensusAlgorithm: 'majority',
                memorySize: 100,
                autoScale: true,
                encryption: false
            },
            mcpTools: {
                enabled: true,
                parallel: true,
                timeout: 60000
            }
        };

        await fs.writeFile(
            path.join(hiveMindPath, 'config.json'),
            JSON.stringify(config, null, 2)
        );
    }

    /**
     * Generate director template (placeholder)
     */
    generateDirectorTemplate(director) {
        const titles = {
            architecture: 'ARCHITECTURE DIRECTOR',
            business: 'BUSINESS DIRECTOR',
            design: 'DESIGN DIRECTOR',
            engineering: 'ENGINEERING DIRECTOR',
            research: 'RESEARCH DIRECTOR',
            documentation: 'DOCUMENTATION DIRECTOR',
            operations: 'OPERATIONS DIRECTOR',
            security: 'SECURITY DIRECTOR'
        };

        return `# ${titles[director]}
**Role**: Team Lead | **Domain**: ${director.charAt(0).toUpperCase() + director.slice(1)}
**Location**: .claude/agents/${director}-director.md

## IDENTITY

You are the ${director.charAt(0).toUpperCase() + director.slice(1)} Director, operating within the claude-ops framework.

## SCOPE

### YOU OWN
- ${director.charAt(0).toUpperCase() + director.slice(1)}-specific responsibilities

### YOU DO NOT OWN
- Cross-domain concerns (handoff required)

## EXECUTION RULES

Follow claude-ops protocols and SOPs.

---

**Version**: 1.0
**Generated**: ${new Date().toISOString()}
`;
    }
}

module.exports = TemplateManager;
