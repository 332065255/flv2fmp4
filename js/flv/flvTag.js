export default class FlvTag {
    constructor() {
        this.tagType = -1;
        this.dataSize = -1;
        this.Timestamp = -1;
        this.StreamID = -1;
        this.body = -1;
        this.time = -1;

    }
    getTime() {
        // this.Timestamp.pop();
        let arr = [];
        for (let i = 0; i < this.Timestamp.length; i++) {
            arr.push((this.Timestamp[i].toString(16).length == 1 ? "0" + this.Timestamp[i].toString(16) : this.Timestamp[i].toString(16)))
        }
        arr.pop();
        let time = this.Timestamp.join('');
        this.time = parseInt(time, 16);
        return parseInt(time, 16);
    }
}