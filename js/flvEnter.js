import flvparse from './flv/flvParse'
import tagdemux from './flv/tagdemux'
import mp4remux from './mp4/mp4remux'
window.flvParse = {
    mp4File: null,
    succ: null,
    setFlv: function(uint8) {
        flvparse.setFlv(uint8);
        console.log(flvparse.arrTag)
        tagdemux._onTrackMetadata = Metadata.bind(this);
        tagdemux._onMediaInfo = flvParse.metaSucc.bind(this)
        tagdemux.parseMetadata(flvparse.arrTag[0].body);
        tagdemux.parseChunks(flvparse.arrTag[1])
        tagdemux.parseChunks(flvparse.arrTag[2])

    },
    nextTag: function() {

    },
    mp4FileSucc: function(f) {
        succ = f;
    },
    metaSucc: function(mi) {
        let ftyp_moov = mp4remux.generateInitSegment(metas);
        console.log(new Blob([ftyp_moov.buffer]));
        if (window.mp4Succ) {
            window.mp4Succ(new Blob([ftyp_moov.buffer]))
        }

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