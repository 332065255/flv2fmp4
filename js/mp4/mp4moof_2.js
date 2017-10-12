/*
 * Copyright (C) 2016 Bilibili. All Rights Reserved.
 *
 * @author zheng qian <xqq@xqq.im>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* eslint-disable */
import AAC from './aac-silent.js';
import Browser from '../utils/browser.js';
import MP4 from './mp4remux';
import { SampleInfo, MediaSegmentInfo, MediaSegmentInfoList } from './media-segment-info.js';

// Fragmented mp4 remuxer
class MP4Remuxer {

    constructor(config) {
        this.TAG = this.constructor.name;

        this._config = config;
        this._isLive = (config.isLive === true);

        this._dtsBase = -1;
        this._dtsBaseInited = false;
        this._audioDtsBase = Infinity;
        this._videoDtsBase = Infinity;
        this._audioNextDts = undefined;
        this._videoNextDts = undefined;

        this._audioMeta = null;
        this._videoMeta = null;

        this._audioSegmentInfoList = new MediaSegmentInfoList('audio');
        this._videoSegmentInfoList = new MediaSegmentInfoList('video');

        this._onInitSegment = null;
        this._onMediaSegment = null;

        // Workaround for chrome < 50: Always force first sample as a Random Access Point in media segment
        // see https://bugs.chromium.org/p/chromium/issues/detail?id=229412
        this._forceFirstIDR = !!((Browser.chrome &&
            (Browser.version.major < 50 ||
                (Browser.version.major === 50 && Browser.version.build < 2661))));

        // Workaround for IE11/Edge: Fill silent aac frame after keyframe-seeking
        // Make audio beginDts equals with video beginDts, in order to fix seek freeze
        this._fillSilentAfterSeek = (Browser.msedge || Browser.msie);
    }

    destroy() {
        this._dtsBase = -1;
        this._dtsBaseInited = false;
        this._audioMeta = null;
        this._videoMeta = null;
        this._audioSegmentInfoList.clear();
        this._audioSegmentInfoList = null;
        this._videoSegmentInfoList.clear();
        this._videoSegmentInfoList = null;
        this._onInitSegment = null;
        this._onMediaSegment = null;
    }

    bindDataSource(producer) {
        producer.onDataAvailable = this.remux.bind(this);
        producer.onTrackMetadata = this._onTrackMetadataReceived.bind(this);
        return this;
    }

    /* prototype: function onInitSegment(type: string, initSegment: ArrayBuffer): void
       InitSegment: {
           type: string,
           data: ArrayBuffer,
           codec: string,
           container: string
       }
    */
    get onInitSegment() {
        return this._onInitSegment;
    }

    set onInitSegment(callback) {
        this._onInitSegment = callback;
    }

    /* prototype: function onMediaSegment(type: string, mediaSegment: MediaSegment): void
       MediaSegment: {
           type: string,
           data: ArrayBuffer,
           sampleCount: int32
           info: MediaSegmentInfo
       }
    */
    get onMediaSegment() {
        return this._onMediaSegment;
    }

    set onMediaSegment(callback) {
        this._onMediaSegment = callback;
    }

    insertDiscontinuity() {
        this._audioNextDts = this._videoNextDts = undefined;
    }

    seek(originalDts) {
        this._videoSegmentInfoList.clear();
        this._audioSegmentInfoList.clear();
    }

    remux(audioTrack, videoTrack) {
        if (!this._onMediaSegment) {
            throw new IllegalStateException('MP4Remuxer: onMediaSegment callback must be specificed!');
        }
        if (!this._dtsBaseInited) {
            this._calculateDtsBase(audioTrack, videoTrack);
        }
        this._remuxVideo(videoTrack);
        this._remuxAudio(audioTrack);
    }

    _onTrackMetadataReceived(type, metadata) {
        let metabox = null;

        if (type === 'audio') {
            this._audioMeta = metadata;
            metabox = MP4.generateInitSegment(metadata);
            Log.v('msg+audio', metadata);
        } else if (type === 'video') {
            this._videoMeta = metadata;
            metabox = MP4.generateInitSegment(metadata);
            Log.v('msg+video', metadata);
        } else {
            return;
        }

        // dispatch metabox (Initialization Segment)
        if (!this._onInitSegment) {
            throw new IllegalStateException('MP4Remuxer: onInitSegment callback must be specified!');
        }
        this._onInitSegment(type, {
            type,
            data: metabox.buffer,
            codec: metadata.codec,
            container: `${type}/mp4`
        });
    }

    _calculateDtsBase(audioTrack, videoTrack) {
        if (this._dtsBaseInited) {
            return;
        }

        if (audioTrack.samples && audioTrack.samples.length) {
            this._audioDtsBase = audioTrack.samples[0].dts;
        }
        if (videoTrack.samples && videoTrack.samples.length) {
            this._videoDtsBase = videoTrack.samples[0].dts;
        }

        this._dtsBase = Math.min(this._audioDtsBase, this._videoDtsBase);
        this._dtsBaseInited = true;
    }

    _remuxAudio(audioTrack) {
        if(this._audioMeta==null){
            return;
        }else{
            console.log('this._audioMeta.refSampleDuration',this._audioMeta)
        }
        let track = audioTrack;
        let samples = track.samples;
        let dtsCorrection=undefined;
        let firstDts = -1,
            lastDts = -1,
            lastPts = -1;

        let remuxSilentFrame = false;
        let silentFrameDuration = -1;
        let refSampleDuration = this._audioMeta.refSampleDuration;
        if (!samples || samples.length === 0) {
            return;
        }

        let bytes = 8 + track.length;
        let mdatbox = new Uint8Array(bytes);
        mdatbox[0] = (bytes >>> 24) & 0xFF;
        mdatbox[1] = (bytes >>> 16) & 0xFF;
        mdatbox[2] = (bytes >>> 8) & 0xFF;
        mdatbox[3] = (bytes) & 0xFF;

        mdatbox.set(MP4.types.mdat, 4);

        let offset = 8; // size + type
        const mp4Samples = [];

        while (samples.length) {
            const aacSample = samples.shift();
            const unit = aacSample.unit;
            const originalDts = aacSample.dts - this._dtsBase;

            if (dtsCorrection == undefined) {
                if (this._audioNextDts == undefined) {
                    if (this._audioSegmentInfoList.isEmpty()) {
                        dtsCorrection = 0;
                        if (this._fillSilentAfterSeek && !this._videoSegmentInfoList.isEmpty()) {
                            remuxSilentFrame = true;
                        }
                    } else {
                        const lastSample = this._audioSegmentInfoList.getLastSampleBefore(originalDts);
                        if (lastSample != null) {
                            let distance = (originalDts - (lastSample.originalDts + lastSample.duration));
                            if (distance <= 3) {
                                distance = 0;
                            }
                            const expectedDts = lastSample.dts + lastSample.duration + distance;
                            dtsCorrection = originalDts - expectedDts;
                        } else { // lastSample == null
                            dtsCorrection = 0;
                        }
                    }
                } else {
                    dtsCorrection = originalDts - this._audioNextDts;
                }
            }

            let dts = originalDts - dtsCorrection;
            if (remuxSilentFrame) {
                // align audio segment beginDts to match with current video segment's beginDts
                const videoSegment = this._videoSegmentInfoList.getLastSegmentBefore(originalDts);
                if (videoSegment != null && videoSegment.beginDts < dts) {
                    silentFrameDuration = dts - videoSegment.beginDts;
                    dts = videoSegment.beginDts;
                } else {
                    remuxSilentFrame = false;
                }
            }
            if (firstDts === -1) {
                firstDts = dts;
            }

            if (remuxSilentFrame) {
                remuxSilentFrame = false;
                samples.unshift(aacSample);

                const frame = this._generateSilentAudio(dts, silentFrameDuration);
                if (frame == null) {
                    continue;
                }
                const mp4Sample = frame.mp4Sample;
                const unit = frame.unit;

                mp4Samples.push(mp4Sample);

                // re-allocate mdatbox buffer with new size, to fit with this silent frame
                bytes += unit.byteLength;
                mdatbox = new Uint8Array(bytes);
                mdatbox[0] = (bytes >>> 24) & 0xFF;
                mdatbox[1] = (bytes >>> 16) & 0xFF;
                mdatbox[2] = (bytes >>> 8) & 0xFF;
                mdatbox[3] = (bytes) & 0xFF;
                mdatbox.set(MP4.types.mdat, 4);

                // fill data now
                mdatbox.set(unit, offset);
                offset += unit.byteLength;
                continue;
            }

            let sampleDuration = 0;

            if (samples.length >= 1) {
                const nextDts = samples[0].dts - this._dtsBase - dtsCorrection;
                sampleDuration = nextDts - dts;
            } else {
                if (mp4Samples.length >= 1) { // use second last sample duration
                    sampleDuration = mp4Samples[mp4Samples.length - 1].duration;
                } else { // the only one sample, use reference sample duration
                    sampleDuration = this._audioMeta.refSampleDuration;
                }
            }

            const mp4Sample = {
                dts,
                pts: dts,
                cts: 0,
                size: unit.byteLength,
                duration: sampleDuration,
                originalDts,
                flags: {
                    isLeading: 0,
                    dependsOn: 1,
                    isDependedOn: 0,
                    hasRedundancy: 0
                }
            };
            mp4Samples.push(mp4Sample);
            mdatbox.set(unit, offset);
            offset += unit.byteLength;
        }
        const latest = mp4Samples[mp4Samples.length - 1];
        lastDts = latest.dts + latest.duration;
        this._audioNextDts = lastDts;

        // fill media segment info & add to info list
        const info = new MediaSegmentInfo();
        info.beginDts = firstDts;
        info.endDts = lastDts;
        info.beginPts = firstDts;
        info.endPts = lastDts;
        info.originalBeginDts = mp4Samples[0].originalDts;
        info.originalEndDts = latest.originalDts + latest.duration;
        info.firstSample = new SampleInfo(mp4Samples[0].dts,
            mp4Samples[0].pts,
            mp4Samples[0].duration,
            mp4Samples[0].originalDts,
            false);
        info.lastSample = new SampleInfo(latest.dts,
            latest.pts,
            latest.duration,
            latest.originalDts,
            false);
        if (!this._isLive) {
            this._audioSegmentInfoList.append(info);
        }

        track.samples = mp4Samples;
        track.sequenceNumber += track.addcoefficient;

        const moofbox = MP4.moof(track, firstDts);
        track.samples = [];
        track.length = 0;

        this._onMediaSegment('audio', {
            type: 'audio',
            data: this._mergeBoxes(moofbox, mdatbox).buffer,
            sampleCount: mp4Samples.length,
            info
        });
    }

    _generateSilentAudio(dts, frameDuration) {
        Log.v(this.TAG, `GenerateSilentAudio: dts = ${dts}, duration = ${frameDuration}`);

        const unit = AAC.getSilentFrame(this._audioMeta.channelCount);
        if (unit == null) {
            Log.w(this.TAG, `Cannot generate silent aac frame for channelCount = ${this._audioMeta.channelCount}`);
            return null;
        }

        const mp4Sample = {
            dts,
            pts: dts,
            cts: 0,
            size: unit.byteLength,
            duration: frameDuration,
            originalDts: dts,
            flags: {
                isLeading: 0,
                dependsOn: 1,
                isDependedOn: 0,
                hasRedundancy: 0
            }
        };

        return {
            unit,
            mp4Sample
        };
    }

    _remuxVideo(videoTrack) {
        const track = videoTrack;
        const samples = track.samples;
        let dtsCorrection;
        let firstDts = -1,
            lastDts = -1;
        let firstPts = -1,
            lastPts = -1;

        if (!samples || samples.length === 0) {
            return;
        }

        const bytes = 8 + videoTrack.length;
        const mdatbox = new Uint8Array(bytes);
        mdatbox[0] = (bytes >>> 24) & 0xFF;
        mdatbox[1] = (bytes >>> 16) & 0xFF;
        mdatbox[2] = (bytes >>> 8) & 0xFF;
        mdatbox[3] = (bytes) & 0xFF;
        mdatbox.set(MP4.types.mdat, 4);

        let offset = 8;
        const mp4Samples = [];
        const info = new MediaSegmentInfo();

        while (samples.length) {
            const avcSample = samples.shift();
            const keyframe = avcSample.isKeyframe;
            const originalDts = avcSample.dts - this._dtsBase;

            if (dtsCorrection == undefined) {
                if (this._videoNextDts == undefined) {
                    if (this._videoSegmentInfoList.isEmpty()) {
                        dtsCorrection = 0;
                    } else {
                        const lastSample = this._videoSegmentInfoList.getLastSampleBefore(originalDts);
                        if (lastSample != null) {
                            let distance = (originalDts - (lastSample.originalDts + lastSample.duration));
                            if (distance <= 3) {
                                distance = 0;
                            }
                            const expectedDts = lastSample.dts + lastSample.duration + distance;
                            dtsCorrection = originalDts - expectedDts;
                        } else { // lastSample == null
                            dtsCorrection = 0;
                        }
                    }
                } else {
                    dtsCorrection = originalDts - this._videoNextDts;
                }
            }

            const dts = originalDts - dtsCorrection;
            const cts = avcSample.cts;
            const pts = dts + cts;

            if (firstDts === -1) {
                firstDts = dts;
                firstPts = pts;
            }

            // fill mdat box
            let sampleSize = 0;
            while (avcSample.units.length) {
                const unit = avcSample.units.shift();
                const data = unit.data;
                mdatbox.set(data, offset);
                offset += data.byteLength;
                sampleSize += data.byteLength;
            }

            let sampleDuration = 0;

            if (samples.length >= 1) {
                const nextDts = samples[0].dts - this._dtsBase - dtsCorrection;
                sampleDuration = nextDts - dts;
            } else {
                if (mp4Samples.length >= 1) { // lastest sample, use second last duration
                    sampleDuration = mp4Samples[mp4Samples.length - 1].duration;
                } else { // the only one sample, use reference duration
                    sampleDuration = this._videoMeta.refSampleDuration;
                }
            }

            if (keyframe) {
                const syncPoint = new SampleInfo(dts, pts, sampleDuration, avcSample.dts, true);
                syncPoint.fileposition = avcSample.fileposition;
                info.appendSyncPoint(syncPoint);
            }

            const mp4Sample = {
                dts,
                pts,
                cts,
                size: sampleSize,
                isKeyframe: keyframe,
                duration: sampleDuration,
                originalDts,
                flags: {
                    isLeading: 0,
                    dependsOn: keyframe ? 2 : 1,
                    isDependedOn: keyframe ? 1 : 0,
                    hasRedundancy: 0,
                    isNonSync: keyframe ? 0 : 1
                }
            };

            mp4Samples.push(mp4Sample);
        }
        const latest = mp4Samples[mp4Samples.length - 1];
        lastDts = latest.dts + latest.duration;
        lastPts = latest.pts + latest.duration;
        this._videoNextDts = lastDts;

        // fill media segment info & add to info list
        info.beginDts = firstDts;
        info.endDts = lastDts;
        info.beginPts = firstPts;
        info.endPts = lastPts;
        info.originalBeginDts = mp4Samples[0].originalDts;
        info.originalEndDts = latest.originalDts + latest.duration;
        info.firstSample = new SampleInfo(mp4Samples[0].dts,
            mp4Samples[0].pts,
            mp4Samples[0].duration,
            mp4Samples[0].originalDts,
            mp4Samples[0].isKeyframe);
        info.lastSample = new SampleInfo(latest.dts,
            latest.pts,
            latest.duration,
            latest.originalDts,
            latest.isKeyframe);
        if (!this._isLive) {
            this._videoSegmentInfoList.append(info);
        }

        track.samples = mp4Samples;
        track.sequenceNumber += track.addcoefficient;

        // workaround for chrome < 50: force first sample as a random access point
        // see https://bugs.chromium.org/p/chromium/issues/detail?id=229412
        if (this._forceFirstIDR) {
            const flags = mp4Samples[0].flags;
            flags.dependsOn = 2;
            flags.isNonSync = 0;
        }

        const moofbox = MP4.moof(track, firstDts);
        track.samples = [];
        track.length = 0;

        this._onMediaSegment('video', {
            type: 'video',
            data: this._mergeBoxes(moofbox, mdatbox).buffer,
            sampleCount: mp4Samples.length,
            info
        });
    }

    _mergeBoxes(moof, mdat) {
        const result = new Uint8Array(moof.byteLength + mdat.byteLength);
        result.set(moof, 0);
        result.set(mdat, moof.byteLength);
        return result;
    }

}

export default MP4Remuxer;