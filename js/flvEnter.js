import flvparse from './flv/flvParse'
import flvDemux from './flv/flvdemux'
window.flvParse = {
    setFlv: function(uint8) {
        flvparse.setFlv(uint8);
        flvDemux.parseMetadata(flvparse.arrTag[0].body);
    },
    nextTag: function() {

    }
}