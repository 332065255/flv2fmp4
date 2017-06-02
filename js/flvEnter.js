import flvparse from './flv/flvParse'
import tagdemux from './flv/tagdemux'
import mp4remux from './mp4/mp4remux'
import mp4moof from './mp4/mp4moof'
import f2m from './flv2fmp4';

let temp = new f2m();

window.flvParse = {
    mp4File: null,
    succ: null,
    // ftyp_moov:null,
    tracks: [],

    setFlv: function(uint8) {

        if (window.mp4Init) {
            temp.onInitSegment = window.mp4Init
        }
        if (window.onMediaSegment) {
            temp.onMediaSegment = window.onMediaSegment
        }
        temp.setflv(uint8.buffer);


        //用来获取moov

    },
}