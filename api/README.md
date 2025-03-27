# YouTube Transcript API Backend

This is a simple Flask backend that provides API endpoints for extracting transcripts from YouTube videos and translating them.

## Setup

1. Make sure you have Python 3.7+ installed
2. Install the required packages:
   ```
   pip install -r requirements.txt
   ```
3. Run the Flask server:
   ```
   python app.py
   ```

## API Endpoints

### Get Transcript

```
POST /api/transcript
```

Request body:
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

Response:
```json
{
  "success": true,
  "videoId": "VIDEO_ID",
  "videoTitle": "Video Title",
  "transcript": "Full transcript text..."
}
```

### Translate Text

```
POST /api/translate
```

Request body:
```json
{
  "text": "Text to translate",
  "language": "fr" // Target language code
}
```

Response:
```json
{
  "success": true,
  "translatedText": "Translated text...",
  "language": "fr"
}
```

## Notes

- The translation endpoint currently returns a mock response. To implement actual translation, you would need to integrate with a translation service like Google Translate API.
- For production use, you should add proper error handling, authentication, and rate limiting.
