import os
from gtts import gTTS

def ensure_directory_exists(directory):
    """Ensure the given directory exists, creating it if necessary."""
    if not os.path.exists(directory):
        os.makedirs(directory)

def generate_audio(text, output_path):
    """Generate audio for the given text and save it to the specified output path."""
    try:
        print(f"Generating audio for: {text}")
        tts = gTTS(text=text, lang='en', slow=False)
        tts.save(output_path)
        print(f"Audio saved to: {output_path}")
    except Exception as e:
        print(f"Error generating audio for '{text}': {e}")

def process_symbols(symbols_dir, audio_dir):
    """Generate audio for symbols in the given directory."""
    ensure_directory_exists(audio_dir)

    for file_name in os.listdir(symbols_dir):
        if not file_name.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')) or '_original' in file_name:
            continue

        base_name = os.path.splitext(file_name)[0].replace('_', ' ').strip()

        # Preprocess text for special cases
        if base_name.lower() == "mcdonalds":
            text_to_speak = "McDonald's."  # Adjusted for proper pronunciation
        else:
            text_to_speak = base_name + "."

        output_path = os.path.join(audio_dir, f"{base_name}.mp3")

        if os.path.exists(output_path):
            print(f"Skipping {base_name} - audio file already exists")
            continue

        generate_audio(text_to_speak, output_path)

def main():
    """Main function to generate audio for symbols."""
    base_dir = os.path.dirname(os.path.abspath(__file__))
    symbols_dir = os.path.join(base_dir, "..", "public", "symbols")
    audio_dir = os.path.join(base_dir, "..", "public", "audio")

    print("Starting audio generation for symbols...")
    process_symbols(symbols_dir, audio_dir)
    print("Audio generation completed.")

if __name__ == "__main__":
    main()