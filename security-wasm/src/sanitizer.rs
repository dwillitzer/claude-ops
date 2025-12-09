/// Sanitize input strings
pub fn sanitize(input: &str, input_type: &str) -> String {
    let mut sanitized = input.to_string();

    // Remove control characters
    sanitized = sanitized
        .chars()
        .filter(|c| !c.is_control() || *c == '\n' || *c == '\t')
        .collect();

    // Type-specific sanitization
    match input_type {
        "path" => {
            // Remove potentially dangerous path characters
            sanitized = sanitized.replace("..", "");
            sanitized = sanitized.replace("\\", "/");
        }
        "handoff_context" => {
            // Remove HTML/XML tags
            sanitized = strip_tags(&sanitized);
            // Limit length
            if sanitized.len() > 500 {
                sanitized.truncate(500);
            }
        }
        _ => {}
    }

    // Trim whitespace
    sanitized.trim().to_string()
}

/// Strip HTML/XML tags
fn strip_tags(input: &str) -> String {
    let mut result = String::new();
    let mut in_tag = false;

    for c in input.chars() {
        match c {
            '<' => in_tag = true,
            '>' => in_tag = false,
            _ => {
                if !in_tag {
                    result.push(c);
                }
            }
        }
    }

    result
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_sanitize_path() {
        assert_eq!(sanitize("../etc/passwd", "path"), "/etc/passwd");
        assert_eq!(sanitize("path\\to\\file", "path"), "path/to/file");
    }

    #[test]
    fn test_sanitize_context() {
        let input = "<script>alert('xss')</script>Build auth";
        assert_eq!(sanitize(input, "handoff_context"), "alert('xss')Build auth");
    }

    #[test]
    fn test_strip_tags() {
        assert_eq!(strip_tags("<p>Hello</p>"), "Hello");
        assert_eq!(strip_tags("No<br/>tags"), "Notags");
    }
}
