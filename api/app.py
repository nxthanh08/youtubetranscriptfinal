from flask import Flask, request, jsonify
from flask_cors import CORS
from youtube_transcript_api import YouTubeTranscriptApi, NoTranscriptFound, TranscriptsDisabled
import re

app = Flask(__name__)
CORS(app)

@app.route('/api/transcript', methods=['POST'])
def get_transcript():
    try:
        data = request.json
        url = data.get('url')
        
        if not url:
            return jsonify({'error': 'URL is required'}), 400
        
        # Extract video ID from URL
        video_id = extract_video_id(url)
        if not video_id:
            return jsonify({'error': 'Invalid YouTube URL'}), 400
        
        # Get transcript
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
        transcript_text = ' '.join([item['text'] for item in transcript_list])
        
        # Get video title (in a real implementation, you would use YouTube Data API)
        video_title = f"YouTube Video (ID: {video_id})"
        
        return jsonify({
            'transcript': transcript_text,
            'videoTitle': video_title,
            'videoId': video_id
        })
    
    except NoTranscriptFound:
        return jsonify({'error': 'No transcript found for this video'}), 404
    except TranscriptsDisabled:
        return jsonify({'error': 'Transcripts are disabled for this video'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/translate', methods=['POST'])
def translate_text():
    try:
        data = request.json
        text = data.get('text')
        language = data.get('language')
        
        if not text or not language:
            return jsonify({'error': 'Text and language are required'}), 400
        
        # In a real implementation, you would use a translation API
        # This is a simple mock implementation
        translated_text = f"[Translated to {language}] {text}"
        
        return jsonify({'translatedText': translated_text})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/languages', methods=['GET'])
def get_available_languages():
    try:
        video_id = request.args.get('videoId')
        
        if not video_id:
            return jsonify({'error': 'Video ID is required'}), 400
        
        # Get available transcript languages
        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
        
        languages = []
        for transcript in transcript_list:
            language_code = transcript.language_code
            language_name = transcript.language
            languages.append({
                'code': language_code,
                'name': language_name
            })
        
        return jsonify({'languages': languages})
    
    except NoTranscriptFound:
        return jsonify({'error': 'No transcript found for this video'}), 404
    except TranscriptsDisabled:
        return jsonify({'error': 'Transcripts are disabled for this video'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/transcript/language', methods=['POST'])
def get_transcript_in_language():
    try:
        data = request.json
        video_id = data.get('videoId')
        language = data.get('language')
        
        if not video_id or not language:
            return jsonify({'error': 'Video ID and language are required'}), 400
        
        # Get transcript in specified language
        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
        transcript = transcript_list.find_transcript([language])
        transcript_data = transcript.fetch()
        
        transcript_text = ' '.join([item['text'] for item in transcript_data])
        
        return jsonify({
            'transcript': transcript_text,
            'language': language
        })
    
    except NoTranscriptFound:
        return jsonify({'error': 'No transcript found for this video in the specified language'}), 404
    except TranscriptsDisabled:
        return jsonify({'error': 'Transcripts are disabled for this video'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def extract_video_id(url):
    # Regular expressions to extract video ID from different YouTube URL formats
    patterns = [
        r'(?:v=|\/)([0-9A-Za-z_-]{11}).*',  # Standard YouTube URLs
        r'(?:embed\/|v\/|youtu\.be\/)([0-9A-Za-z_-]{11})',  # Embedded and shortened URLs
        r'(?:watch\?v=)([0-9A-Za-z_-]{11})'  # Watch URLs
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    
    return None

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
