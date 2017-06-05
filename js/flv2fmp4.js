import flvparse from './flv/flvParse'
import tagdemux from './flv/tagdemux'
import mp4remux from './mp4/mp4remux'
import mp4moof from './mp4/mp4moof'
class flv2fmp4 {
    constructor() {
        this.onInitSegment = null;
        this.onMediaSegment = null;
        this.loadmetadata = false;
        this.ftyp_moov = null;
        this.metaSuccRun = false;
        this.metas = [];
        tagdemux._onTrackMetadata = this.Metadata.bind(this);
        tagdemux._onMediaInfo = this.metaSucc.bind(this)
        tagdemux._onDataAvailable = this.onDataAvailable.bind(this);
        this.m4mof = new mp4moof({ _isLive: false })
        this.m4mof.onMediaSegment = this.onMdiaSegment.bind(this);
    }
    onMdiaSegment(track, value) {

        if (this.onMediaSegment) {
            this.onMediaSegment(new Uint8Array(value.data));
        }


    }
    Metadata(type, meta) {
        switch (type) {
            case 'video':
                this.metas.push(meta);
                this.m4mof._videoMeta = meta;
                break;
            case 'audio':
                this.metas.push(meta);
                this.m4mof._audioMeta = meta;
                break;
        }
        if (this.metaSuccRun && this.metas.length > 1) {
            this.metaSucc();
        }
    }


    metaSucc() {
        //获取ftyp和moov
        if (this.metas.length == 0) {
            this.metaSuccRun = true;
            return;
        }

        this.ftyp_moov = mp4remux.generateInitSegment(this.metas);
        if (this.onInitSegment && this.loadmetadata == false) {

            this.onInitSegment(this.ftyp_moov);
            this.loadmetadata = true;
        }
    }

    onDataAvailable(audiotrack, videotrack) {
        this.m4mof.remux(audiotrack, videotrack);
    }

    /**
     * 传入flv的二进制数据
     * 
     * @param {ArrayBuffer} arraybuff 
     * 
     * @memberof flv2fmp4
     */
    setflv(arraybuff) {
        let offset = flvparse.setFlv(new Uint8Array(arraybuff));


        if (flvparse.arrTag.length > 0) {
            tagdemux.moofTag(flvparse.arrTag);
        }

        return offset;
    }
}
export default flv2fmp4;
window.flv2fmp4 = flv2fmp4;