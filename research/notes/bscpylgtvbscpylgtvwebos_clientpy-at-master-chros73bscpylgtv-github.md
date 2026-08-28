---
title: bscpylgtv/bscpylgtv/webos_client.py at master · chros73/bscpylgtv · GitHub
id: bscpylgtvbscpylgtvwebos_clientpy-at-master-chros73bscpylgtv-github
tags:
- lgtv-webos-ha-root-1a89ff
- locus-transport-discovery-security-pairing-ws-mqtt-hybrid
created: '2026-08-28T02:15:25.166330Z'
updated: '2026-08-28T02:44:16.560691Z'
source: https://github.com/chros73/bscpylgtv/blob/master/bscpylgtv/webos_client.py
source_domain: github.com
fetched_at: '2026-08-28T02:15:25.163867Z'
fetch_provider: builtin
status: draft
type: note
tier: ground_truth
content_type: code
deprecated: false
---

bscpylgtv/bscpylgtv/webos_client.py at master · chros73/bscpylgtv · GitHub

Skip to content

Search/

Sign inSign up
Appearance settings

You signed in with another tab or window. Reload to refresh your session.
You signed out in another tab or window. Reload to refresh your session.
You switched accounts on another tab or window. Reload to refresh your session.

Dismiss alert

{{ message }}

chros73

/

bscpylgtv

Public

Notifications
You must be signed in to change notification settings

Fork
30

Star
343

FilesExpand file tree

master

/
webos_client.pyCopy path

Blame
More file actions

Blame
More file actions

Latest commit

HistoryHistory

History

executable file·
2112 lines (1707 loc) · 83.5 KB

master

/
webos_client.pyCopy pathTop

File metadata and controls

Code

Blame

executable file·
2112 lines (1707 loc) · 83.5 KB

Raw
Copy raw file
Download raw file
Open symbols panel
Edit and raw actions

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
73
74
75
76
77
78
79
80
81
82
83
84
85
86
87
88
89
90
91
92
93
94
95
96
97
98
99
100
101
102
103
104
105
106
107
108
109
110
111
112
113
114
115
116
117
118
119
120
121
122
123
124
125
126
127
128
129
130
131
132
133
134
135
136
137
138
139
140
141
142
143
144
145
146
147
148
149
150
151
152
153
154
155
156
157
158
159
160
161
162
163
164
165
166
167
168
169
170
171
172
173
174
175
176
177
178
179
180
181
182
183
184
185
186
187
188
189
190
191
192
193
194
195
196
197
198
199
200
201
202
203
204
205
206
207
208
209
210
211
212
213
214
215
216
217
218
219
220
221
222
223
224
225
226
227
228
229
230
231
232
233
234
235
236
237
238
239
240
241
242
243
244
245
246
247
248
249
250
251
252
253
254
255
256
257
258
259
260
261
262
263
264
265
266
267
268
269
270
271
272
273
274
275
276
277
278
279
280
281
282
283
284
285
286
287
288
289
290
291
292
293
294
295
296
297
298
299
300
301
302
303
304
305
306
307
308
309
310
311
312
313
314
315
316
317
318
319
320
321
322
323
324
325
326
327
328
329
330
331
332
333
334
335
336
337
338
339
340
341
342
343
344
345
346
347
348
349
350
351
352
353
354
355
356
357
358
359
360
361
362
363
364
365
366
367
368
369
370
371
372
373
374
375
376
377
378
379
380
381
382
383
384
385
386
387
388
389
390
391
392
393
394
395
396
397
398
399
400
401
402
403
404
405
406
407
408
409
410
411
412
413
414
415
416
417
418
419
420
421
422
423
424
425
426
427
428
429
430
431
432
433
434
435
436
437
438
439
440
441
442
443
444
445
446
447
448
449
450
451
452
453
454
455
456
457
458
459
460
461
462
463
464
465
466
467
468
469
470
471
472
473
474
475
476
477
478
479
480
481
482
483
484
485
486
487
488
489
490
491
492
493
494
495
496
497
498
499
500
501
502
503
504
505
506
507
508
509
510
511
512
513
514
515
516
517
518
519
520
521
522
523
524
525
526
527
528
529
530
531
532
533
534
535
536
537
538
539
540
541
542
543
544
545
546
547
548
549
550
551
552
553
554
555
556
557
558
559
560
561
562
563
564
565
566
567
568
569
570
571
572
573
574
575
576
577
578
579
580
581
582
583
584
585
586
587
588
589
590
591
592
593
594
595
596
597
598
599
600
601
602
603
604
605
606
607
608
609
610
611
612
613
614
615
616
617
618
619
620
621
622
623
624
625
626
627
628
629
630
631
632
633
634
635
636
637
638
639
640
641
642
643
644
645
646
647
648
649
650
651
652
653
654
655
656
657
658
659
660
661
662
663
664
665
666
667
668
669
670
671
672
673
674
675
676
677
678
679
680
681
682
683
684
685
686
687
688
689
690
691
692
693
694
695
696
697
698
699
700
701
702
703
704
705
706
707
708
709
710
711
712
713
714
715
716
717
718
719
720
721
722
723
724
725
726
727
728
729
730
731
732
733
734
735
736
737
738
739
740
741
742
743
744
745
746
747
748
749
750
751
752
753
754
755
756
757
758
759
760
761
762
763
764
765
766
767
768
769
770
771
772
773
774
775
776
777
778
779
780
781
782
783
784
785
786
787
788
789
790
791
792
793
794
795
796
797
798
799
800
801
802
803
804
805
806
807
808
809
810
811
812
813
814
815
816
817
818
819
820
821
822
823
824
825
826
827
828
829
830
831
832
833
834
835
836
837
838
839
840
841
842
843
844
845
846
847
848
849
850
851
852
853
854
855
856
857
858
859
860
861
862
863
864
865
866
867
868
869
870
871
872
873
874
875
876
877
878
879
880
881
882
883
884
885
886
887
888
889
890
891
892
893
894
895
896
897
898
899
900
901
902
903
904
905
906
907
908
909
910
911
912
913
914
915
916
917
918
919
920
921
922
923
924
925
926
927
928
929
930
931
932
933
934
935
936
937
938
939
940
941
942
943
944
945
946
947
948
949
950
951
952
953
954
955
956
957
958
959
960
961
962
963
964
965
966
967
968
969
970
971
972
973
974
975
976
977
978
979
980
981
982
983
984
985
986
987
988
989
990
991
992
993
994
995
996
997
998
999
1000

import asyncio

import base64

import functools

import json

import os

import ssl

from datetime import timedelta

try:

import numpy as np

except ImportError:

np = None

import websockets

from . import buttons as btn

from . import endpoints as ep

from .exceptions import PyLGTVPairException, PyLGTVCmdException, PyLGTVCmdError, PyLGTVServiceNotFoundError

from .manifest import MANIFEST

from .storage_proto import StorageProto

from .storage_sqlitedict import StorageSqliteDict

from .constants import PAIRING_TYPES, LUT3D_SIZES, DV_CONFIG_TYPES

if np:

from . import cal_commands as cal

from .constants import (

BT2020_PRIMARIES,

CALIBRATION_TYPE_MAP,

SDR_PICTURE_MODES,

HDR10_PICTURE_MODES,

DV_PICTURE_MODES,

DV_BLACK_LEVEL,

DV_GAMMA,

DV_CONFIG_FILENAME,

)

from .lut_tools import (

create_dolby_vision_config,

generate_dolby_vision_config,

read_cal_file,

read_cube_file,

read_1dlut_file,

read_3by3_gamut_file,

read_3dlut_file,

backup_lut_into_file,

unity_lut_1d,

unity_lut_3d,

convert_1dlut_to_cal_format,

)

SOUND_OUTPUTS_TO_DELAY_CONSECUTIVE_VOLUME_STEPS = {"external_arc"}

class WebOsClient:

STATIC_STATES = {"system_info", "software_info"}

def __init__(

self,

ip,

key_file_path=None,

manifest_file_path=None,

pairing_type=None,

timeout_connect=2,

connect_retry_attempts=9,

connect_retry_interval_ms=200,

ping_interval=1,

ping_timeout=20,

client_key=None,

volume_step_delay_ms=None,

get_hello_info=False,

states=["system_info", "software_info", "power", "current_app", "muted",

"volume", "apps", "inputs", "sound_output", "picture_settings"],

calibration_info=None,

without_ssl=False,

storage: StorageProto=None,

):

"""Initialize the client."""

self.ip = ip

self.port = (3000 if without_ssl else 3001)

self.proto = ('ws' if without_ssl else 'wss')

self.key_file_path = key_file_path

self.manifest = MANIFEST

self.pairing_type = PAIRING_TYPES[0]

self.client_key = client_key

self.command_count = 0

self.timeout_connect = max(0, int(timeout_connect))

self.connect_retry_attempts = max(1, int(connect_retry_attempts))

self.connect_retry_interval_ms = max(0, int(connect_retry_interval_ms))

self.ping_interval = ping_interval

self.ping_timeout = ping_timeout

self.getHelloInfo = get_hello_info

self.storage = storage

self.connect_task = None

self.connect_result = None

self.connection = None

self.input_connection = None

self.handler_tasks = set()

self.callbacks = {}

self.futures = {}

self._power_state = {}

self._current_appId = None

self._muted = None

self._volume = None

self._current_channel = None

self._channel_info = None

self._channels = None

self._apps = {}

self._extinputs = {}

self._system_info = None

self._software_info = None

self._hello_info = None

self._calibration_info = {}

self._ssl_context = None

self._sound_output = None

self._picture_settings = None

self.state_update_callbacks = []

self.doStateUpdate = False

self._volume_step_lock = asyncio.Lock()

self._volume_step_delay = (

timedelta(milliseconds=volume_step_delay_ms)

if volume_step_delay_ms is not None

else None

)

self.states = (set(states) if isinstance(states, list) else set())

if calibration_info and isinstance(calibration_info, dict):

if "lut3d" in calibration_info and calibration_info["lut3d"] in LUT3D_SIZES:

self._calibration_info['lut3d'] = LUT3D_SIZES[calibration_info["lut3d"]]

if "dovi" in calibration_info and calibration_info["dovi"] in DV_CONFIG_TYPES:

self._calibration_info['dovi'] = DV_CONFIG_TYPES[calibration_info["dovi"]]

if not without_ssl:

self._ssl_context = ssl.create_default_context()

self._ssl_context.check_hostname = False

self._ssl_context.verify_mode = ssl.CERT_NONE

# Load custom manifest from JSON file if provided

if manifest_file_path:

try:

with open(manifest_file_path, 'r', encoding="utf-8") as f:

self.manifest = json.load(f)

except Exception as e:

print(f"Error loading manifest file, using default instead: {e}")

if pairing_type:

if pairing_type in PAIRING_TYPES:

self.pairing_type = pairing_type

else:

print(f"Invalid pairing_type, using default instead.")

@classmethod

async def create(cls, *args, **kwargs):

client = cls(*args, **kwargs)

await client.async_init()

return client

async def async_init(self):

"""Load client key from storage if it's required."""

if self.client_key is None:

if self.storage is None:

self.storage = await StorageSqliteDict.create(self.key_file_path)

elif not isinstance(self.storage, StorageProto):

raise PyLGTVCmdException("Storage is not a StorageProto class.")

self.client_key = await self.storage.get_key(self.ip)

async def get_storage(self):

return self.storage

async def connect(self):

if not self.is_connected():

self.connect_result = asyncio.Future()

self.connect_task = asyncio.create_task(self.connect_handler(self.connect_result))

return await self.connect_result

async def disconnect(self):

if self.is_connected():

self.connect_task.cancel()

try:

await self.connect_task

except asyncio.CancelledError:

pass

def is_registered(self):

"""Paired with the tv."""

return self.client_key is not None

def is_connected(self):

return self.connect_task is not None and not self.connect_task.done()

def registration_msg(self):

return {

"type": "register",

"id": "register_0",

"payload": {

"client-key": self.client_key,

"forcePairing": False,

"manifest": self.manifest,

"pairingType": self.pairing_type,

},

}

async def connect_handler(self, res):

ws = None

try:

# Try connecting up to 5 times to mitigate transient timeouts

for attempt in range(self.connect_retry_attempts):

try:

ws = await asyncio.wait_for(

websockets.connect(

f"{self.proto}://{self.ip}:{self.port}",

ping_interval=None,

close_timeout=self.timeout_connect,

max_size=None,

ssl=self._ssl_context,

),

timeout=self.timeout_connect,

)

break

except asyncio.TimeoutError as ex:

if attempt < self.connect_retry_attempts - 1:

await asyncio.sleep(self.connect_retry_interval_ms / 1000)

print(f"Connection attempt: {attempt + 2}")

continue

else:

raise

if self.getHelloInfo:

# send hello

await ws.send(json.dumps({"id": "hello", "type": "hello"}))

raw_response = await ws.recv()

response = json.loads(raw_response)

if response["type"] == "hello":

self._hello_info = response["payload"]

else:

raise PyLGTVPairException("Unable to say hello")

# send registration

await ws.send(json.dumps(self.registration_msg()))

raw_response = await ws.recv()

response = json.loads(raw_response)

if response["type"] == "response" and response["payload"]["pairingType"] in [PAIRING_TYPES[0], PAIRING_TYPES[2]]:

raw_response = await ws.recv()

response = json.loads(raw_response)

if response["type"] == "registered":

self.client_key = response["payload"]["client-key"]

await self.storage.set_key(self.ip, self.client_key)

elif response["type"] == "response" and response["payload"]["pairingType"] in [PAIRING_TYPES[1], PAIRING_TYPES[3]]:

pin = input("Enter PIN: ")

payload = {

"type": "request",

"id": "register_1",

"uri": f"ssap://{ep.SET_PIN}",

"payload": {"pin": pin}

}

await ws.send(json.dumps(payload))

raw_response = await ws.recv()

response = json.loads(raw_response)

if response["type"] == "registered":

self.client_key = response["payload"]["client-key"]

await self.storage.set_key(self.ip, self.client_key)

if not self.client_key:

raise PyLGTVPairException("Unable to pair")

self.handler_tasks.add(asyncio.create_task(self.consumer_handler(ws)))

if self.ping_interval is not None and self.ping_timeout is not None:

self.handler_tasks.add(asyncio.create_task(self.ping_handler(ws)))

self.connection = ws

if self.states:

selectedStates = self.states

# set static states, possible values: ["system_info", "software_info"]

staticStates = selectedStates.intersection(self.STATIC_STATES)

if staticStates:

# e.g.: [self._system_info] = await asyncio.gather(self.get_system_info())

for stateElem in staticStates:

stateResult = await asyncio.gather(getattr(self, f'get_{stateElem}')())

setattr(self, f'_{stateElem}', (stateResult or [None])[0])

selectedStates.remove(stateElem)

# subscribe to state updates, avoid partial updates during initial subscription

# possible values: ["power", "current_app", "muted", "volume", "apps", "inputs",

#                   "sound_output", "picture_settings"]

subscribe_coros = set()

if selectedStates:

# e.g.: subscribe_coros.add(self.subscribe_power(self.set_power_state))

for stateElem in selectedStates:

subscriber = f'subscribe_{stateElem}'

setter = f'set_{stateElem}_state'

if callable(getattr(self, subscriber, None)) and callable(getattr(self, setter, None)):

subscribe_coros.add(getattr(self, subscriber)(getattr(self, setter)))

if subscribe_coros:

subscribe_tasks = set()

for coro in subscribe_coros:

subscribe_tasks.add(asyncio.create_task(coro))

await asyncio.wait(subscribe_tasks)

for task in subscribe_tasks:

try:

task.result()

except (PyLGTVCmdError, PyLGTVServiceNotFoundError):

pass

# set placeholder power state if not available

if not self._power_state:

self._power_state = {"state": "Unknown"}

self.doStateUpdate = True

if self.state_update_callbacks:

await self.do_state_update_callbacks()

res.set_result(True)

await asyncio.wait(self.handler_tasks, return_when=asyncio.FIRST_COMPLETED)

except Exception as ex:

if not res.done():

res.set_exception(ex)

finally:

for task in self.handler_tasks:

if not task.done():

task.cancel()

for future in self.futures.values():

future.cancel()

closeout = set()

closeout.update(self.handler_tasks)

if ws is not None:

closeout.add(asyncio.create_task(ws.close()))

if self.input_connection is not None:

closeout.add(asyncio.create_task(self.input_connection.close()))

for callback in self.state_update_callbacks:

closeout.add(callback(self))

if closeout:

closeout_task = asyncio.create_task(asyncio.wait(closeout))

while not closeout_task.done():

try:

await asyncio.shield(closeout_task)

except asyncio.CancelledError:

pass

self.connection = None

self.input_connection = None

self.connect_task = None

self.connect_result = None

self.handler_tasks = set()

self.callbacks = {}

self.futures = {}

self.state_update_callbacks = []

self.doStateUpdate = False

self._power_state = {}

self._current_appId = None

self._muted = None

self._volume = None

self._current_channel = None

self._channel_info = None

self._channels = None

self._apps = {}

self._extinputs = {}

self._system_info = None

self._software_info = None

self._hello_info = None

self._calibration_info = {}

self._sound_output = None

self._picture_settings = None

async def ping_handler(self, ws):

try:

while True:

await asyncio.sleep(self.ping_interval)

if self.is_on:

ping_waiter = await ws.ping()

await asyncio.wait_for(ping_waiter, timeout=self.ping_timeout)

except (

asyncio.TimeoutError,

asyncio.CancelledError,

websockets.exceptions.ConnectionClosedError,

websockets.exceptions.ConnectionClosedOK,

):

pass

async def callback_handler(self, queue, callback, future):

try:

while True:

msg = await queue.get()

payload = msg.get("payload")

await callback(payload)

if future is not None and not future.done():

future.set_result(msg)

except asyncio.CancelledError:

pass

async def consumer_handler(self, ws):

callback_queues = {}

callback_tasks = {}

try:

async for raw_msg in ws:

if self.callbacks or self.futures:

msg = json.loads(raw_msg)

uid = msg.get("id")

callback = self.callbacks.get(uid)

future = self.futures.get(uid)

if callback is not None:

if uid not in callback_tasks:

queue = asyncio.Queue()

callback_queues[uid] = queue

callback_tasks[uid] = asyncio.create_task(

self.callback_handler(queue, callback, future)

)

callback_queues[uid].put_nowait(msg)

elif future is not None and not future.done():

self.futures[uid].set_result(msg)

except (

asyncio.CancelledError,

websockets.exceptions.ConnectionClosedError,

websockets.exceptions.ConnectionClosedOK,

):

pass

finally:

for task in callback_tasks.values():

if not task.done():

task.cancel()

tasks = set()

tasks.update(callback_tasks.values())

if tasks:

closeout_task = asyncio.create_task(asyncio.wait(tasks))

while not closeout_task.done():

try:

await asyncio.shield(closeout_task)

except asyncio.CancelledError:

pass

def __output_result(self, res, jsonOutput=False, sortKeys=True, indent=4):

"""Output result as it is (e.g. dictionary) or JSON string."""

if jsonOutput:

return json.dumps(res, sort_keys=sortKeys, indent=indent)

else:

return res

# manage state

@property

def power_state(self):

return self._power_state

@property

def current_appId(self):

return self._current_appId

@property

def muted(self):

return self._muted

@property

def volume(self):

return self._volume

@property

def current_channel(self):

return self._current_channel

@property

def channel_info(self):

return self._channel_info

@property

def channels(self):

return self._channels

@property

def apps(self):

return self._apps

@property

def inputs(self):

return self._extinputs

@property

def system_info(self):

return self._system_info

@property

def software_info(self):

return self._software_info

@property

def hello_info(self):

return self._hello_info

@property

def calibration_info(self):

return self._calibration_info

@property

def sound_output(self):

return self._sound_output

@property

def picture_settings(self):

return self._picture_settings

@property

def is_on(self):

state = self._power_state.get("state")

if state == "Unknown":

# fallback to current app id for some older webos versions which don't support explicit power state

if self._current_appId in [None, ""]:

return False

else:

return True

elif state in [None, "Power Off", "Suspend", "Active Standby"]:

return False

else:

return True

@property

def is_screen_on(self):

if self.is_on:

return self._power_state.get("state") != "Screen Off"

return False

async def register_state_update_callback(self, callback):

self.state_update_callbacks.append(callback)

if self.doStateUpdate:

await callback(self)

def unregister_state_update_callback(self, callback):

if callback in self.state_update_callbacks:

self.state_update_callbacks.remove(callback)

def clear_state_update_callbacks(self):

self.state_update_callbacks = []

async def print(self, message):

print(message)

async def sleep(self, seconds):

await asyncio.sleep(seconds)

async def do_state_update_callbacks(self):

callbacks = set()

for callback in self.state_update_callbacks:

callbacks.add(callback(self))

if callbacks:

await asyncio.gather(*callbacks)

async def set_power_state(self, payload):

self._power_state = {"state": payload.get("state", "Unknown")}

if not self.is_on:

await self.disconnect()

elif self.state_update_callbacks and self.doStateUpdate:

await self.do_state_update_callbacks()

async def set_current_app_state(self, appId):

"""Set current app state variable.  This function also handles subscriptions to current channel and channel list, since the current channel subscription can only succeed when Live TV is running, and the channel list subscription can only succeed after channels have been configured."""

self._current_appId = appId

if self._channels is None:

try:

await self.subscribe_channels(self.set_channels_state)

except PyLGTVCmdException:

pass

if appId == "com.webos.app.livetv" and self._current_channel is None:

try:

await self.subscribe_current_channel(self.set_current_channel_state)

except PyLGTVCmdException:

pass

if self.state_update_callbacks and self.doStateUpdate:

await self.do_state_update_callbacks()

async def set_muted_state(self, muted):

self._muted = muted

if self.state_update_callbacks and self.doStateUpdate:

await self.do_state_update_callbacks()

async def set_volume_state(self, volume):

self._volume = volume

if self.state_update_callbacks and self.doStateUpdate:

await self.do_state_update_callbacks()

async def set_channels_state(self, channels):

self._channels = channels

if self.state_update_callbacks and self.doStateUpdate:

await self.do_state_update_callbacks()

async def set_current_channel_state(self, channel):

"""Set current channel state variable.  This function also handles the channel info subscription, since that call may fail if channel information is not available when it's called."""

self._current_channel = channel

if self._channel_info is None:

try:

await self.subscribe_channel_info(self.set_channel_info_state)

except PyLGTVCmdException:

pass

if self.state_update_callbacks and self.doStateUpdate:

await self.do_state_update_callbacks()

async def set_channel_info_state(self, channel_info):

self._channel_info = channel_info

if self.state_update_callbacks and self.doStateUpdate:

await self.do_state_update_callbacks()

async def set_apps_state(self, payload):

apps = payload.get("launchPoints")

if apps is not None:

self._apps = {}

for app in apps:

self._apps[app["id"]] = app

else:

change = payload["change"]

app_id = payload["id"]

if change == "removed":

del self._apps[app_id]

else:

self._apps[app_id] = payload

if self.state_update_callbacks and self.doStateUpdate:

await self.do_state_update_callbacks()

async def set_inputs_state(self, extinputs):

self._extinputs = {}

for extinput in extinputs:

self._extinputs[extinput["appId"]] = extinput

if self.state_update_callbacks and self.doStateUpdate:

await self.do_state_update_callbacks()

async def set_sound_output_state(self, sound_output):

self._sound_output = sound_output

if self.state_update_callbacks and self.doStateUpdate:

await self.do_state_update_callbacks()

async def set_picture_settings_state(self, picture_settings):

if isinstance(self._picture_settings, dict) and isinstance(picture_settings, dict):

self._picture_settings.update(picture_settings)

else:

self._picture_settings = picture_settings

if self.state_update_callbacks and self.doStateUpdate:

await self.do_state_update_callbacks()

# low level request handling

async def command(self, request_type, uri, payload=None, uid=None):

"""Build and send a command."""

if uid is None:

uid = self.command_count

self.command_count += 1

if payload is None:

payload = {}

message = {

"id": uid,

"type": request_type,

"uri": f"ssap://{uri}",

"payload": payload,

}

if self.connection is None:

raise PyLGTVCmdException("Not connected, can't execute command.")

await self.connection.send(json.dumps(message))

async def request(self, uri, payload=None, cmd_type="request", uid=None):

"""Send a request and wait for response."""

if uid is None:

uid = self.command_count

self.command_count += 1

res = asyncio.Future()

self.futures[uid] = res

try:

await self.command(cmd_type, uri, payload, uid)

except (asyncio.CancelledError, PyLGTVCmdException):

del self.futures[uid]

raise

try:

response = await res

except asyncio.CancelledError:

if uid in self.futures:

del self.futures[uid]

raise

del self.futures[uid]

payload = response.get("payload")

if payload is None:

raise PyLGTVCmdException(f"Invalid request response {response}")

returnValue = payload.get("returnValue") or payload.get("subscribed")

if response.get("type") == "error":

error = response.get("error")

if error == "404 no such service or method":

raise PyLGTVServiceNotFoundError(error)

else:

raise PyLGTVCmdError(response)

elif returnValue is None:

raise PyLGTVCmdException(f"Invalid request response {response}")

elif not returnValue:

raise PyLGTVCmdException(f"Request failed with response {response}")

return payload

async def subscribe(self, callback, uri, payload=None):

"""Subscribe to updates."""

uid = self.command_count

self.command_count += 1

self.callbacks[uid] = callback

try:

return await self.request(

uri, payload=payload, cmd_type="subscribe", uid=uid

)

except Exception:

del self.callbacks[uid]

raise

async def input_command(self, message):

inputws = None

try:

# open additional connection needed to send button commands

# the url is dynamically generated and returned from the ep.INPUT_SOCKET

# endpoint on the main connection

if self.input_connection is None:

sockres = await self.request(ep.INPUT_SOCKET)

inputsockpath = sockres.get("socketPath")

# Try connecting up to 5 times to mitigate transient timeouts

for attempt in range(self.connect_retry_attempts):

try:

inputws = await asyncio.wait_for(

websockets.connect(

inputsockpath,

ping_interval=None,

close_timeout=self.timeout_connect,

ssl=self._ssl_context,

),

timeout=self.timeout_connect,

)

break

except asyncio.TimeoutError as ex:

if attempt < self.connect_retry_attempts - 1:

await asyncio.sleep(self.connect_retry_interval_ms / 1000)

print(f"Connection attempt: {attempt + 2}")

continue

else:

raise

if self.ping_interval is not None and self.ping_timeout is not None:

self.handler_tasks.add(asyncio.create_task(self.ping_handler(inputws)))

self.input_connection = inputws

if self.input_connection is None:

raise PyLGTVCmdException("Couldn't execute input command.")

await self.input_connection.send(message)

except Exception as ex:

if not self.connect_result.done():

self.connect_result.set_exception(ex)

# high level request handling

async def button(self, name, checkValid=True):

"""Send button press command."""

if checkValid and str(name) not in btn.BUTTONS:

raise ValueError(

f"button {name} is not valid, use checkValid=False to try a new one"

)

message = f"type:button\nname:{name}\n\n"

await self.input_command(message)

async def move(self, dx, dy, down=0):

"""Send cursor move command."""

message = f"type:move\ndx:{dx}\ndy:{dy}\ndown:{down}\n\n"

await self.input_command(message)

async def click(self):

"""Send cursor click command."""

message = f"type:click\n\n"

await self.input_command(message)

async def scroll(self, dx, dy):

"""Send scroll command."""

message = f"type:scroll\ndx:{dx}\ndy:{dy}\n\n"

await self.input_command(message)

async def send_message(self, message, icon_path=None):

"""Show a floating message."""

icon_encoded_string = ""

icon_extension = ""

if icon_path is not None:

icon_extension = os.path.splitext(icon_path)[1][1:]

with open(icon_path, "rb") as icon_file:

icon_encoded_string = base64.b64encode(icon_file.read()).decode("ascii")

return await self.request(

ep.SHOW_MESSAGE,

{

"message": message,

"iconData": icon_encoded_string,

"iconExtension": icon_extension,

},

)

async def get_power_state(self):

"""Get current power state."""

return await self.request(ep.GET_POWER_STATE)

async def subscribe_power(self, callback):

"""Subscribe to current power state."""

return await self.subscribe(callback, ep.GET_POWER_STATE)

# Apps

async def get_apps(self, jsonOutput=False):

"""Return all apps."""

res = await self.request(ep.GET_APPS)

return self.__output_result(res.get("launchPoints"), jsonOutput)

async def subscribe_apps(self, callback):

"""Subscribe to changes in available apps."""

return await self.subscribe(callback, ep.GET_APPS)

async def get_apps_all(self, jsonOutput=False):

"""Return all apps, including hidden ones."""

res = await self.request(ep.GET_APPS_ALL)

return self.__output_result(res.get("apps"), jsonOutput)

async def get_current_app(self):

"""Get the current app id."""

res = await self.request(ep.GET_CURRENT_APP_INFO)

return res.get("appId")

async def subscribe_current_app(self, callback):

"""Subscribe to changes in the current app id."""

async def current_app(payload):

await callback(payload.get("appId"))

return await self.subscribe(current_app, ep.GET_CURRENT_APP_INFO)

async def launch_app(self, app):

"""Launch an app."""

return await self.request(ep.LAUNCH, {"id": app})

async def launch_app_with_params(self, app, params):

"""Launch an app with parameters."""

return await self.request(ep.LAUNCH, {"id": app, "params": params})

async def launch_app_with_content_id(self, app, contentId):

"""Launch an app with contentId."""

return await self.request(ep.LAUNCH, {"id": app, "contentId": contentId})

async def close_app(self, app):

"""Close the current app."""

return await self.request(ep.LAUNCHER_CLOSE, {"id": app})

# Services

async def get_services(self, jsonOutput=False):

"""Get all services."""

res = await self.request(ep.GET_SERVICES)

return self.__output_result(res.get("services"), jsonOutput)

async def get_software_info(self, jsonOutput=False):

"""Return the current software status."""

res = await self.request(ep.GET_SOFTWARE_INFO)

return self.__output_result(res, jsonOutput)

async def get_system_info(self, jsonOutput=False):

"""Return the system information."""

res = await self.request(ep.GET_SYSTEM_INFO)

return self.__output_result(res, jsonOutput)

async def get_hello_info(self, jsonOutput=False):

"""Return hello information."""

return self.__output_result(self._hello_info, jsonOutput)

async def get_calibration_info(self, jsonOutput=False):

"""Return calibration support information."""

self.calibration_support_info()

return self.__output_result(self._calibration_info, jsonOutput)

async def power_off(self):

"""Power off TV."""

# protect against turning tv back on if it is off

power_state = await self.get_power_state()

self._power_state = {"state": power_state.get("state", "Unknown")}

if not self.is_on:

return

# if tv is shutting down and standby+ option is not enabled,

# response is unreliable, so don't wait for one,

await self.command("request", ep.POWER_OFF)

async def power_on(self):

"""Power on TV. NOTE: this method does not work anymore on newer WebOS versions."""

return await self.request(ep.POWER_ON)

async def turn_screen_off(self, webos_ver=""):

"""Turn TV Screen off. standbyMode values: 'active' or 'passive',

passive cannot turn screen back on, need to pull TV plug.

"""

epName = f"TURN_OFF_SCREEN_WO{webos_ver}" if webos_ver else "TURN_OFF_SCREEN"

if not hasattr(ep, epName):

raise ValueError(f"there's no {epName} endpoint")

return await self.request(getattr(ep, epName), {"standbyMode": "active"})

async def turn_screen_on(self, webos_ver=""):

"""Turn TV Screen on. standbyMode values: 'active' or 'passive',

passive cannot turn screen back on, need to pull TV plug.

"""

epName = f"TURN_ON_SCREEN_WO{webos_ver}" if webos_ver else "TURN_ON_SCREEN"

if not hasattr(ep, epName):

raise ValueError(f"there's no {epName} endpoint")

return await self.request(getattr(ep, epName), {"standbyMode": "active"})

# 3D Mode

async def turn_3d_on(self):

"""Turn 3D on. NOTE: this method does not work anymore on newer WebOS versions."""

return await self.request(ep.SET_3D_ON)

async def turn_3d_off(self):

"""Turn 3D off. NOTE: this method does not work anymore on newer WebOS versions."""

return await self.request(ep.SET_3D_OFF)

# Inputs

async def get_inputs(self, jsonOutput=False):

"""Get all inputs."""

res = await self.request(ep.GET_INPUTS)

return self.__output_result(res.get("devices"), jsonOutput)

async def subscribe_inputs(self, callback):

"""Subscribe to changes in available inputs."""

async def inputs(payload):

await callback(payload.get("devices"))

return await self.subscribe(inputs, ep.GET_INPUTS)

async def get_input(self):

"""Get current input."""

return await self.get_current_app()

async def set_input(self, input):

"""Set the current input."""

return await self.request(ep.SET_INPUT, {"inputId": input})

async def take_screenshot(self):

"""Take screenshot in 960x540px JPG format.

Parameters to be used for com.webos.service.capture/executeOneShot:

method="DISPLAY", format="JPG", width=960, height=540, path="/tmp/capture.jpg"

method: DISPLAY (SCREEN), SCREEN_WITH_SOURCE_VIDEO, VIDEO, GRAPHIC, SOURCE (SCALER), BLENDED

format: BMP, JPG, PNG, RGB, RGBA, YUV422

"""

return await self.request(ep.TAKE_SCREENSHOT)

# Audio

async def get_audio_status(self):

"""Get the current audio status"""

return await self.request(ep.GET_AUDIO_STATUS)
View remainder of file in raw view

You can’t perform that action at this time.