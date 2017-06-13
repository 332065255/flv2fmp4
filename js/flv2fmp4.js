import flvparse from './flv/flvParse'
import tagdemux from './flv/tagdemux'
import mp4remux from './mp4/mp4remux'
import mp4moof from './mp4/mp4moof'
class flv2fmp4 {

    /**
     * Creates an instance of flv2fmp4.
     * config 里面有_isLive属性,是否是直播
     * @param {any} config 
     * 
     * @memberof flv2fmp4
     */
    constructor(config) {
        this._config = { _isLive: false };
        this._config = Object.assign(this._config, config);
        this.onInitSegment = null;
        this.onMediaSegment = null;
        this.onMediaInfo = null;
        this.seekCallBack = null;
        this.loadmetadata = false;
        this.ftyp_moov = null;
        this.metaSuccRun = false;
        this.metas = [];
        this.parseChunk = null;
        this._pendingResolveSeekPoint = -1;
        this._tempBaseTime = 0;



        //处理flv数据入口
        this.setflvBase = this.setflvBase1;

        tagdemux._onTrackMetadata = this.Metadata.bind(this);
        tagdemux._onMediaInfo = this.metaSucc.bind(this)
        tagdemux._onDataAvailable = this.onDataAvailable.bind(this);
        this.m4mof = new mp4moof(this._config)
        this.m4mof.onMediaSegment = this.onMdiaSegment.bind(this);
    }
    seek() {
        this.setflvBase = this.setflvBase1;
    }
    setflvBase1(arraybuff, baseTime) {
        if (baseTime == undefined || baseTime == 0) {
            baseTime = 0;
            this._pendingResolveSeekPoint = -1;
        }
        if (this._tempBaseTime != baseTime) {
            this._tempBaseTime = baseTime;
            tagdemux._timestampBase = baseTime;
            this.m4mof.seek(baseTime);
            this.m4mof.insertDiscontinuity();
            this._pendingResolveSeekPoint = baseTime;
        }

        let offset = flvparse.setFlv(new Uint8Array(arraybuff));

        if (flvparse.arrTag.length > 0) {
            if (this._tempBaseTime != 0 && this._tempBaseTime == flvparse.arrTag[0].getTime()) {
                tagdemux._timestampBase = 0;
            }
            tagdemux.moofTag(flvparse.arrTag);
            this.setflvBase = this.setflvBase2;
        }

        return offset;
    }

    setflvBase2(arraybuff, baseTime) {
        let offset = flvparse.setFlv(new Uint8Array(arraybuff));


        if (flvparse.arrTag.length > 0) {
            tagdemux.moofTag(flvparse.arrTag);
        }

        return offset;
    }

    /**
     * moof回调
     * 
     * @param {any} track 
     * @param {any} value 
     * 
     * @memberof flv2fmp4
     */
    onMdiaSegment(track, value) {

        if (this.onMediaSegment) {
            this.onMediaSegment(new Uint8Array(value.data));
        }
        if (this._pendingResolveSeekPoint != -1 && track == 'video') {
            let seekpoint = this._pendingResolveSeekPoint;
            this._pendingResolveSeekPoint = -1;
            if (this.seekCallBack) {
                this.seekCallBack(seekpoint);
            }
        }
    }


    /**
     * 音频和视频的初始化tag
     * 
     * @param {any} type 
     * @param {any} meta 
     * 
     * @memberof flv2fmp4
     */
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


    /**
     * metadata解读成功后触发及第一个视频tag和第一个音频tag
     * 
     * @param {any} mi 
     * @returns 
     * 
     * @memberof flv2fmp4
     */
    metaSucc(mi) {
        if (this.onMediaInfo) {
            this.onMediaInfo(mi);
        }
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
     * @param {any} arraybuff 
     * @param {any} baseTime flv数据开始时间
     * @returns 
     * 
     * @memberof flv2fmp4
     */
    setflv(arraybuff, baseTime) {
        // if (baseTime == undefined || baseTime == 0) {
        //     baseTime = 0;
        //     this._pendingResolveSeekPoint = -1;
        // }
        // if (this._tempBaseTime != baseTime) {
        //     this._tempBaseTime = baseTime;
        //     tagdemux._timestampBase = baseTime;
        //     this.m4mof.seek(baseTime);
        //     this.m4mof.insertDiscontinuity();
        //     this._pendingResolveSeekPoint = baseTime;
        //     // this._remuxer.seek(milliseconds);
        //     // this._remuxer.insertDiscontinuity();
        // }

        // let offset = flvparse.setFlv(new Uint8Array(arraybuff));


        // if (flvparse.arrTag.length > 0) {
        //     tagdemux.moofTag(flvparse.arrTag);
        // }

        // return offset;
        return this.setflvBase(arraybuff, baseTime);
    }

    setflvloc(arraybuff) {
        let offset = flvparse.setFlv(new Uint8Array(arraybuff));


        if (flvparse.arrTag.length > 0) {
            return flvparse.arrTag;
        }
    }
}
export default flv2fmp4;
window.flv2fmp4 = flv2fmp4;