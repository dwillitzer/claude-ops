use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct HandoffValidation {
    pub valid: bool,
    pub reason: String,
}

/// Validate handoff routing between directors
pub fn validate_handoff(from: &str, to: &str, _context: &str) -> HandoffValidation {
    let valid_directors = [
        "architecture",
        "business",
        "design",
        "engineering",
        "research",
        "documentation",
        "operations",
        "security",
    ];

    // Check both directors are valid
    if !valid_directors.contains(&from) {
        return HandoffValidation {
            valid: false,
            reason: format!("Invalid source director: {}", from),
        };
    }

    if !valid_directors.contains(&to) {
        return HandoffValidation {
            valid: false,
            reason: format!("Invalid target director: {}", to),
        };
    }

    // Check for invalid handoff patterns
    if from == to {
        return HandoffValidation {
            valid: false,
            reason: "Cannot handoff to self".to_string(),
        };
    }

    // Domain boundary validation
    let cross_domain_requires_approval = match (from, to) {
        ("engineering", "business") => true,
        ("design", "security") => true,
        _ => false,
    };

    if cross_domain_requires_approval {
        // In production, this would check for approval
        // For now, just warn
    }

    HandoffValidation {
        valid: true,
        reason: "OK".to_string(),
    }
}
