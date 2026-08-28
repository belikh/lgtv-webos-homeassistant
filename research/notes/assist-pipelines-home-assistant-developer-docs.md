---
title: Assist pipelines | Home Assistant Developer Docs
id: assist-pipelines-home-assistant-developer-docs
tags:
- lgtv-webos-ha-root-1a89ff
- locus-ultimate-edge-node-cec-ambient-voice-dashboard-soc-limits
created: '2026-08-28T03:01:03.796059Z'
source: https://developers.home-assistant.io/docs/voice/pipelines
source_domain: developers.home-assistant.io
fetched_at: '2026-08-28T03:01:03.792971Z'
fetch_provider: builtin
status: draft
type: note
tier: ground_truth
content_type: docs
deprecated: false
---

Assist pipelines | Home Assistant Developer Docs

Skip to main content

On this page

The Assist pipeline integration runs the common steps of a voice assistant:

Wake word detection

Speech to text

Intent recognition

Text to speech

Pipelines are run via a WebSocket API:

{

"type": "assist_pipeline/run",

"start_stage": "stt",

"end_stage": "tts",

"input": {

"sample_rate": 16000,

}

}

Example code

The following input fields are available:
NameTypeDescriptionstart_stageenumRequired. The first stage to run. One of wake_word, stt, intent, tts.end_stageenumRequired. The last stage to run. One of stt, intent, tts.inputdictDepends on start_stage:
wake_word only:
timeout - seconds before wake word detection times out (int, default: 3)
noise_suppression_level - amount of noise suppression (int, 0 = disabled, 4 = max)
auto_gain_dbfs - automatic gain (int, 0 = disabled, 31 = max)
volume_multiplier - fixed volume amplification (float, 1.0 = no change, 2.0 = twice as loud)
wake_word and stt:
sample_rate - sample rate of incoming audio (int, hertz)
wake_word_phrase - detected wake word (for example, "okay nabu") used to avoid multiple device wake-ups
intent and tts:
text - input text (string)pipelinestringOptional. ID of the pipeline (use assist_pipeline/pipeline/list to get names).conversation_idstringOptional. Unique id for conversation.device_idstringOptional. Device ID from Home Assistant's device registry of the device that is starting the pipeline.timeoutnumberOptional. Number of seconds before pipeline times out (default: 300).

Events​

As the pipeline runs, it emits events back over the WebSocket connection.
The following events can be emitted:
NameDescriptionEmittedAttributesrun-startStart of pipeline runalwayspipeline - ID of the pipeline
language - Language used for pipeline
runner_data - Extra WebSocket data:
stt_binary_handler_id is the prefix to send speech data over.
timeout is the max run time for the whole pipeline.
tts_output - TTS Output data
token - Token of the generated audio
url - URL to the generated audio
mime_type - MIME type of the generated audio
stream_response - If TTS can stream while the response is being generated.run-endEnd of pipeline runalwayswake_word-startStart of wake word detectionaudio onlyengine: wake engine used
metadata: incoming audio
timeout: seconds before wake word timeout metadatawake_word-endEnd of wake word detectionaudio onlywake_word_output - Detection result data:
wake_word_id is the id of detected wake word
timestamp is the detection time relative to start of audio stream (milliseconds, optional)stt-startStart of speech to textaudio onlyengine: STT engine used
metadata: incoming audio metadatastt-vad-startStart of voice commandaudio onlytimestamp: time relative to start of audio stream (milliseconds)stt-vad-endEnd of voice commandaudio onlytimestamp: time relative to start of audio stream (milliseconds)stt-endEnd of speech to textaudio onlystt_output - Object with text, the detected text.intent-startStart of intent recognitionalwaysengine - Agent engine used
language: Processing language.
intent_input - Input text to agentintent-progressIntermediate update of intent recognitiondepending on conversation agentchat_log_delta - optional, delta object from the chat log
tts_start_streaming - optional, True if TTS streaming has startedintent-endEnd of intent recognitionalwaysintent_output - conversation responsetts-startStart of text to speechaudio onlyengine - TTS engine used
language: Output language.
voice: Output voice.
tts_input: Text to speak.tts-endEnd of text to speechaudio onlytoken - Token of the generated audio
url - URL to the generated audio
mime_type - MIME type of the generated audio
errorError in pipelineon errorcode - Error code (see below)
message - Error message

Error codes​

The following codes are returned from the pipeline error event:

wake-engine-missing - No wake word engine is installed

wake-provider-missing - Configured wake word provider is not available

wake-stream-failed - Unexpected error during wake word detection

wake-word-timeout - Wake word was not detected within timeout

stt-provider-missing - Configured speech-to-text provider is not available

stt-provider-unsupported-metadata - Speech-to-text provider does not support audio format (sample rate, etc.)

stt-stream-failed - Unexpected error during speech-to-text

stt-no-text-recognized - Speech-to-text did not return a transcript

intent-not-supported - Configured conversation agent is not available

intent-failed - Unexpected error during intent recognition

tts-not-supported - Configured text-to-speech provider is not available or options are not supported

tts-failed - Unexpected error during text-to-speech

Sending speech data​

After starting a pipeline with stt as the first stage of the run and receiving a stt-start event, speech data can be sent over the WebSocket connection as binary data. Audio should be sent as soon as it is available, with each chunk prefixed with a byte for the stt_binary_handler_id.

For example, if stt_binary_handler_id is 1 and the audio chunk is a1b2c3, the message would be (in hex):

stt_binary_handler_id

||

01a1b2c3

||||||

audio

To indicate the end of sending speech data, send a binary message containing a single byte with the stt_binary_handler_id.

Wake word detection​

When start_stage is set to wake_word, the pipeline will not run until a wake word has been detected. Clients should avoid unnecessary audio streaming by using a local voice activity detector (VAD) to only start streaming when human speech is detected.

For wake_word, the input object should contain a timeout float value. This is the number of seconds of silence before the pipeline will time out during wake word detection (error code wake-word-timeout).
If enough speech is detected by Home Assistant's internal VAD, the timeout will be continually reset.

Audio enhancements​

The following settings are available as part of the input object when start_stage is set to wake_word:

noise_suppression_level - level of noise suppression (0 = disabled, 4 = max)

auto_gain_dbfs - automatic gain control (0 = disabled, 31 = max)

volume_multiplier - audio samples multiplied by constant (1.0 = no change, 2.0 = twice as loud)

If your device's microphone is fairly quiet, the recommended settings are:

noise_suppression_level - 2

auto_gain_dbfs - 31

volume_multiplier - 2.0

Increasing noise_suppression_level or volume_multiplier may cause audio distortion.

Events
Error codes
Sending speech data
Wake word detection
Audio enhancements