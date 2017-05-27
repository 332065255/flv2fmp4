import flvparse from './flv/flvParse'
import tagdemux from './flv/tagdemux'
import mp4remux from './mp4/mp4remux'
import mp4moof from './mp4/mp4moof'
window.flvParse = {
    mp4File: null,
    succ: null,
    // ftyp_moov:null,
    tracks: [],
    setFlv: function(uint8) {
        flvparse.setFlv(uint8);

        tagdemux._onTrackMetadata = Metadata.bind(this);
        tagdemux._onMediaInfo = flvParse.metaSucc.bind(this)
        tagdemux.parseMetadata(flvparse.arrTag[0].body);
        tagdemux.parseChunks(flvparse.arrTag[1])
        console.log(flvparse.arrTag[2])
        tagdemux.parseChunks(flvparse.arrTag[2])
            //用来获取moov

    },
    nextTag: function() {

    },
    mp4FileSucc: function(f) {
        succ = f;
    },
    metaSucc: function(mi) {
        //获取ftyp和moov
        window.ftyp_moov = mp4remux.generateInitSegment(metas);


        //产出moof
        window.tracks = new Array();
        let mediaSeg = flvparse.arrTag.slice(3);



        tagdemux.moofTag(mediaSeg);
        tagdemux._videoTrack.sequenceNumber = 0;
        tagdemux._audioTrack.sequenceNumber = 1;
        console.log(tagdemux._videoTrack, tagdemux._audioTrack);
        let m4mof = new mp4moof({ _isLive: false })
        m4mof.onMediaSegment = flvParse.onMdiaSegment.bind(this);
        m4mof.remux(tagdemux._audioTrack, tagdemux._videoTrack);



    },
    onMdiaSegment: function(track, value) {
        console.log(track, value, new Uint8Array(value.data))
        window.tracks.push(new Uint8Array(value.data));



        if (window.tracks.length > 1) {
            let u8a = new Uint8Array(window.ftyp_moov.length + window.tracks[0].length + window.tracks[1].length)
            u8a.set(window.ftyp_moov, 0)
            u8a.set(window.tracks[0], window.ftyp_moov.length)
            u8a.set(window.tracks[1], window.ftyp_moov.length + window.tracks[0].length)
            if (window.mp4Succ) {
                // window.mp4Succ(new Blob([u8a.buffer]))
                window.mp4Succ(u8a);
            }
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