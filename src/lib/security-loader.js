/**
 * WASM Security Loader
 * Loads sentinel-wasm compiled WASM security module
 */

const path = require('path');
let securityModule = null;

/**
 * Load WASM security module (sentinel-wasm)
 */
async function loadSecurityModule() {
    if (securityModule) return securityModule;

    try {
        // Load sentinel-wasm compiled module
        const wasmPath = path.join(__dirname, '..', '..', 'wasm', 'sentinel_wasm.js');
        const sentinelWasm = require(wasmPath);

        // Initialize WASM
        await sentinelWasm.default();

        securityModule = {
            // Map sentinel-wasm functions to our interface
            validate_input: (input, type) => sentinelValidateInput(sentinelWasm, input, type),
            sanitize_input: (input, type) => sentinelSanitizeInput(sentinelWasm, input, type),
            validate_handoff: (from, to, context) => sentinelValidateHandoff(sentinelWasm, from, to, context),
            detect_prompt_injection: (input) => sentinelWasm.check_permission(input)
        };

        return securityModule;
    } catch (error) {
        console.warn('Warning: sentinel-wasm not available, using fallback validation');
        // Fallback to basic validation
        securityModule = {
            validate_input: mockValidateInput,
            sanitize_input: mockSanitizeInput,
            validate_handoff: mockValidateHandoff
        };
        return securityModule;
    }
}

/**
 * Validate input with sentinel-wasm security checks
 */
async function validateInput(input, type) {
    await loadSecurityModule();

    try {
        const result = securityModule.validate_input(input, type);
        return result;
    } catch (error) {
        return { safe: false, reason: error.message };
    }
}

/**
 * Sanitize input using sentinel-wasm
 */
async function sanitizeInput(input, type) {
    await loadSecurityModule();

    try {
        return securityModule.sanitize_input(input, type);
    } catch (error) {
        return input;
    }
}

// Sentinel-WASM integration adapters
function sentinelValidateInput(wasm, input, type) {
    // Use sentinel-wasm's check_permission for validation
    const permissionCheck = wasm.check_permission(input);

    // Map to our validation result format
    if (permissionCheck && permissionCheck.allowed !== undefined) {
        return {
            safe: permissionCheck.allowed,
            reason: permissionCheck.allowed ? 'OK' : (permissionCheck.reason || 'Blocked by sentinel-wasm'),
            sanitized: permissionCheck.sanitized_input
        };
    }

    // Fallback to basic validation
    return mockValidateInput(input, type);
}

function sentinelSanitizeInput(wasm, input, type) {
    try {
        // Sentinel-wasm provides sanitized output in check_permission
        const result = wasm.check_permission(input);
        return result.sanitized_input || input;
    } catch (error) {
        return mockSanitizeInput(input, type);
    }
}

function sentinelValidateHandoff(wasm, from, to, context) {
    // Validate context with sentinel-wasm
    const contextCheck = wasm.check_permission(context);

    // Also validate director names
    const validDirectors = ['architecture', 'business', 'design', 'engineering', 'research', 'documentation', 'operations', 'security'];

    return {
        valid: contextCheck.allowed && validDirectors.includes(from) && validDirectors.includes(to),
        reason: contextCheck.allowed ? 'OK' : (contextCheck.reason || 'Blocked by sentinel-wasm')
    };
}

// Fallback mock implementations (used if sentinel-wasm not available)
function mockValidateInput(input, type) {
    const rules = {
        director: /^(architecture|business|design|engineering|research|documentation|operations|security)$/,
        queenbee_type: /^(strategic|tactical|adaptive)$/,
        path: /^[a-zA-Z0-9\/\-_\.~]+$/,
        handoff_context: /.{1,500}/
    };

    if (type in rules) {
        const valid = rules[type].test(input);
        return {
            safe: valid,
            reason: valid ? 'OK' : `Invalid ${type}: ${input}`
        };
    }

    return { safe: true, reason: 'No validation rule' };
}

function mockSanitizeInput(input, type) {
    return input
        .replace(/[<>]/g, '')
        .replace(/[\x00-\x1F\x7F]/g, '')
        .trim();
}

function mockValidateHandoff(from, to, context) {
    const validDirectors = ['architecture', 'business', 'design', 'engineering', 'research', 'documentation', 'operations', 'security'];

    return {
        valid: validDirectors.includes(from) && validDirectors.includes(to),
        reason: 'OK'
    };
}

module.exports = {
    loadSecurityModule,
    validateInput,
    sanitizeInput
};
