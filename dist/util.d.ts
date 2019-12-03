/**
 * 构造返回指定长度的数组
 * @param len 数组的长度
 * @param fill 数组每一项的填充值，默认填充 index的值
 */
declare function getArrByLen(len: number, fill?: any): Array<any>;
/**
 * 数组去重
 * @param arr 需要去重的数组
 */
declare function uniqueArr(arr: Array<any>): Array<any>;
/**
 * 给定 mArr长度个数组，从这些数组中取 n 个项，每个数组最多取一项，求所有的可能集合，其中，mArr的每个项的值代表这个数组的长度
 * 例如 composeMArrN(([1, 2, 3], 2))，表示给定了 3 个数组，第一个数组长度为 1，第二个数组长度为 2，第二个数组长度为 3，从这三个数组任意取两个数
 * example： composeMArrN(([1, 2, 3], 2))，返回：
 * [[0,0,-1],[0,1,-1],[0,-1,0],[0,-1,1],[0,-1,2],[-1,0,0],[-1,0,1],[-1,0,2],[-1,1,0],[-1,1,1],[-1,1,2]]
 * 返回的数组长度为 11，表示有1 种取法，数组中每个子数组就是一个取值组合，子数组中的数据项就表示取值的规则
 * 例如，对于上述结果的第一个子数组 [0, 0, -1] 来说，表示第一种取法是 取第一个数组下标为 0 和 第二个数组下标为 0 的数，下标为 2 的数组项值为 -1 表示第三个数组不取任何数
 * @param mArr 数据源信息
 * @param n 取数的个数
 * @param arr 递归使用，外部调用不需要传此项
 * @param hasSeletedArr 递归使用，外部调用不需要传此项
 * @param rootArr 递归使用，外部调用不需要传此项
 */
declare function composeMArrN(mArr: Array<number>, n: number, arr?: Array<number>, hasSeletedArr?: Array<number>, rootArr?: Array<Array<number>>): Array<Array<number>> | Array<any>;
/**
 * 从 m 个数字中取 n 个，所有可能的取法（不考虑顺序）
 * @param m 数据总数
 * @param n 取数个数
 * @param arr 递归使用，外部调用不需要传此项
 * @param hasSeletedArr 递归使用，外部调用不需要传此项
 * @param rootArr 递归使用，外部调用不需要传此项
 */
declare function composeMN(m: number, n: number, arr?: number[], hasSeletedArr?: number[], rootArr?: number[][]): number[][];
/**
 * 求数组交集，每个数组的数据项只能是数字，并且每个数组都要是排好序的，算法优化的需要
 * @param params 需要求交集的数组，例如 intersectionSortArr([2, 3, 7, 8], [3, 7, 9, 12, 18, 20], [7, 16, 18])
 */
declare function intersectionSortArr(...params: Array<Array<number>>): Array<number>;
/**
 * 求数组交集, intersectionSortArr 的宽松版本，没有 intersectionSortArr 对参数要求那么严格，但是在大数据量的情况下，效率也不如 intersectionSortArr 好
 * @param params 需要求交集的数组，例如 intersectionArr(['swwsw', 'swsw'], ['12', 3, 4], [5,6])
 */
declare function intersectionArr(...params: Array<Array<number | string>>): Array<number | string>;
export { getArrByLen, uniqueArr, composeMN, composeMArrN, intersectionSortArr, intersectionArr };
