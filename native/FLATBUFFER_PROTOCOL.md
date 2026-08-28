# Flatbuffer protocol — `unicapture` → `127.0.0.1:19400` → `32×32` `ambient_lux`

> Minimal spec for `com.ha.tvbridge.service` JS bridge. Re-uses `hyperion-webos` `unicapture` + `piccap` payload shape; full hyperion flatbuffer schema lives in `hyperion-webos/fbs` and `hyperion.ng` `flatbuffers`.

## Transport

- **Host/port:** `127.0.0.1:19400` (HyperHDR default). HyperionNG alternate `19445` is not used on CX; HA sister expects `19400`.
- **Direction:** Native daemon (`hyperion-webos` `unicapture`) is the **server** when `hyperhdr` runs on-TV, or **client** when `hyperion-ng` runs off-TV. For the companion, the JS service is always a **client reader** — it `TCP connect`s to `127.0.0.1:19400` and reads frames; if nothing listens, it degrades to simulated.
- **Framing:** Flatbuffer `Image` object stream over TCP with 4-byte little-endian size prefix then flatbuffer payload (Hyperion flatbuffer `1`). If framing is absent (raw NV12 dump), JS falls back to raw NV12 parsing at `256×144`.
- **CX budget:** `width 256 × height 144 @ 30 fps` (`≈55 KiB` NV12 per frame, `≈1.6 MiB/s`) — the CX headroom that keeps `hyperhdr` preview on `8090` and leaves Enact `120 MiB` warm. Lower `15 fps` is the `memorymanager low 250 MB` fallback.

## Frame formats

### Unicapture native (libvtcapture + libhalgal)

- **Video plane:** `libvtcapture` (webOS `5.x+`) — scaler `SCALER_OUTPUT` (quirk `0x20`), `SCALER_INPUT` (`0x8`), `BLENDED_OUTPUT` (`0x10`), `OSD_OUTPUT` (`0x20`), `HISTOGRAM_OUTPUT` (`0x40`). CX uses `HISTOGRAM_OUTPUT` variant per probe (`0x40` in `0x143`).
- **UI plane:** `libhalgal` (webOS `5.x+`) — compositor `halgal` capture for OSD/UI. `libgm` is the older `3.x` path and is *not* used on CX 5.4.1.
- **Blending:** `unicapture` blends video + UI when both backends are enabled; ambient `ambient_lux` uses blended output so OSD does not produce black-bar artefacts.

### Pixel format

- **NV12** (`Y 256×144` + `UV 128×72` interleaved) — `hyperion-webos` `--format NV12` default. `RGB24`/`BGR` are heavier and not used for ambient.
- **Quirks on CX:** `QUIRK_DILE_VT_CREATE_EX 0x1 | QUIRK_DILE_VT_NO_FREEZE_CAPTURE 0x2 | QUIRK_ALTERNATIVE_DUMP_LOCATION_5 0x40 | QUIRK_VTCAPTURE_FORCE_CAPTURE 0x100` → `0x143`. `0x100` re-enables capture via custom kernel module for protected HDMI path; probe order tries `0x40` first then falls back to `0x100` if `capture: EMPTY` on HDMI.
- **References:** `webosbrew/hyperion-webos#Backends`, `#Quirks` table, `Source code file` quirk defines [[github-webosbrewhyperion-webos-hyperionng-video-grabber-for-webos-github]].

## Flatbuffer `Image` schema (abridged)

From `hyperion-webos/fbs/image.fbs` (and `hyperion.ng` `flatbuffers/image.fbs`):

```fbs
table Image {
  width:int;      // 256
  height:int;     // 144
  data:[ubyte];   // RGB or NV12 bytes (size width*height*3/2 for NV12)
  format:PixelFormat; // NV12 = 2, RGB = 0
  // plus hyperion priority / origin
}
enum PixelFormat { RGB = 0, BGR = 1, NV12 = 2, YUV444 = 3 }
root_type Image;
```

Wire: `[uint32_le size][flatbuffer bytes]` repeated. JS stub reads `size`, then `size` bytes, verifies flatbuffer magic (`0x494D4746` little-endian `IMGF` in some builds) if present, else treats payload as raw.

For the scaffold stub, verification is lenient — any `size` in `(0, 2 MiB)` that yields `width*height*3/2` bytes is accepted; otherwise the frame is discarded and `simulated` lux is used.

## `32×32` hash to `ambient_lux`

Home Assistant `sensor ambient_lux` is `illuminance` `lx` (`device_class illuminance`, `state_class measurement`, `unit lx`). The daemon does not forward the full `256×144` frame to HA — it hashes to `32×32` first:

```js
// 1. Downscale NV12 Y plane 256x144 → 32x32 by block average (8×4.5 → 8×4 or 8×5 staggered)
// 2. Convert each 32x32 luma Y (0–255) to linear luminance via inverse gamma 2.2 (or Rec.709)
// 3. Average 1024 luma values → avgY 0–255
// 4. Map avgY → lux: lux = round( (avgY/255) * 500 )  // 0–500 lx indoor scale
//    Night (~10 lx) → mid (≈150 lx) → bright (≈400 lx)
//    Optionally apply exposure compensation: lux = lux * (1.0 + (height/144 -1)*0.2)
// For flatbuffer RGB, convert via luminance = 0.2126 R + 0.7152 G + 0.0722 B first.
```

Example mapping (CX living room, `OLED48CXPTA` `04.40.16`):

| Scene | Avg Y | `ambient_lux` |
|---|---|---|
| Full black / screensaver | 5 | 10 |
| Dim movie letterbox | 45 | 88 |
| Normal UI / Lovelace warm | 110 | 216 |
| Bright football field | 200 | 392 |

The JS bridge caches `lastAmbientLux` and pushes via `broadcast('ambient', {lux, source, w:256,h:144,fps:30,quirks:0x143, hash:"32x32", ts})` every `2000 ms`. If no frame in `800 ms`, `source: simulated` and `lux` is jittered `±10 lx` around `lastAmbientLux` or `100 lx` initial.

## AI Picture Pro contract

`piccap` documents: `AI Picture Pro`, `AI Brightness`, `AI Genre Selection`, `AI Image Game Optimizer`, `AI Game Sound` reuse the same scaler pipeline and cause `200–500 ms` dropouts with LED blackout [[github-tbsnillerpiccap-piccap-hyperion-sender-app-ambilight-for-lg-webos-tvs-git]]. The JS service therefore:

- Shows a one-shot toast via `luna://com.webos.notification/createToast` (and `com.webos.service.notifications/createToast`) on first ambient loop start if daemon is live — message: *“Ambient capture active — turn off AI Picture Pro … (Settings → General → AI Service)”*.
- Never blocks capture — the dropout is a contract, not a crash. HA diagnostics logs the toast once per boot to avoid spam.

## Graceful degrade truth table

| Native daemon | TCP 19400 | JS behaviour | HA `ambient_lux` |
|---|---|---|---|
| Present, `hyperion-webos --unicapture` live | `CONNECT` + flatbuffer frames | Parse size-prefix, hash `32×32`, `source: flatbuffer` | `available: true`, `state: 0–500 lx` push `2000 ms` |
| Present, but `AI Picture Pro` ON | Frames with ~`300 ms` gaps | Same, but toast shown; HA sees jitter `±30 lx` | `available: true` with dropout note in attributes |
| Absent or `ECONNREFUSED`/`ETIMEDOUT 800 ms` | No listen | `simulateAmbientLux()` → `100 ± jitter`, `source: simulated` | `available: true` scaffold / `false` stock per `companion_caps` |
| Stock TV (no root) | No `all` role | `getAmbientLux` returns `{returnValue:false, errorText:"ambient unavailable — root required"}` | `available: false`, entity not removed |

## Sister HA mapping

- `sensor.ambient_lux` (`custom_components` Phase 1 already gated `available: companion_present and "capture" in companion_caps`) now gets real push when `capture` is advertised — see `docs/sister-second-mode-issue.md` Phase 3 addendum. WS message `{"type":"ambient","payload":{"lux":216,"source":"flatbuffer"}}` drives `coordinator.async_set_updated_data`.
- Do not yet implement native daemon in sister repo — only docs + `available` gating. The native stays in `lgtv-webos-homeassistant/native`.

## References

- `webosbrew/hyperion-webos` — `FLATBUFFERS.md`, `src/unicapture.cpp`, `src/capture/*_backend.cpp` quirks [[github-webosbrewhyperion-webos-hyperionng-video-grabber-for-webos-github]]
- `TBSniller/piccap` — `README.md` AI Picture Pro workaround, `servicefiles/*.json` `all` role [[github-tbsnillerpiccap-piccap-hyperion-sender-app-ambilight-for-lg-webos-tvs-git]]
- `hyperion.ng` flatbuffer docs — `docs/en/FlatBuffers.md` (size-prefix, `Image` table)
