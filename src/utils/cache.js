/*
 * @Description: 缓存比对
 * @Project:
 * @Author: michelle
 * @Date: 2021-11-04 15:11:36
 * @LastEditors: michelle
 * @LastEditTime: 2021-11-04 15:11:36
 * @Modified By: michelle
 * @FilePath: /TrunkFace/src/utils/cache.js
 */
export default class Cache {
    constructor() {
        this.size = 0;
        this.entry = new Object();
    }

    /**
     * @description: 是否包含value
     * @param {*} value
     * @return {*}
     */
    containsValue(value) {
        for (var prop in entry) {
            if (this.entry[prop] == value) {
                return true;
            }
        }
        return false;
    }

    /**
     * @description: 是否包含 Key
     * @param {*}
     * @return {*}
     */
    containsKey(key) {
        return key in this.entry;
    }

    /**
     * @description: 存储key value
     * @param {*} key
     * @param {*} value
     * @return {*}
     */
    set(key, value) {
        if (!this.containsKey(key)) {
            this.size++;
        }
        this.entry[key] = value;
    }

    /**
     * @description: 取key的value
     * @param {*} key
     * @return {*}
     */
    get(key) {
        return this.containsKey(key) ? this.entry[key] : null;
    }

    /**
     * @description: 如果key存在 则删除
     * @param {*} key
     * @return {*}
     */
    remove(key) {
        if (this.containsKey(key) && delete this.entry[key]) {
            this.size--;
        }
    }

    /**
     * @description: 获取所有 Value
     * @param {*}
     * @return {*}
     */
    getAllValues() {
        let values = new Array();
        for (var prop in entry) {
            values.push(entry[prop]);
        }
        return values;
    }

    /**
     * @description: 获取所有 Key
     * @param {*}
     * @return {*}
     */
    getAllkeys() {
        let keys = new Array();
        for (var prop in entry) {
            keys.push(prop);
        }
        return keys;
    }

    /**
     * @description:  alarm Size
     * @param {*}
     * @return {*}
     */
    size() {
        return this.size;
    }

    /**
     * @description: 清空
     * @param {*}
     * @return {*}
     */
    clear() {
        this.size = 0;
        this.entry = new Object();
    }
}
