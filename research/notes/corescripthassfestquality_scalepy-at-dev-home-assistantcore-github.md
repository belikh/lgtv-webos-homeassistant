---
title: core/script/hassfest/quality_scale.py at dev · home-assistant/core · GitHub
id: corescripthassfestquality_scalepy-at-dev-home-assistantcore-github
tags:
- lgtv-webos-ha-root-1a89ff
created: '2026-08-28T02:13:18.430441Z'
source: https://github.com/home-assistant/core/blob/dev/script/hassfest/quality_scale.py
source_domain: github.com
fetched_at: '2026-08-28T02:13:18.428368Z'
fetch_provider: builtin
status: draft
type: note
tier: ground_truth
content_type: code
deprecated: false
---

core/script/hassfest/quality_scale.py at dev · home-assistant/core · GitHub

Skip to content

Search/

Sign inSign up
Appearance settings

You signed in with another tab or window. Reload to refresh your session.
You signed out in another tab or window. Reload to refresh your session.
You switched accounts on another tab or window. Reload to refresh your session.

Dismiss alert

{{ message }}

Uh oh!

There was an error while loading. Please reload this page.

home-assistant

/

core

Public

Uh oh!

There was an error while loading. Please reload this page.

Notifications
You must be signed in to change notification settings

Fork
38.4k

Star
90.2k

FilesExpand file tree

dev

/
quality_scale.pyCopy path

Blame
More file actions

Blame
More file actions

Latest commit

HistoryHistory

History

2250 lines (2221 loc) · 43.3 KB

dev

/
quality_scale.pyCopy pathTop

File metadata and controls

Code

Blame

2250 lines (2221 loc) · 43.3 KB

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

"""Validate integration quality scale files."""

from dataclasses import dataclass

import voluptuous as vol

from voluptuous.humanize import humanize_error

from homeassistant.const import Platform

from homeassistant.exceptions import HomeAssistantError

from homeassistant.util.yaml import load_yaml_dict

from .model import Config, Integration, IntegrationType, ScaledQualityScaleTiers

from .quality_scale_validation import (

RuleValidationProtocol,

config_flow,

discovery,

reconfiguration_flow,

runtime_data,

strict_typing,

test_before_setup,

unique_config_entry,

)

QUALITY_SCALE_TIERS = {value.name.lower(): value for value in ScaledQualityScaleTiers}

@dataclass

class Rule:

"""Quality scale rules."""

name: str

tier: ScaledQualityScaleTiers

validator: RuleValidationProtocol | None = None

ALL_RULES = [

# BRONZE

Rule("action-setup", ScaledQualityScaleTiers.BRONZE),

Rule("appropriate-polling", ScaledQualityScaleTiers.BRONZE),

Rule("brands", ScaledQualityScaleTiers.BRONZE),

Rule("common-modules", ScaledQualityScaleTiers.BRONZE),

Rule("config-flow", ScaledQualityScaleTiers.BRONZE, config_flow),

Rule("config-flow-test-coverage", ScaledQualityScaleTiers.BRONZE),

Rule("dependency-transparency", ScaledQualityScaleTiers.BRONZE),

Rule("docs-actions", ScaledQualityScaleTiers.BRONZE),

Rule("docs-conditions", ScaledQualityScaleTiers.BRONZE),

Rule("docs-high-level-description", ScaledQualityScaleTiers.BRONZE),

Rule("docs-installation-instructions", ScaledQualityScaleTiers.BRONZE),

Rule("docs-removal-instructions", ScaledQualityScaleTiers.BRONZE),

Rule("docs-triggers", ScaledQualityScaleTiers.BRONZE),

Rule("entity-event-setup", ScaledQualityScaleTiers.BRONZE),

Rule("entity-unique-id", ScaledQualityScaleTiers.BRONZE),

Rule("has-entity-name", ScaledQualityScaleTiers.BRONZE),

Rule("runtime-data", ScaledQualityScaleTiers.BRONZE, runtime_data),

Rule("test-before-configure", ScaledQualityScaleTiers.BRONZE),

Rule("test-before-setup", ScaledQualityScaleTiers.BRONZE, test_before_setup),

Rule("unique-config-entry", ScaledQualityScaleTiers.BRONZE, unique_config_entry),

# SILVER

Rule("action-exceptions", ScaledQualityScaleTiers.SILVER),

Rule("config-entry-unloading", ScaledQualityScaleTiers.SILVER),

Rule("docs-configuration-parameters", ScaledQualityScaleTiers.SILVER),

Rule("docs-installation-parameters", ScaledQualityScaleTiers.SILVER),

Rule("entity-unavailable", ScaledQualityScaleTiers.SILVER),

Rule("integration-owner", ScaledQualityScaleTiers.SILVER),

Rule("log-when-unavailable", ScaledQualityScaleTiers.SILVER),

Rule("parallel-updates", ScaledQualityScaleTiers.SILVER),

Rule("reauthentication-flow", ScaledQualityScaleTiers.SILVER),

Rule("test-coverage", ScaledQualityScaleTiers.SILVER),

# GOLD: [

Rule("devices", ScaledQualityScaleTiers.GOLD),

Rule("diagnostics", ScaledQualityScaleTiers.GOLD),

Rule("discovery", ScaledQualityScaleTiers.GOLD, discovery),

Rule("discovery-update-info", ScaledQualityScaleTiers.GOLD),

Rule("docs-data-update", ScaledQualityScaleTiers.GOLD),

Rule("docs-examples", ScaledQualityScaleTiers.GOLD),

Rule("docs-known-limitations", ScaledQualityScaleTiers.GOLD),

Rule("docs-supported-devices", ScaledQualityScaleTiers.GOLD),

Rule("docs-supported-functions", ScaledQualityScaleTiers.GOLD),

Rule("docs-troubleshooting", ScaledQualityScaleTiers.GOLD),

Rule("docs-use-cases", ScaledQualityScaleTiers.GOLD),

Rule("dynamic-devices", ScaledQualityScaleTiers.GOLD),

Rule("entity-category", ScaledQualityScaleTiers.GOLD),

Rule("entity-device-class", ScaledQualityScaleTiers.GOLD),

Rule("entity-disabled-by-default", ScaledQualityScaleTiers.GOLD),

Rule("entity-translations", ScaledQualityScaleTiers.GOLD),

Rule("exception-translations", ScaledQualityScaleTiers.GOLD),

Rule("icon-translations", ScaledQualityScaleTiers.GOLD),

Rule("reconfiguration-flow", ScaledQualityScaleTiers.GOLD, reconfiguration_flow),

Rule("repair-issues", ScaledQualityScaleTiers.GOLD),

Rule("stale-devices", ScaledQualityScaleTiers.GOLD),

# PLATINUM

Rule("async-dependency", ScaledQualityScaleTiers.PLATINUM),

Rule("inject-websession", ScaledQualityScaleTiers.PLATINUM),

Rule("strict-typing", ScaledQualityScaleTiers.PLATINUM, strict_typing),

]

SCALE_RULES = {

tier: [rule.name for rule in ALL_RULES if rule.tier == tier]

for tier in ScaledQualityScaleTiers

}

VALIDATORS = {rule.name: rule.validator for rule in ALL_RULES if rule.validator}

RULE_URL = (

"Please check the documentation at "

"https://developers.home-assistant.io/docs/core/"

"integration-quality-scale/rules/{rule_name}/"

)

INTEGRATIONS_WITHOUT_QUALITY_SCALE_FILE = [

"abode",

"accuweather",

"acmeda",

"actiontec",

"adax",

"adguard",

"ads",

"aemet",

"aftership",

"agent_dvr",

"airly",

"airq",

"airthings",

"airthings_ble",

"airtouch4",

"airtouch5",

"airvisual",

"airvisual_pro",

"airzone",

"airzone_cloud",

"alarmdecoder",

"alert",

"alexa",

"alpha_vantage",

"amazon_polly",

"amberelectric",

"ambient_network",

"ambient_station",

"amcrest",

"analytics",

"android_ip_webcam",

"androidtv",

"anel_pwrctrl",

"anova",

"anthemav",

"aosmith",

"apache_kafka",

"apple_tv",

"apprise",

"aprilaire",

"aprs",

"apsystems",

"aquacell",

"aqualogic",

"aquostv",

"aranet",

"arcam_fmj",

"arest",

"arris_tg2492lg",

"aruba",

"arve",

"arwn",

"aseko_pool_live",

"assist_pipeline",

"asterisk_mbox",

"asuswrt",

"atag",

"atome",

"august",

"aurora",

"aurora_abb_powerone",

"aussie_broadband",

"avea",

"aws",

"axis",

"azure_data_explorer",

"azure_devops",

"azure_event_hub",

"azure_service_bus",

"backup",

"baf",

"baidu",

"balboa",

"bang_olufsen",

"bayesian",

"bbox",

"bitcoin",

"bizkaibus",

"blackbird",

"blink",

"blockchain",

"blue_current",

"bluemaestro",

"bluesound",

"bluetooth",

"bluetooth_adapters",

"bluetooth_le_tracker",

"bmw_connected_drive",

"bond",

"bosch_shc",

"braviatv",

"broadlink",

"brottsplatskartan",

"browser",

"brunt",

"bryant_evolution",

"bt_home_hub_5",

"bt_smarthub",

"bthome",

"buienradar",

"caldav",

"canary",

"cast",

"chacon_dio",

"channels",

"circuit",

"cisco_ios",

"cisco_mobility_express",

"cisco_webex_teams",

"citybikes",

"clickatell",

"clicksend",

"clicksend_tts",

"climacell",

"cloud",

"cloudflare",

"cmus",

"coinbase",

"color_extractor",

"comed_hourly_pricing",

"comfoconnect",

"command_line",

"compensation",

"concord232",

"control4",

"coolmaster",

"cppm_tracker",

"cpuspeed",

"crownstone",

"currencylayer",

"daikin",

"danfoss_air",

"datadog",

"ddwrt",

"deako",

"debugpy",

"deconz",

"decora_wifi",

"delijn",

"deluge",

"demo",

"denon",

"denonavr",

"derivative",

"devialet",

"device_sun_light_trigger",

"dexcom",

"dhcp",

"dialogflow",

"digital_ocean",

"directv",

"discogs",

"discord",

"dlink",

"dlna_dmr",

"dlna_dms",

"dnsip",

"dominos",

"doods",

"doorbird",

"dormakaba_dkey",

"downloader",

"dremel_3d_printer",

"drop_connect",

"dsmr",

"dsmr_reader",

"dublin_bus_transport",

"dunehd",

"duotecno",

"dwd_weather_warnings",

"dweet",

"dynalite",

"eafm",

"easyenergy",

"ebox",

"ebusd",

"ecoal_boiler",

"ecobee",

"ecoforest",

"econet",

"ecovacs",

"ecowitt",

"eddystone_temperature",

"edimax",

"edl21",

"efergy",

"egardia",

"eight_sleep",

"electrasmart",

"elkm1",

"elmax",

"elv",

"elvia",

"emby",

"emoncms_history",

"emonitor",

"emulated_hue",

"emulated_kasa",

"emulated_roku",

"energenie_power_sockets",

"energy",

"energyzero",

"enigma2",

"enocean",

"entur_public_transport",

"environment_canada",

"envisalink",

"ephember",

"epic_games_store",

"epion",

"epson",

"eq3btsmart",

"escea",

"etherscan",

"eufy",

"eufylife_ble",

"everlights",

"evil_genius_labs",

"evohome",

"ezviz",

"faa_delays",

"facebook",

"fail2ban",

"familyhub",

"fastdotcom",

"ffmpeg_motion",

"ffmpeg_noise",

"fibaro",

"fido",

"file",

"filesize",

"filter",

"fints",

"fireservicerota",

"firmata",

"fivem",

"fixer",

"fjaraskupan",

"fleetgo",

"flexit",

"flic",

"flipr",

"flo",

"flock",

"flume",

"flux",

"flux_led",

"folder",

"folder_watcher",

"foobot",

"forecast_solar",

"forked_daapd",

"fortios",

"foscam",

"foursquare",

"free_mobile",

"freebox",

"freedns",

"freedompro",

"fritzbox",

"fritzbox_callmonitor",

"frontier_silicon",

"fujitsu_fglair",

"fujitsu_hvac",

"futurenow",

"garadget",

"garages_amsterdam",

"gardena_bluetooth",

"gc100",

"gdacs",

"generic",

"generic_hygrostat",

"generic_thermostat",

"geniushub",

"geo_json_events",

"geo_rss_events",

"geocaching",

"geofency",

"geonetnz_quakes",

"geonetnz_volcano",

"github",

"gitlab_ci",

"glances",

"go2rtc",

"goalzero",

"gogogate2",

"goodwe",

"google_assistant",

"google_cloud",

"google_domains",

"google_generative_ai_conversation",

"google_mail",

"google_maps",

"google_pubsub",

"google_sheets",

"google_translate",

"google_travel_time",

"google_wifi",

"govee_ble",

"govee_light_local",

"gpsd",

"gpslogger",

"graphite",

"gree",

"greeneye_monitor",

"group",

"gtfs",

"guardian",

"harman_kardon_avr",

"harmony",

"hassio",

"haveibeenpwned",

"hddtemp",

"hdmi_cec",

"heatmiser",

"here_travel_time",

"hikvisioncam",

"hisense_aehw4a1",

"history_stats",

"hitron_coda",

"hive",

"hko",

"hlk_sw16",

"holiday",

"homekit",

"homekit_controller",

"homematic",

"homematicip_cloud",

"homeworks",

"honeywell",

"horizon",

"hp_ilo",

"http",

"hue",

"huisbaasje",

"hunterdouglas_powerview",

"husqvarna_automower_ble",

"hydrawise",

"hyperion",

"ialarm",

"iammeter",

"ibeacon",

"icloud",

"idteck_prox",

"ifttt",

"iglo",

"ign_sismologia",

"ihc",

"improv_ble",

"influxdb",

"inkbird",

"insteon",

"integration",

"intellifire",

"intesishome",

"ios",

"iotawatt",

"iotty",

"iperf3",

"ipma",

"ipp",

"iqvia",

"irish_rail_transport",

"isal",

"iskra",

"islamic_prayer_times",

"israel_rail",

"iss",

"isy994",

"itach",

"itunes",

"izone",

"jellyfin",

"joaoapps_join",

"juicenet",

"justnimbus",

"jvc_projector",

"kaiterra",

"kaleidescape",

"kankun",

"keba",

"keenetic_ndms2",

"kef",

"kegtron",

"keyboard",

"keyboard_remote",

"keymitt_ble",

"kira",

"kitchen_sink",

"kiwi",

"kmtronic",

"kodi",

"konnected",

"kostal_plenticore",

"kraken",

"kulersky",

"kwb",

"lacrosse",

"lacrosse_view",

"landisgyr_heat_meter",

"lannouncer",

"lastfm",

"launch_library",

"laundrify",

"ld2410_ble",

"leaone",

"led_ble",

"lektrico",

"lg_netcast",

"lg_soundbar",

"lg_thinq",

"lidarr",

"life360",

"lifx",

"lifx_cloud",

"lightwave",

"limitlessled",

"linear_garage_door",

"linkplay",

"linksys_smart",

"linode",

"linux_battery",

"litejet",

"livisi",

"llamalab_automate",

"local_calendar",

"local_file",

"local_ip",

"local_todo",

"location",

"locative",

"logi_circle",

"london_air",

"london_underground",

"lookin",

"loqed",

"luftdaten",

"lupusec",

"lutron",

"lutron_caseta",

"lw12wifi",

"lyric",

"madvr",

"mailbox",

"mailgun",

"manual",

"manual_mqtt",

"map",

"marytts",

"matrix",

"matter",

"maxcube",

"mazda",

"meater",

"medcom_ble",

"media_extractor",

"mediaroom",

"melcloud",

"melissa",

"melnor",

"meraki",

"message_bird",

"met",

"met_eireann",

"meteo_france",

"meteoalarm",

"meteoclimatic",

"metoffice",

"mfi",

"microbees",

"microsoft",

"mikrotik",

"mill",

"min_max",

"minio",

"mjpeg",

"moat",

"mobile_app",

"mochad",

"modbus",

"modem_callerid",

"modern_forms",

"moehlenhoff_alpha2",

"mold_indicator",

"monoprice",

"monzo",

"moon",

"mopeka",

"motion_blinds",

"motionblinds_ble",

"motioneye",

"mpd",

"mqtt_eventstream",

"mqtt_json",

"mqtt_room",

"mqtt_statestream",

"msteams",

"mullvad",

"mutesync",

"mvglive",

"myq",

"mysensors",

"mystrom",

"mythicbeastsdns",

"nad",

"nam",

"nanoleaf",

"nasweb",

"neato",

"nederlandse_spoorwegen",

"netdata",

"netgear",

"netgear_lte",

"netio",

"network",

"neurio_energy",

"nexia",

"nextbus",

"nextcloud",

"nfandroidtv",

"nibe_heatpump",

"nice_go",

"nightscout",

"nilu",

"nissan_leaf",

"nmap_tracker",

"nmbs",

"no_ip",

"noaa_tides",

"norway_air",

"notify_events",

"notion",

"nsw_fuel_station",

"nsw_rural_fire_service_feed",

"nuheat",

"nuki",

"numato",

"nws",

"nx584",

"nzbget",

"oasa_telematics",

"obihai",

"octoprint",

"oem",

"ohmconnect",

"ollama",

"ombi",

"omnilogic",

"oncue",

"ondilo_ico",

"onvif",

"open_meteo",

"openalpr_cloud",

"openerz",

"openexchangerates",

"opengarage",

"openhardwaremonitor",

"openhome",

"opensky",

"opentherm_gw",

"openuv",

"openweathermap",

"opnsense",

"opple",

"oralb",

"oru",

"orvibo",

"osoenergy",

"osramlightify",

"otbr",

"otp",

"ourgroceries",

"ovo_energy",

"owntracks",

"p1_monitor",

"panasonic_bluray",

"panasonic_viera",

"panel_iframe",

"peco",

"pencom",

"permobil",

"persistent_notification",

"person",

"philips_js",

"pi_hole",

"picnic",

"picotts",

"pilight",

"ping",

"pioneer",

"pjlink",

"plaato",

"plant",

"plex",

"plum_lightpad",

"pocketcasts",

"point",

"poolsense",

"powerwall",

"private_ble_device",

"profiler",

"progettihwsw",

"proliphix",

"prometheus",

"prosegur",

"prowl",

"proximity",

"ps4",

"pulseaudio_loopback",

"pure_energie",

"purpleair",

"push",

"pushbullet",

"pushover",

"pushsafer",

"pvoutput",

"pvpc_hourly_pricing",

"qbittorrent",

"qingping",

"qld_bushfire",

"qnap",

"qnap_qsw",

"qrcode",

"quantum_gateway",

"qvr_pro",

"qwikswitch",

"rabbitair",

"rachio",

"radarr",

"radio_browser",

"radiotherm",

"raincloud",

"rainforest_eagle",

"rainforest_raven",

"rainmachine",

"random",

"rapt_ble",

"raspyrfm",

"rdw",

"recollect_waste",

"recorder",

"recswitch",

"reddit",

"refoss",

"rejseplanen",

"remember_the_milk",

"remote_rpi_gpio",

"renson",

"repetier",

"rest",

"rest_command",

"rflink",

"rfxtrx",

"rhasspy",

"ridwell",

"ripple",

"risco",

"rituals_perfume_genie",

"rmvtransport",

"rocketchat",

"roku",

"romy",

"roomba",

"roon",

"route53",

"rova",

"rpi_power",

"rss_feed_template",

"rtorrent",

"rtsp_to_webrtc",

"ruckus_unleashed",

"ruuvi_gateway",

"ruuvitag_ble",

"rympro",

"saj",

"sanix",

"schluter",

"scrape",

"screenlogic",

"season",

"sendgrid",

"sense",

"sensirion_ble",

"sensorpro",

"sensorpush",

"sensoterra",

"sentry",

"senz",

"serial",

"serial_pm",

"sesame",

"seven_segments",

"seventeentrack",

"sharkiq",

"shell_command",

"shodan",

"shopping_list",

"sia",

"sigfox",

"sighthound",

"signal_messenger",

"simplefin",

"simplepush",

"simplisafe",

"simulated",

"sinch",

"sisyphus",

"sky_hub",

"sky_remote",

"skybeacon",

"skybell",

"slack",

"sleepiq",

"slide",

"slimproto",

"sma",

"smappee",

"smart_meter_texas",

"smarty",

"smhi",

"sms",

"smtp",

"snapcast",

"snmp",

"snooz",

"solaredge",

"solaredge_local",

"solax",

"soma",

"somfy_mylink",

"sonarr",

"songpal",

"sony_projector",

"soundtouch",

"spc",

"spider",

"spotify",

"sql",

"srp_energy",

"ssdp",

"starline",

"starlingbank",

"starlink",

"startca",

"statistics",

"statsd",

"steam_online",

"steamist",

"stream",

"streamlabswater",

"subaru",

"sun",

"sunweg",

"supervisord",

"supla",

"surepetcare",

"swiss_hydrological_data",

"swisscom",

"switch_as_x",

"switchbee",

"switchbot_cloud",

"switchmate",

"syncthing",

"synology_chat",

"synology_srm",

"syslog",

"system_bridge",

"systemmonitor",

"tado",

"tailscale",

"tami4",

"tank_utility",

"tapsaff",

"tasmota",

"tautulli",

"tcp",

"technove",

"ted5000",

"telegram",

"tellduslive",

"tellstick",

"telnet",

"temper",

"template",

"tesla_wall_connector",

"thermobeacon",

"thermopro",

"thethingsnetwork",

"thingspeak",

"thinkingcleaner",

"thomson",

"thread",

"threshold",

"tibber",

"tile",

"tilt_ble",

"time_date",

"tmb",

"tod",

"todoist",

"tolo",

"tomato",

"tomorrowio",

"toon",

"torque",

"touchline",

"touchline_sl",

"tplink_lte",

"traccar",

"traccar_server",

"tractive",

"tradfri",

"trafikverket_camera",

"trafikverket_ferry",

"trafikverket_train",

"trafikverket_weatherstation",

"transport_nsw",

"travisci",

"trend",

"triggercmd",

"tuya",

"twilio",

"twilio_call",

"twilio_sms",

"twinkly",

"twitch",

"twitter",

"ubus",

"uk_transport",

"ukraine_alarm",

"unifi_direct",

"universal",

"upb",

"upc_connect",

"upcloud",

"upnp",

"uptime",

"usb",

"usgs_earthquakes_feed",

"utility_meter",

"uvc",

"v2c",

"vallox",

"vasttrafik",

"venstar",

"vera",

"verisure",

"versasense",

"version",

"viaggiatreno",

"vilfo",

"vivotek",

"vizio",

"vlc_telnet",

"voicerss",

"voip",

"volkszaehler",

"volumio",

"volvooncall",

"w800rf32",

"wake_on_lan",

"wallbox",

"waqi",

"watttime",

"waze_travel_time",

"weatherflow_cloud",

"weatherkit",

"webmin",

"wemo",

"whois",

"wiffi",

"wilight",

"wirelesstag",

"withings",

"wiz",

"wmspro",

"wolflink",

"workday",

"worldclock",

"worldtidesinfo",

"worxlandroid",

"ws66i",

"wsdot",

"wyoming",

"x10",

"xeoma",

"xiaomi",

"xiaomi_aqara",

"xiaomi_ble",

"xiaomi_miio",
View remainder of file in raw view

You can’t perform that action at this time.