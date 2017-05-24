import tag from './flvTag.js'
class FlvParse {
    constructor() {
        this.tempUint8 = new Uint8Array();
        this.arrTag = [];
        this.index = 0;
        this.tempArr = [];
    }

    /**
     * 接受 外部的flv二进制数据
     */
    setFlv(uint8) {
        this.tempUint8 = uint8;
        this.parse();
    }

    /**
     * 开始解析
     */
    parse() {
        this.read(9); //略掉9个字节的flv header tag
        this.read(4); //略掉第一个4字节的 tag size
        // for (var i = 0; i < 3; i++) {
        while (this.index < this.tempUint8.length) {
            let t = new tag();
            t.tagType = (this.read(1)[0]); //取出tag类型
            t.dataSize = this.read(3); //取出包体大小
            t.Timestamp = this.read(4); //取出解码时间
            t.StreamID = this.read(3); //取出stream id
            t.body = this.read(this.getBodySum(t.dataSize)); //取出body
            this.arrTag.push(t);
            this.read(4);
        }

        // }
    }
    read(length) {
        let u8a = new Uint8Array(length);
        u8a.set(this.tempUint8.subarray(this.index, this.index + length), 0);
        this.index += length;
        return u8a;
    }

    /**
     * 计算tag包体大小
     */
    getBodySum(arr) {
        let _str = "";
        _str += (arr[0].toString(16).length == 1 ? "0" + arr[0].toString(16) : arr[0].toString(16));
        _str += (arr[1].toString(16).length == 1 ? "0" + arr[1].toString(16) : arr[1].toString(16));
        _str += (arr[2].toString(16).length == 1 ? "0" + arr[2].toString(16) : arr[2].toString(16));
        return parseInt(_str, 16);
    }
}
export default new FlvParse();