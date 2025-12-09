use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};
use regex::Regex;

mod prompt_guard;
mod routing_guard;
mod sanitizer;

#[derive(Serialize, Deserialize)]
pub struct ValidationResult {
    pub safe: bool,
    pub reason: String,
    pub sanitized: Option<String>,
}

/// Validate input with WASM security checks
#[wasm_bindgen]
pub fn validate_input(input: &str, input_type: &str) -> JsValue {
    let result = match input_type {
        "director" => validate_director(input),
        "queenbee_type" => validate_queenbee_type(input),
        "path" => validate_path(input),
        "handoff_context" => validate_handoff_context(input),
        _ => ValidationResult {
            safe: true,
            reason: "No validation rule".to_string(),
            sanitized: None,
        },
    };

    serde_wasm_bindgen::to_value(&result).unwrap()
}

/// Sanitize input
#[wasm_bindgen]
pub fn sanitize_input(input: &str, input_type: &str) -> String {
    sanitizer::sanitize(input, input_type)
}

/// Validate handoff between directors
#[wasm_bindgen]
pub fn validate_handoff(from: &str, to: &str, context: &str) -> JsValue {
    let result = routing_guard::validate_handoff(from, to, context);
    serde_wasm_bindgen::to_value(&result).unwrap()
}

/// Detect prompt injection attempts
#[wasm_bindgen]
pub fn detect_prompt_injection(input: &str) -> JsValue {
    let result = prompt_guard::detect_injection(input);
    serde_wasm_bindgen::to_value(&result).unwrap()
}

// Internal validators
fn validate_director(input: &str) -> ValidationResult {
    let valid_directors = [
        "architecture", "business", "design", "engineering",
        "research", "documentation", "operations", "security"
    ];

    ValidationResult {
        safe: valid_directors.contains(&input),
        reason: if valid_directors.contains(&input) {
            "OK".to_string()
        } else {
            format!("Invalid director: {}", input)
        },
        sanitized: None,
    }
}

fn validate_queenbee_type(input: &str) -> ValidationResult {
    let valid_types = ["strategic", "tactical", "adaptive"];

    ValidationResult {
        safe: valid_types.contains(&input),
        reason: if valid_types.contains(&input) {
            "OK".to_string()
        } else {
            format!("Invalid queenbee type: {}", input)
        },
        sanitized: None,
    }
}

fn validate_path(input: &str) -> ValidationResult {
    // Allow alphanumeric, slashes, hyphens, underscores, dots, tildes
    let path_regex = Regex::new(r"^[a-zA-Z0-9/\-_\.~]+$").unwrap();

    ValidationResult {
        safe: path_regex.is_match(input),
        reason: if path_regex.is_match(input) {
            "OK".to_string()
        } else {
            "Path contains invalid characters".to_string()
        },
        sanitized: None,
    }
}

fn validate_handoff_context(input: &str) -> ValidationResult {
    // Max 500 characters, check for prompt injection
    if input.len() > 500 {
        return ValidationResult {
            safe: false,
            reason: "Context too long (max 500 chars)".to_string(),
            sanitized: None,
        };
    }

    let injection_result = prompt_guard::detect_injection(input);
    
    ValidationResult {
        safe: !injection_result.detected,
        reason: if !injection_result.detected {
            "OK".to_string()
        } else {
            format!("Security risk: {}", injection_result.reason)
        },
        sanitized: Some(sanitizer::sanitize(input, "handoff_context")),
    }
}
