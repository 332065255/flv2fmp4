/* eslint-disable */

import cpu from './flv2fmp4';
// var cpu=require('chimee-flv2fmp4')

const temp = new cpu();
console.log(temp);
window.flvParse = {
    mp4File: null,
    succ: null,
    // ftyp_moov:null,
    tracks: [],
    baseTime: 0,
    setFlv(uint8, baseTime) {
        if (flvParse.baseTime != baseTime) {
            flvParse.baseTime = baseTime;
            temp.seek(baseTime);
        }
        if (window.mp4Init) {
            temp.onInitSegment = window.mp4Init;
        }
        if (window.onMediaSegment) {
            temp.onMediaSegment = window.onMediaSegment;
        }
        if (window.seekCallBack) {
            // temp.seekCallBack = window.se
            temp.seekCallBack = window.seekCallBack;
        }
        if (window.onMediaInfo) {
            temp.onMediaInfo = window.onMediaInfo;
        }
        return temp.setflv(uint8.buffer, baseTime);

        // 用来获取moov

    },
    setLocFlv(uin8) {
        return temp.setflvloc(uin8);
    }
};