import flvparse from './flv/flvParse'
import tagdemux from './flv/tagdemux'
window.flvParse = {
    setFlv: function(uint8) {
        flvparse.setFlv(uint8);
        tagdemux.parseMetadata(flvparse.arrTag[0].body);
    },
    nextTag: function() {

    }
}