import flvparse from './flv/flvParse'
import tagdemux from './flv/tagdemux'
window.flvParse = {

    setFlv: function(uint8) {
        flvparse.setFlv(uint8);
        console.log(flvparse.arrTag)
            // tagdemux.parseMetadata(flvparse.arrTag[0].body);
            // // (new Uint8Array(flvparse.arrTag[1].body).buffer);
            // flvparse.arrTag[1].getTime();
            // tagdemux._parseVideoData((new Uint8Array(flvparse.arrTag[1].body).buffer), 0, flvparse.arrTag[1].body.length, flvparse.arrTag[1].time, 0);
    },
    nextTag: function() {

    }
}