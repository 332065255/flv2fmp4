import tag from './flvTag.js'
class FlvParse {
    constructor() {
        this.tempUint8 = [];
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
        while (this.index < this.tempUint8.length) {
            let t = new tag();
            t.tagType = (this.read(1)[0]); //取出tag类型
            t.dataSize = [].concat((this.read(3))); //取出包体大小
            t.Timestamp = [].concat(this.read(4)); //取出解码时间
            t.StreamID = [].concat(this.read(3)); //取出stream id
            t.body = [].concat(this.read(this.getBodySum(t.dataSize))); //取出body
            this.arrTag.push(t);
            this.read(4);
        }
    }
    read(length) {
        this.tempArr.length = 0;
        for (let i = 0; i < length; i++) {
            this.tempArr.push(this.tempUint8[this.index]);
            this.index += 1;
        }
        return this.tempArr;
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