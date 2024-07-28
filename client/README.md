# Welcome to is this THING on 

We are a live streaming platform!!! This readme is meant to help you create your own live streaming platform. I was gonna try and write an architecture document but frankly that feels like too much work for this moment!!!!! So here are just some quick notes.

testing push to main

Key components:
- Artist pages: 
  - room_name, room_color
  - custom CSS for chat, video sizes, stickers, etc
- Streams
  - Stream information
    - Season 0: iFrames / hrefs
    - Season 1: playback ID
  - stream_status: active/disconnected
- Stickers
  - sticker types: moveable, deletable, null
  - sticker images: url
  - sticker: position, size (scale)
