import re
import json
import html
from typing import Dict, Any, Optional

def extract_json_from_html(html_body: str) -> Dict[str, Any]:
    """
    Extract JSON object from HTML email body and return both the JSON and cleaned HTML.
    
    Args:
        html_body: The HTML content from the email
        
    Returns:
        Dictionary with 'userCode' (extracted JSON) and 'body' (HTML without JSON)
    """
    # Unescape HTML entities first
    unescaped = html.unescape(html_body)
    
    # More robust pattern that handles email addresses and nested structures
    # Look for { followed by any characters until matching }
    pattern = r'\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}'
    
    extracted_json = None
    cleaned_body = html_body
    
    # Find all potential JSON objects
    matches = list(re.finditer(pattern, unescaped))
    
    # Sort by length (longer first) to try more complete objects first
    matches.sort(key=lambda x: len(x.group()), reverse=True)
    
    for match in matches:
        try:
            potential_json = match.group()
            parsed = json.loads(potential_json)
            extracted_json = parsed
            
            # Find and remove the JSON from the original HTML
            # Handle different escape scenarios
            json_variations = [
                html.escape(potential_json),
                potential_json.replace('"', '&quot;'),
                potential_json.replace('@', '&#64;'),
                potential_json.replace('@', '&#x40;'),
                potential_json  # Try unescaped too
            ]
            
            for variant in json_variations:
                if variant in html_body:
                    # Find the complete span/element containing the JSON
                    # Look backwards for opening tag
                    start_idx = html_body.index(variant)
                    
                    # Find the start of the containing element
                    before_json = html_body[:start_idx]
                    tag_start = before_json.rfind('<span')
                    if tag_start == -1:
                        tag_start = before_json.rfind('<div')
                    if tag_start == -1:
                        tag_start = start_idx
                    
                    # Find the end of the containing element
                    after_json = html_body[start_idx + len(variant):]
                    tag_end = after_json.find('</span>')
                    if tag_end == -1:
                        tag_end = after_json.find('</div>')
                    if tag_end != -1:
                        tag_end += 7  # Include the closing tag
                    else:
                        tag_end = 0
                    
                    # Remove the entire element containing the JSON
                    cleaned_body = html_body[:tag_start] + html_body[start_idx + len(variant) + tag_end:]
                    break
            
            break  # Found valid JSON
            
        except (json.JSONDecodeError, ValueError):
            continue
    
    return {
        "userCode": extracted_json,
        "body": cleaned_body
    }

# Alternative approach using a more aggressive search
def extract_json_from_html_v2(html_body: str) -> Dict[str, Any]:
    """
    Alternative approach that's more aggressive in finding JSON objects.
    """
    # Unescape all HTML entities
    unescaped = html.unescape(html_body)
    
    # Try to find anything that looks like JSON between braces
    # This pattern is more permissive
    pattern = r'\{[^}]*@[^}]*\}|\{[^}]+\}'
    
    extracted_json = None
    cleaned_body = html_body
    
    for match in re.finditer(pattern, unescaped):
        potential_json = match.group()
        
        # Clean up common email HTML artifacts
        cleaned_json = potential_json
        cleaned_json = re.sub(r'<[^>]+>', '', cleaned_json)  # Remove HTML tags
        cleaned_json = cleaned_json.replace('&quot;', '"')
        cleaned_json = cleaned_json.replace('&#39;', "'")
        cleaned_json = cleaned_json.replace('&lt;', '<')
        cleaned_json = cleaned_json.replace('&gt;', '>')
        cleaned_json = cleaned_json.replace('&#64;', '@')
        cleaned_json = cleaned_json.replace('&#x40;', '@')
        
        try:
            parsed = json.loads(cleaned_json)
            extracted_json = parsed
            
            # Remove from HTML body
            start = unescaped.find(potential_json)
            if start != -1:
                # Find corresponding position in escaped HTML
                escaped_version = html.escape(potential_json)
                if escaped_version in html_body:
                    cleaned_body = html_body.replace(escaped_version, '')
                else:
                    # Try other escape patterns
                    for char, escaped in [('@', '&#64;'), ('@', '&#x40;'), ('"', '&quot;')]:
                        test_version = potential_json.replace(char, escaped)
                        if test_version in html_body:
                            cleaned_body = html_body.replace(test_version, '')
                            break
            break
            
        except (json.JSONDecodeError, ValueError):
            continue
    
    return {
        "userCode": extracted_json,
        "body": cleaned_body
    }


# Usage with your email object:
def process_email_body(mailobject):
    """
    Process email to extract JSON from HTML body.
    
    Args:
        mailobject: Email message object from email.message_from_string()
        
    Returns:
        Dictionary with extracted JSON and modified HTML
    """
    # Get HTML body from email
    html_body = None
    
    if mailobject.is_multipart():
        for part in mailobject.walk():
            if part.get_content_type() == "text/html":
                html_body = part.get_payload(decode=True).decode('utf-8', errors='ignore')
                break
    else:
        if mailobject.get_content_type() == "text/html":
            html_body = mailobject.get_payload(decode=True).decode('utf-8', errors='ignore')
    
    if html_body:
        result = extract_json_from_html_v2(html_body)
        print("JSON Result is: ")
        print(result)
        # Update the email body with cleaned HTML if JSON was found
        if result["userCode"] and mailobject.is_multipart():
            for part in mailobject.walk():
                if part.get_content_type() == "text/html":
                    part.set_payload(result["body"])
                    break
        
        return result
    
    return {"userCode": None, "body": html_body}