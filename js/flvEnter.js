import flvparse from './flv/flvParse'
window.flvParse = {
    setFlv: function(uint8) {
        flvparse.setFlv(uint8);
    },
    nextTag: function() {

    }
}