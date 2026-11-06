/* eslint-disable */
import decodeUTF8 from '../decodeUTF8';
const le = (function() {
    const buf = new ArrayBuffer(2);
    (new DataView(buf)).setInt16(0, 256, true); // little-endian write
    return (new Int16Array(buf))[0] === 256; // platform-spec read, if equal then LE
})();
export default class flvDemux {

    constructor() {

    }
    /**
     * 读一个 AMF 属性。size 是从 dataOffset 开始消耗的字节数。
     */
    static parseObject(arrayBuffer, dataOffset, dataSize) {
        if (dataSize < 3) {
            return { data: { name: '', value: undefined }, size: 0, objectEnd: true };
        }
        const name = flvDemux.parseString(arrayBuffer, dataOffset, dataSize);
        const value = flvDemux.parseScript(arrayBuffer, dataOffset + name.size, dataSize - name.size);
        const isObjectEnd = value.objectEnd;

        return {
            data: {
                name: name.data,
                value: value.data
            },
            size: name.size + value.size,
            objectEnd: isObjectEnd
        };
    }

    static parseVariable(arrayBuffer, dataOffset, dataSize) {
        return flvDemux.parseObject(arrayBuffer, dataOffset, dataSize);
    }
    static parseLongString(arrayBuffer, dataOffset, dataSize) {

        const v = new DataView(arrayBuffer, dataOffset);
        const length = v.getUint32(0, !le);

        let str;
        if (length > 0) {
            str = decodeUTF8(new Uint8Array(arrayBuffer, dataOffset + 4, length));
        } else {
            str = '';
        }

        return {
            data: str,
            size: 4 + length
        };
    }
    static parseDate(arrayBuffer, dataOffset, dataSize) {

        const v = new DataView(arrayBuffer, dataOffset);
        let timestamp = v.getFloat64(0, !le);
        const localTimeOffset = v.getInt16(8, !le);
        timestamp += localTimeOffset * 60 * 1000; // get UTC time

        return {
            data: new Date(timestamp),
            size: 8 + 2
        };
    }
    static parseString(arrayBuffer, dataOffset, dataSize) {
        const v = new DataView(arrayBuffer, dataOffset);
        const length = v.getUint16(0, !le);
        let str;
        if (length > 0) {
            str = decodeUTF8(new Uint8Array(arrayBuffer, dataOffset + 2, length));
        } else {
            str = '';
        }
        return {
            data: str,
            size: 2 + length
        };
    }

    /**
     * 解析metadata
     */
    static parseMetadata(arr) {
        try {
            const uint8 = new Uint8Array(arr);
            const buffer = uint8.buffer;
            const name = flvDemux.parseScript(buffer, 0, buffer.byteLength);
            if (!name || name.size <= 0 || name.data == null) {
                return {};
            }
            const value = flvDemux.parseScript(buffer, name.size, buffer.byteLength - name.size);
            const data = {};
            data[name.data] = value.data;
            return data;
        } catch (e) {
            console.log('AMF', e);
            return {};
        }
    }

    /**
     * 解析一个 AMF0 ScriptDataValue。
     * size 是相对 dataOffset 消耗的字节数，objectEnd 表示读到了对象结束标记。
     */
    static parseScript(arrayBuffer, dataOffset, dataSize) {
        if (dataSize == null) {
            dataSize = arrayBuffer.byteLength - dataOffset;
        }
        if (dataSize <= 0) {
            return { data: undefined, size: 0, objectEnd: true };
        }
        const dv = new DataView(arrayBuffer, dataOffset, dataSize);
        let offset = 0;
        let value = null;
        let objectEnd = false;
        const type = dv.getUint8(offset);
        offset += 1;

        switch (type) {
            case 0: // Number(Double) type
                value = dv.getFloat64(offset, !le);
                offset += 8;
                break;
            case 1:
                { // Boolean type
                    const b = dv.getUint8(offset);
                    value = !!b;
                    offset += 1;
                    break;
                }
            case 2:
                { // String type
                    const amfstr = flvDemux.parseString(arrayBuffer, dataOffset + offset, dataSize - offset);
                    value = amfstr.data;
                    offset += amfstr.size;
                    break;
                }
            case 3:
                { // Object type
                    value = {};
                    let terminal = 0; // workaround for malformed Objects which has missing ScriptDataObjectEnd
                    if (dataSize >= 4 && (dv.getUint32(dataSize - 4, !le) & 0x00FFFFFF) === 9) {
                        terminal = 3;
                    }
                    while (offset < dataSize - 4) { // 4 === type(UI8) + ScriptDataObjectEnd(UI24)
                        const amfobj = flvDemux.parseObject(arrayBuffer, dataOffset + offset, dataSize - offset - terminal);
                        if (amfobj.objectEnd || amfobj.size <= 0) { break; }
                        value[amfobj.data.name] = amfobj.data.value;
                        offset += amfobj.size;
                    }
                    if (offset <= dataSize - 3) {
                        const marker = dv.getUint32(offset - 1, !le) & 0x00FFFFFF;
                        if (marker === 9) {
                            offset += 3;
                        }
                    }
                    break;
                }
            case 8:
                { // ECMA array type (Mixed array)
                    value = {};
                    offset += 4; // ECMAArrayLength(UI32)
                    let terminal = 0; // workaround for malformed MixedArrays which has missing ScriptDataObjectEnd
                    if (dataSize >= 4 && (dv.getUint32(dataSize - 4, !le) & 0x00FFFFFF) === 9) {
                        terminal = 3;
                    }
                    while (offset < dataSize - 8) { // 8 === type(UI8) + ECMAArrayLength(UI32) + ScriptDataVariableEnd(UI24)
                        const amfvar = flvDemux.parseVariable(arrayBuffer, dataOffset + offset, dataSize - offset - terminal);
                        if (amfvar.objectEnd || amfvar.size <= 0) { break; }
                        value[amfvar.data.name] = amfvar.data.value;
                        offset += amfvar.size;
                    }
                    if (offset <= dataSize - 3) {
                        const marker = dv.getUint32(offset - 1, !le) & 0x00FFFFFF;
                        if (marker === 9) {
                            offset += 3;
                        }
                    }
                    break;
                }
            case 9: // ScriptDataObjectEnd
                value = undefined;
                offset = 1;
                objectEnd = true;
                break;
            case 10:
                { // Strict array type
                    value = [];
                    const strictArrayLength = dv.getUint32(offset, !le);
                    offset += 4;
                    for (let i = 0; i < strictArrayLength; i++) {
                        const val = flvDemux.parseScript(arrayBuffer, dataOffset + offset, dataSize - offset);
                        value.push(val.data);
                        offset += val.size;
                    }
                    break;
                }
            case 11:
                { // Date type
                    const date = flvDemux.parseDate(arrayBuffer, dataOffset + offset, dataSize - offset);
                    value = date.data;
                    offset += date.size;
                    break;
                }
            case 12:
                { // Long string type
                    const amfLongStr = flvDemux.parseLongString(arrayBuffer, dataOffset + offset, dataSize - offset);
                    value = amfLongStr.data;
                    offset += amfLongStr.size;
                    break;
                }
            default:
                // ignore and skip
                offset = dataSize;
                console.log('AMF', 'Unsupported AMF value type ' + type);
        }
        return {
            data: value,
            size: offset,
            objectEnd
        };
    }
}
