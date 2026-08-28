---
title: fake-activity-manager.ts
id: fake-activity-managerts
tags:
- lgtv-webos-ha-root-1a89ff
- locus-companion-lifecycle-enact-vs-js-service-vs-systemd-persistence
created: '2026-08-28T02:33:15.018838Z'
source: https://raw.githubusercontent.com/webosbrew/webos-homebrew-channel/main/services/fake-activity-manager.ts
source_domain: raw.githubusercontent.com
fetched_at: '2026-08-28T02:33:15.017847Z'
fetch_provider: builtin
status: draft
type: note
tier: unknown
content_type: unknown
deprecated: false
---

import type Service from 'webos-service';
import type { ActivityManager } from 'webos-service';

declare module 'webos-service/service' {
// eslint-disable-next-line @typescript-eslint/no-shadow
interface Service {
unregister(): void;
}
}

type PublicAM = Pick;

/**
* for each request, `webos-service` creates an activity, waits for acknowledgment from ActivityManager,
* and then runs method handler. eventually, activity completes.
*
* if response from *any* call contains `$activity` field, `webos-service` attempts to _adopt_ it.
* unfortunately, this also removes the activity from persistent DB.
*
* instead of patching the external library behavior, we use a stub.
*
* ActivityManager stub is still used to terminate service if it is idling for `ttlSeconds`.
*/
export default class FakeActivityManager implements PublicAM {
private _counter: number = 0;

private _idleTimer: ReturnType | null = null;

constructor(
private _service: Service | null = null,
private _ttlSeconds: number = 30,
) {
this._idleTimer = setTimeout(this.quit.bind(this), this._ttlSeconds * 1000);
}

create(_activity: any, callback?: (payload: any) => void) {
this.acquire();
callback?.({ returnValue: true });
}

adopt(_activity: any, callback?: (payload: any) => void) {
this.acquire();
callback?.({ payload: { returnValue: true } });
}

complete(_activity: any, callback?: (payload: any) => void) {
this.release();
callback?.({ returnValue: true });
}

setService(service: Service) {
// types include many props that should not actually be public
this._service = service;
}

cast() {
return this as unknown as ActivityManager;
}

private acquire() {
this._counter++;

if (this._idleTimer !== null) {
clearTimeout(this._idleTimer);
}
}

private release() {
this._counter--;

if (this._counter === 0) {
this._idleTimer = setTimeout(this.quit.bind(this), this._ttlSeconds * 1000);
}
}

private quit() {
console.log('quitting on next tick');

process.nextTick(() => process.exit(0));

this._service?.unregister();
}
}