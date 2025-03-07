"""
Transcript to JSON Converter
--------------------------

This script converts transcript text with timecodes into a properly formatted JSON file.
Each transcript entry will be sorted by timecode and saved with a unique filename.

Features:
    - Converts (M:SS) timecodes to HH:MM:SS format
    - Automatically sorts entries by timecode
    - Creates unique filenames using timestamps
    - Saves files in the backend directory
    - Shows preview of first entry after conversion

Input Format:
    - Each line should start with a timecode in parentheses
    - Timecode format: (M:SS) or (MM:SS)
    - Text follows immediately after the timecode
    
Example input:
    (0:00) First line of text
    (0:05) Second line of text
    (1:30) Another line of text
    (15:45) Last line

Output Format:
    - Creates a JSON file with format:
      {
        "transcripts": [
          {
            "timecode": "00:00:00",
            "transcript": "First line of text"
          },
          ...
        ]
      }
    - Files are named: transcript_YYYYMMDD_HHMMSS.json

How to Run:
    1. Open terminal/command prompt
    2. Navigate to backend directory:
       cd backend

    3. Run the script:
    cd backend
       python transcript.py

    4. Paste your transcript text
    5. Press Enter twice (leave a blank line) when done

    The script will:
    - Convert your text to JSON format
    - Save it with a unique filename
    - Show you how many entries were processed
    - Display a preview of the first entry
"""

import re
import json
import os
from datetime import datetime

def normalize_timecode(timecode: str) -> str:
    """Convert MM:SS format to HH:MM:SS"""
    parts = timecode.split(':')
    if len(parts) == 2:
        mm, ss = parts
        return f"00:{mm.zfill(2)}:{ss.zfill(2)}"
    return timecode

def parse_transcript(content: str) -> dict:
    """Convert transcript text to JSON format"""
    parsed_data = {"transcripts": []}
    
    # Split content into segments by timecode
    segments = re.findall(r'\((\d+:\d+)\)(.*?)(?=\(\d|\n|$)', content, re.DOTALL)
    
    for timecode, text in segments:
        # Normalize the timecode to HH:MM:SS format
        normalized_timecode = normalize_timecode(timecode)
        cleaned_text = text.strip()
        
        parsed_data["transcripts"].append({
            "timecode": normalized_timecode,
            "transcript": cleaned_text
        })
    
    # Sort by timecode
    parsed_data["transcripts"].sort(key=lambda x: x["timecode"])
    return parsed_data

def get_unique_filename() -> str:
    """Generate a unique filename using timestamp"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    return f"transcript_{timestamp}.json"

def main():
    print("\nTranscript to JSON Converter")
    print("-" * 25)
    print("Paste your transcript text below.")
    print("Format: (M:SS) Text")
    print("Press Enter twice when done.\n")
    
    # Collect input lines until user enters a blank line
    lines = []
    while True:
        line = input()
        if line.strip() == "":
            break
        lines.append(line)
    
    # Convert to JSON
    content = "\n".join(lines)
    result = parse_transcript(content)
    
    # Create unique filename and ensure we're in the backend directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_file = os.path.join(script_dir, get_unique_filename())
    
    # Save to file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
    
    print(f"\nProcessed {len(result['transcripts'])} entries")
    print(f"Saved to: {output_file}")
    
    # Show preview
    if result["transcripts"]:
        print("\nFirst entry:")
        print(json.dumps(result["transcripts"][0], indent=2))

if __name__ == "__main__":
    main()
