/**
 * ambient-bridge.d.ts — TypeScript ambient bridge for Phase 3 flagship.
 *
 * JS service (com.ha.tvbridge.service) reads unicapture flatbuffer 127.0.0.1:19400
 * (hyperion-webos libvtcapture + libhalgal, quirks 0x1|0x2|0x40|0x100 → 0x143)
 * at 256x144@30 CX budget, hashes to 32x32 → ambient_lux (lx), and pushes via
 * WS (type: ambient) and Luna (getAmbientLux). Gracefully degrades to
 * simulated when native daemon absent; stock TV returns 401-style unavailable.
 *
 * Refs:
 *   - https://github.com/webosbrew/hyperion-webos
 *   - https://github.com/TBSniller/piccap
 *   - native/FLATBUFFER_PROTOCOL.md
 *   - native/README.md
 */

export interface AmbientLuxReading {
  /** Illuminance 0–500 lx (indoor scale, avgY/255*500). */
  lux: number;
  /** Source truth — flatbuffer when native live, simulated in scaffold/stock. */
  source: 'flatbuffer' | 'simulated' | 'unavailable';
  /** Capture geometry — CX budget 256x144@30, quirks 0x143, hash 32x32. */
  meta: {
    width: 256;
    height: 144;
    fps: 30;
    quirks: 0x143; // 0x1|0x2|0x40|0x100 = 323
    hash: '32x32';
    host: '127.0.0.1';
    port: 19400;
  };
  /** HA push timestamp ms. */
  ts: number;
  /** Monotonic frame counter since service boot. */
  frameCount: number;
}

/** Luna getAmbientLux response — mirrors com.ha.tvbridge.service/getAmbientLux */
export interface GetAmbientLuxResponse {
  returnValue: boolean;
  lux?: number;
  source?: AmbientLuxReading['source'];
  ts?: number;
  errorText?: string; // "ambient unavailable — root required" on stock
  meta?: AmbientLuxReading['meta'];
}

/** WS envelope for ambient — broadcast type 'ambient' */
export interface AmbientWsEnvelope {
  type: 'ambient';
  payload: AmbientLuxReading;
  ts: number;
}

/** WS client request — getAmbientLux over wss:9923 */
export interface AmbientWsRequest {
  type: 'getAmbientLux';
}

/** Flatbuffer Image table (abridged) — hyperion-webos/fbs/image.fbs */
export interface FlatbufferImage {
  width: number; // 256
  height: number; // 144
  data: Uint8Array; // NV12 bytes width*height*3/2
  format: 0 | 1 | 2 | 3; // RGB=0 BGR=1 NV12=2 YUV444=3
}

/** Capability advertisement — CAPS_SNAPSHOT extension in Phase 3 */
export interface CapabilitiesWithAmbient {
  v: number;
  caps: Array<'cec' | 'capture' | 'voice' | 'lovelace'>;
  model: string;
  sv: string;
  wsPort: number;
  persist: boolean;
  explicit: boolean;
  // ambient lift
  ambient?: {
    available: boolean;
    source: AmbientLuxReading['source'];
    lastLux: number | null;
  };
}
