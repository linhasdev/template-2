"""
Transcript Search Tool
--------------------

This script implements a binary search functionality to find transcripts by timecode.

Functions:
    - parse_timecode(): Converts user input timecode to seconds
    - timecode_to_seconds(): Converts HH:MM:SS format to total seconds
    - find_nearest_transcript(): Uses binary search to find the nearest timecode
    - load_transcripts(): Loads and parses the JSON file
    - main(): Handles the terminal interface

Features:
    - Binary search implementation for efficient searching
    - Error handling for invalid inputs
    - Handles edge cases (timecodes before/after available range)
    - Returns the closest matching transcript

Usage:
    1. Save both required files in a /backend directory:
       - main.py (this file)
       - transcripts.json (the transcript database)
    
    2. Run the script:
        cd backend
      python main.py
    
    3. Enter timecodes in HH:MM:SS format (e.g., "00:01:30")
    
    4. Type 'q' to quit

Example:
    Enter timecode: 00:01:30
    
    Nearest Match Found:
    Timecode: 00:01:33
    Transcript: You might have just caught from how I described...
"""

import json
from datetime import datetime
import os

def parse_timecode(timecode: str) -> int:
    """Convert timecode string to seconds"""
    try:
        time = datetime.strptime(timecode, "%H:%M:%S")
        return time.hour * 3600 + time.minute * 60 + time.second
    except ValueError:
        raise ValueError("Invalid timecode format. Please use HH:MM:SS")

def timecode_to_seconds(timecode: str) -> int:
    """Convert HH:MM:SS to total seconds"""
    h, m, s = map(int, timecode.split(':'))
    return h * 3600 + m * 60 + s

def find_nearest_transcript(target_time: int, transcripts: list) -> dict:
    """Binary search to find the nearest timecode"""
    left, right = 0, len(transcripts) - 1
    
    # If target is beyond array bounds
    if target_time <= timecode_to_seconds(transcripts[0]['timecode']):
        return transcripts[0]
    if target_time >= timecode_to_seconds(transcripts[-1]['timecode']):
        return transcripts[-1]
    
    while left <= right:
        mid = (left + right) // 2
        mid_time = timecode_to_seconds(transcripts[mid]['timecode'])
        
        # Check if this is the closest match
        if mid > 0:
            prev_time = timecode_to_seconds(transcripts[mid-1]['timecode'])
            if prev_time <= target_time <= mid_time:
                # Return the closer one
                if (target_time - prev_time) < (mid_time - target_time):
                    return transcripts[mid-1]
                return transcripts[mid]
        
        if mid_time < target_time:
            left = mid + 1
        else:
            right = mid - 1
    
    return transcripts[left]

def load_transcripts() -> list:
    """Load transcripts from JSON file"""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    json_path = os.path.join(script_dir, 'transcripts.json')
    
    try:
        with open(json_path, 'r') as file:
            data = json.load(file)
            return data['transcripts']
    except FileNotFoundError:
        print(f"Error: Could not find transcripts.json in {script_dir}")
        return []
    except json.JSONDecodeError:
        print("Error: Invalid JSON format in transcripts.json")
        return []

def main():
    # Load transcripts
    transcripts = load_transcripts()
    if not transcripts:
        return
    
    print("\nTranscript Search Tool")
    print("---------------------")
    print("Enter timecode in HH:MM:SS format (or 'q' to quit)")
    
    while True:
        try:
            user_input = input("\nEnter timecode: ").strip()
            
            if user_input.lower() == 'q':
                break
            
            # Convert input to seconds
            target_seconds = parse_timecode(user_input)
            
            # Find nearest transcript
            result = find_nearest_transcript(target_seconds, transcripts)
            
            print("\nNearest Match Found:")
            print(f"Timecode: {result['timecode']}")
            print(f"Transcript: {result['transcript']}")
            
        except ValueError as e:
            print(f"Error: {e}")
        except Exception as e:
            print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()