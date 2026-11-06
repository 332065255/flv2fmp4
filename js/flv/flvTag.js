/* eslint-disable */
export default class FlvTag {
    constructor() {
        this.tagType = -1;
        this.dataSize = -1;
        this.Timestamp = -1;
        this.StreamID = -1;
        this.body = -1;
        this.time = -1;
        this.arr = [];
        this.size=-1;
    }
    getTime() {
        const ts = this.Timestamp;
        if (!ts || ts.length < 3) {
            this.time = 0;
            return 0;
        }
        // 前 3 字节是低 24 位，第 4 字节 TimestampExtended 是高 8 位
        const low = (ts[0] << 16) | (ts[1] << 8) | ts[2];
        const high = ts.length > 3 ? ts[3] : 0;
        this.time = ((high << 24) | low) >>> 0;
        return this.time;
    }
}