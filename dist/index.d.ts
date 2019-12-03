interface ISkuRankListItem {
    spuDId: string;
    paramIdJoin: string;
    priceRange: Array<string>;
    count: number;
}
interface ISkuParamItem {
    paramId: string;
    paramValue: string;
    valueList: Array<{
        valueId: string;
        valueValue: string;
    }>;
}
interface IIndexKeyItemContent {
    spuDIdArr?: Array<string>;
    priceArr?: Array<number>;
    totalCount?: number;
}
interface IIndexKeyItem {
    [propName: string]: {
        [propName: string]: IIndexKeyItemContent;
    };
}
interface IKeyRankItem {
    [propName: string]: Array<number>;
}
interface IActiveSpuTagMapItem {
    [propName: string]: string;
}
export declare const joinKVStr = "_";
export declare const joinAttrStr = "__";
export default class SkuManage {
    skuRankList: Array<ISkuRankListItem>;
    skuParamVoList: Array<ISkuParamItem>;
    keyRankMap: IKeyRankItem;
    indexKeyInfoMap: IIndexKeyItem;
    emptySkuMap: Array<string>;
    emptySkuIncludeList: Array<string>;
    constructor(skuParamVoList: Array<ISkuParamItem>, skuRankList: Array<ISkuRankListItem>);
    init(): void;
    excuteBySeleted(activeSpuTagMap: IActiveSpuTagMapItem): {
        currentRst: null;
        nextEmptyKV: string[];
    } | {
        currentRst: IIndexKeyItemContent;
        nextEmptyKV: any[];
    };
    computeKeyRankMap(): void;
    computeAllCaseInfo(): void;
    /**
     * 当前选择状态下，再次选择时，库存为 0 的 sku属性，返回值例如：['20_201']
     * @param arrKeyCount 选中了几个sku属性
     * @param activeSpuTagMapKey 已经选中的sku属性，例如：'10_100'
     */
    computeEmptyInfo(arrKeyCount: number, activeSpuTagMapKey?: string): string[];
    /**
     * 拼接已经选中的 sku属性
     * @param activeSpuTagMap 例如：{ 10:'101', 20: '201' }
     * @example { 10:'101', 20: '201' } => ['10_101', '20_201']
     */
    getSelectedIndexKeyArr(activeSpuTagMap: IActiveSpuTagMapItem): Array<string>;
    /**
     * 根据 paramId 从小到大的顺序，进行数组插入
     * @param arr 例如：['10_100', '30_300']
     * @param newKey 例如 '20_201'
     * @example sortByParamId(['10_100', '30_300'], '20_201') => ['10_100', '20_201', '30_300']
     */
    sortByParamId(arr: Array<string>, newKey: string): string[];
}
export {};
