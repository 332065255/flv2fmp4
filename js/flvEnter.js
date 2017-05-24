import flvparse from './flv/flvParse'
import tagdemux from './flv/tagdemux'
import mp4remux from './mp4/mp4remux'
window.flvParse = {

    setFlv: function(uint8) {
        flvparse.setFlv(uint8);
        console.log(flvparse.arrTag)
        tagdemux._onTrackMetadata = Metadata.bind(this);
        tagdemux._onMediaInfo = metaSucc.bind(this)
            // tagdemux._audioMetadata = audioMetadata.bind(this);
        tagdemux.parseMetadata(flvparse.arrTag[0].body);
        tagdemux.parseChunks(flvparse.arrTag[1])
        tagdemux.parseChunks(flvparse.arrTag[2])

    },
    nextTag: function() {

    }

}
let metas = [];

function Metadata(type, meta) {
    switch (type) {
        case 'video':
            metas.push(meta);
            break;
        case 'audio':
            metas.push(meta);
            break;
    }
}

function metaSucc(mi) {
    //console.log(mi, metas);
    let ftyp_moov = mp4remux.generateInitSegment(metas);
    console.log(ftyp_moov);
}