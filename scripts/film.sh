#!/bin/bash
# The launch film for the site's player (Video.js, src/FilmPlayer.jsx), from one master MP4:
#   public/media/film/master.m3u8 and its renditions: HLS, 1080p/720p/480p/360p H.264 with their keyframes aligned
#     (every 2 s, so the player can switch between them), and the audio once (AAC) beside them;
#   public/media/film/storyboard.jpg and storyboard.vtt: a frame every 2 s for the timeline previews.
# Chapters (public/media/film/chapters.vtt) are written by hand: one cue per chapter, its title as the text.
# The MP4 beside them (public/media/murmur-launch.mp4) stays as the fallback and the link-preview video.
#
#   scripts/film.sh ~/Movies/murmur-launch-master.mp4
set -euo pipefail
cd "$(dirname "$0")/.."
MASTER="${1:?usage: scripts/film.sh <master.mp4>}"
OUT=public/media/film
DURATION=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$MASTER")
mkdir -p "$OUT"
rm -rf "$OUT"/1080p "$OUT"/720p "$OUT"/480p "$OUT"/360p "$OUT"/audio "$OUT"/master.m3u8

# Text and drawings in the film stay sharp at these rates (it's mostly still frames); the caps keep phones on slow
# networks playing.
ffmpeg -hide_banner -loglevel error -y -i "$MASTER" \
  -filter_complex "[0:v]split=4[a][b][c][d];[a]scale=1920:1080[v0];[b]scale=1280:720[v1];[c]scale=854:480[v2];[d]scale=640:360[v3]" \
  -map "[v0]" -map "[v1]" -map "[v2]" -map "[v3]" -map 0:a \
  -c:v libx264 -preset slow -profile:v high -pix_fmt yuv420p \
  -crf:v:0 24 -maxrate:v:0 1700k -bufsize:v:0 3400k \
  -crf:v:1 25 -maxrate:v:1 950k -bufsize:v:1 1900k \
  -crf:v:2 26 -maxrate:v:2 560k -bufsize:v:2 1120k \
  -crf:v:3 27 -maxrate:v:3 340k -bufsize:v:3 680k \
  -g 60 -keyint_min 60 -sc_threshold 0 \
  -c:a aac -b:a 128k -ac 2 -ar 48000 \
  -f hls -hls_time 4 -hls_playlist_type vod -hls_segment_type fmp4 -hls_flags independent_segments \
  -hls_fmp4_init_filename init.mp4 -hls_segment_filename "$OUT/%v/seg%02d.m4s" -master_pl_name master.m3u8 \
  -var_stream_map "v:0,agroup:audio,name:1080p v:1,agroup:audio,name:720p v:2,agroup:audio,name:480p v:3,agroup:audio,name:360p a:0,agroup:audio,name:audio,default:yes,language:en" \
  "$OUT/%v/index.m3u8"
# The audio's name in the player's menu.
sed -i.bak 's/NAME="audio_[0-9]*"/NAME="English"/' "$OUT/master.m3u8" && rm "$OUT/master.m3u8.bak"

# The storyboard: one sprite of 256×144 frames, 11 a row. Its cues name the image relative to the page, as the player
# resolves them.
FRAMES=$(python3 -c "import math; print(math.ceil($DURATION / 2))")
ROWS=$(( (FRAMES + 10) / 11 ))
ffmpeg -hide_banner -loglevel error -y -i "$MASTER" -vf "fps=1/2,scale=256:144:flags=lanczos,tile=11x$ROWS" -frames:v 1 -q:v 5 "$OUT/storyboard.jpg"
python3 - "$DURATION" "$FRAMES" > "$OUT/storyboard.vtt" <<'EOF'
import sys
duration, frames = float(sys.argv[1]), int(sys.argv[2])
def stamp(t):
    m, s = divmod(t, 60)
    return f"{int(m):02d}:{s:06.3f}"
print("WEBVTT\n")
for i in range(frames):
    print(f"{stamp(i * 2)} --> {stamp(min(duration, i * 2 + 2))}")
    print(f"media/film/storyboard.jpg#xywh={(i % 11) * 256},{(i // 11) * 144},256,144\n")
EOF
du -sh "$OUT"
