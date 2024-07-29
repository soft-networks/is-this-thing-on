# Welcome to is this THING on

We are a live streaming platform!!! This readme is meant to help you create your own live streaming platform. I was gonna try and write an architecture document but frankly that feels like too much work for this moment!!!!! So here are just some quick notes.

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

## How to run

By default, the application connects to the existing Firebase application. To run locally:

```sh
npm install && npm run dev
```

You can also configure your own personal Firebase application. Create one manually or use the instructions in [/infra/README.md] to set one up automatically and generate an .env.local file.

# Notes

- If you'd like to use a local server, you can set `NEXT_PUBLIC_USE_PROD_SERVER` to `false` in your .env.local file.
