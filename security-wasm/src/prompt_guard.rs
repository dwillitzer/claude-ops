use regex::Regex;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct InjectionResult {
    pub detected: bool,
    pub reason: String,
    pub confidence: f32,
}

/// Detect prompt injection attempts
pub fn detect_injection(input: &str) -> InjectionResult {
    let patterns = [
        // Jailbreak patterns
        (r"(?i)ignore\s+(previous|above|all)\s+instructions", 0.95),
        (
            r"(?i)disregard\s+(previous|all)\s+(rules|instructions)",
            0.95,
        ),
        (r"(?i)you\s+are\s+now\s+(a|an)\s+\w+", 0.9),
        // Role manipulation
        (r"(?i)act\s+as\s+(if|a|an)", 0.8),
        (r"(?i)pretend\s+(you|to)\s+are", 0.8),
        (r"(?i)roleplay\s+as", 0.85),
        // System prompt leakage
        (r"(?i)show\s+(me\s+)?(your|the)\s+prompt", 0.9),
        (r"(?i)what\s+(are|is)\s+your\s+instructions", 0.9),
        (r"(?i)reveal\s+your\s+system\s+prompt", 0.95),
        // Boundary breaking
        (r"(?i)</system>", 0.9),
        (r"(?i)<\|endoftext\|>", 0.9),
        (r"(?i)---\s*end\s+of\s+prompt", 0.85),
    ];

    for (pattern, confidence) in &patterns {
        let regex = Regex::new(pattern).unwrap();
        if regex.is_match(input) {
            return InjectionResult {
                detected: true,
                reason: format!("Potential prompt injection detected: matched pattern"),
                confidence: *confidence,
            };
        }
    }

    // Check for suspicious character patterns
    if input.contains("\\x") || input.contains("\\u") {
        return InjectionResult {
            detected: true,
            reason: "Suspicious escape sequences detected".to_string(),
            confidence: 0.7,
        };
    }

    InjectionResult {
        detected: false,
        reason: "No injection detected".to_string(),
        confidence: 0.0,
    }
}
