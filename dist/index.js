// 处理 sku选择问题
import { composeMN, composeMArrN, uniqueArr, intersectionSortArr, intersectionArr } from './util';
// #endregion
// 用于连接数组下标的分隔符
export var joinKVStr = '_';
export var joinAttrStr = '__';
var joinAttrStrRe = new RegExp(joinAttrStr, 'g');
var SkuManage = /** @class */ (function () {
    function SkuManage(skuParamVoList, skuRankList) {
        // 全部 sku 排列组合的数据
        this.skuRankList = [];
        // sku 的组合源
        this.skuParamVoList = [];
        // 在 skuRankList中，所有包含 sku 每一商品属性（例如黑色）的数据项的下标的集合
        // 例如：{ 10_100__20_200: [0, 1, 2, 3, 4, 5] }
        this.keyRankMap = {};
        // 任意选择状态下的商品库存和价格信息 Map
        this.indexKeyInfoMap = {};
        // 当没有选择任何 sku属性时，库存为 0 的 sku属性
        // 即总库存为 0 的单个 sku属性
        // 例如：['10_100']，表示 paramId = 10，valueId = 100 的 sku属性库存为 0
        this.emptySkuMap = [];
        // 所有库存为 0 的 sku中，包括的 sku属性的集合，用于优化算法
        // 例如，10_101__20_201的库存为 0，则此值为 ['10_101', '20_201']
        // 如果此数组长度为 0，说明不存在库存为 0 的 sku，后续就无需考虑置灰的情况，因为所有的 sku的库存都是大于 0 的，都是可选的
        this.emptySkuIncludeList = [];
        /* eslint-disable-next-line */
        this.skuParamVoList = skuParamVoList;
        this.skuRankList = skuRankList;
        this.init();
    }
    SkuManage.prototype.init = function () {
        var _this = this;
        this.computeKeyRankMap();
        this.computeAllCaseInfo();
        this.skuRankList.forEach(function (item) {
            if (item.count === 0) {
                _this.emptySkuIncludeList = _this.emptySkuIncludeList.concat(item.paramIdJoin.split(joinAttrStr));
            }
        });
        this.emptySkuIncludeList = uniqueArr(this.emptySkuIncludeList);
        if (this.emptySkuIncludeList.length) {
            this.emptySkuMap = this.computeEmptyInfo(0);
        }
    };
    SkuManage.prototype.excuteBySeleted = function (activeSpuTagMap) {
        var _this = this;
        // 从小到大排序
        var activeSpuTagMapKeyList = Object.keys(activeSpuTagMap).filter(function (item) { return activeSpuTagMap[item]; }).sort(function (a, b) { return +a - +b; });
        var activeSpuTagMapKVArr = this.getSelectedIndexKeyArr(activeSpuTagMap);
        // 没有选择任何 sku属性
        if (activeSpuTagMapKeyList.length === 0) {
            return {
                currentRst: null,
                nextEmptyKV: this.emptySkuMap
            };
        }
        var arrKeyCount = activeSpuTagMapKeyList.length;
        // 取得当前条件对应的库存和价格
        var currentRst = this.indexKeyInfoMap[arrKeyCount - 1][activeSpuTagMapKVArr.join(joinAttrStr)];
        // 需要置灰的 sku属性
        var nextEmptyKV = [];
        // 不需要考虑置灰的情况，直接返回
        // 如果当前所选的 sku属性，都不在 this.emptySkuMap 内，即选择的 sku属性都是有库存的，则说明无论下一步选择哪些 sku属性，都无需考虑置灰
        if (intersectionArr(this.emptySkuIncludeList, activeSpuTagMapKVArr).length === 0) {
            return {
                // 当前选中的sku属性按钮对应的库存和价格信息
                currentRst: currentRst,
                nextEmptyKV: this.emptySkuMap
            };
        }
        // 取得置灰的属性信息
        for (var i = 0; i < activeSpuTagMapKeyList.length; i++) {
            var currentList = composeMN(activeSpuTagMapKeyList.length, i + 1);
            nextEmptyKV = nextEmptyKV.concat(currentList.reduce(function (t, item) {
                var currentSpuTagMapKey = item.reduce(function (total, c) {
                    return total + activeSpuTagMapKeyList[c] + joinKVStr + activeSpuTagMap[activeSpuTagMapKeyList[c]] + joinAttrStr;
                }, '').slice(0, -joinAttrStr.length);
                return t.concat(_this.computeEmptyInfo(item.length, currentSpuTagMapKey));
            }, []));
        }
        return {
            // 当前选中的sku属性按钮对应的库存和价格信息
            currentRst: currentRst,
            // 应该置为灰色不可点击状态的按钮，需要加上当任何属性不选择是库存为 0 的属性
            nextEmptyKV: uniqueArr(nextEmptyKV.concat(this.emptySkuMap))
        };
    };
    // 计算在 skuRankList中，所有包含 sku 每一商品属性（例如黑色）的数据项的下标的集合
    SkuManage.prototype.computeKeyRankMap = function () {
        var skuRankList = this.skuRankList;
        var skuRankListLen = skuRankList.length;
        var skuParamVoListLen = this.skuParamVoList.length;
        var valueItem = null;
        var keyRankMapKey = null;
        for (var i = 0; i < skuParamVoListLen; i++) {
            valueItem = this.skuParamVoList[i].valueList;
            for (var j = 0; j < valueItem.length; j++) {
                keyRankMapKey = this.skuParamVoList[i].paramId + joinKVStr + valueItem[j].valueId;
                for (var k = 0; k < skuRankListLen; k++) {
                    if (skuRankList[k].paramIdJoin.indexOf(keyRankMapKey) !== -1) {
                        if (!this.keyRankMap[keyRankMapKey]) {
                            this.keyRankMap[keyRankMapKey] = [];
                        }
                        this.keyRankMap[keyRankMapKey] = this.keyRankMap[keyRankMapKey].concat(k);
                    }
                }
            }
        }
    };
    // 任意选择状态下的商品库存和价格信息
    // 例如，选中黑色 + 16G，计算出其对应的总库存和价格范围数据
    SkuManage.prototype.computeAllCaseInfo = function () {
        var _this = this;
        var caseCom = [];
        var includeIndexArrTemp = [];
        var priceArrTemp = [];
        var countArrTemp = [];
        var spuDIdTemp = [];
        var mArr = this.skuParamVoList.map(function (item) { return item.valueList.length; });
        var skuParamVoListLen = this.skuParamVoList.length;
        var _loop_1 = function (index) {
            this_1.indexKeyInfoMap[index] = {};
            caseCom = composeMArrN(mArr, index + 1).map(function (item) {
                return item.reduce(function (t, c, kk) {
                    if (c === -1)
                        return t;
                    // 需要按照 paramId 从小到大排序
                    return _this.sortByParamId(t, _this.skuParamVoList[kk].paramId + joinKVStr + _this.skuParamVoList[kk].valueList[c].valueId);
                }, []);
            });
            caseCom.forEach(function (v) {
                priceArrTemp = [];
                countArrTemp = [];
                spuDIdTemp = [];
                includeIndexArrTemp = intersectionSortArr.apply(void 0, v.map(function (vv) { return (_this.keyRankMap[vv] || []); }));
                includeIndexArrTemp.forEach(function (item) {
                    priceArrTemp = priceArrTemp.concat(_this.skuRankList[item].priceRange);
                    countArrTemp.push(_this.skuRankList[item].count);
                    spuDIdTemp.push(_this.skuRankList[item].spuDId);
                });
                _this.indexKeyInfoMap[index][v.join(joinAttrStr)] = {
                    spuDIdArr: spuDIdTemp,
                    // 转为数字
                    priceArr: priceArrTemp.map(function (item) { return +item; }),
                    totalCount: countArrTemp.reduce(function (t, c) { return t + c; }, 0)
                };
            });
        };
        var this_1 = this;
        for (var index = 0; index < skuParamVoListLen; index++) {
            _loop_1(index);
        }
    };
    /**
     * 当前选择状态下，再次选择时，库存为 0 的 sku属性，返回值例如：['20_201']
     * @param arrKeyCount 选中了几个sku属性
     * @param activeSpuTagMapKey 已经选中的sku属性，例如：'10_100'
     */
    SkuManage.prototype.computeEmptyInfo = function (arrKeyCount, activeSpuTagMapKey) {
        var _this = this;
        var nextEmptyKV = [];
        if (arrKeyCount === 0) {
            return Object.keys(this.indexKeyInfoMap[0]).filter(function (item) { return _this.indexKeyInfoMap[0][item].totalCount === 0; });
        }
        if (arrKeyCount >= this.skuParamVoList.length) {
            // 选择了全部 sku 属性
            return nextEmptyKV;
        }
        var nextKeyMap = this.indexKeyInfoMap[arrKeyCount];
        var activeSpuTagList = activeSpuTagMapKey.split(joinAttrStr);
        var activeSpuTagArrLen = activeSpuTagList.length;
        var nextEmptyKeyArr = [];
        Object.keys(nextKeyMap).forEach(function (item) {
            if (nextKeyMap[item].totalCount !== 0)
                return;
            var i = 0;
            var itemArr = item.split(joinAttrStr);
            itemArr.forEach(function (v) {
                if (v === activeSpuTagList[i])
                    i++;
            });
            if (i === activeSpuTagArrLen) {
                nextEmptyKeyArr.push(item);
            }
        });
        if (nextEmptyKeyArr.length) {
            var activeSpuTagArr_1 = activeSpuTagMapKey.split(joinAttrStr);
            nextEmptyKV = uniqueArr(nextEmptyKeyArr.map(function (item) {
                // 删掉当前已经选中的，剩下的一个就是应该置灰的
                activeSpuTagArr_1.forEach(function (v) {
                    item = item.replace(v, '');
                });
                return item.replace(joinAttrStrRe, '');
            }));
        }
        return nextEmptyKV;
    };
    /**
     * 拼接已经选中的 sku属性
     * @param activeSpuTagMap 例如：{ 10:'101', 20: '201' }
     * @example { 10:'101', 20: '201' } => ['10_101', '20_201']
     */
    SkuManage.prototype.getSelectedIndexKeyArr = function (activeSpuTagMap) {
        // paramId从小到大排序
        return Object.keys(activeSpuTagMap).filter(function (key) { return activeSpuTagMap[key]; }).sort(function (a, b) { return +a - +b; }).map(function (key) {
            return key + joinKVStr + activeSpuTagMap[key];
        });
    };
    /**
     * 根据 paramId 从小到大的顺序，进行数组插入
     * @param arr 例如：['10_100', '30_300']
     * @param newKey 例如 '20_201'
     * @example sortByParamId(['10_100', '30_300'], '20_201') => ['10_100', '20_201', '30_300']
     */
    SkuManage.prototype.sortByParamId = function (arr, newKey) {
        var itemParamId = +newKey.split(joinKVStr)[0];
        var i = 0;
        for (; i < arr.length; i++) {
            if (+arr[i].split(joinKVStr)[0] > itemParamId) {
                break;
            }
        }
        arr.splice(i, 0, newKey);
        return arr;
    };
    return SkuManage;
}());
export default SkuManage;
