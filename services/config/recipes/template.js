const ItemTypes = {
    // 物流
    Logistics = 1,
    // 完成品
    Product = 2,
    // 中間生成物
    IntermidiateProduct = 3,
    // 軍事物資は今回意味ないけどレシピとして。。
    Military = 4,

    Technology = 5
}

/**
 * miningrable: 採掘可能
 * fluid: 流体
 * fuel: 燃料
 */

module.exports =  [
    {
        "id": 1,
        "ItemType": ItemTypes.IntermidiateProduct,
        "name": "木材",
        "miningrable": true,
        "fluid": false,
        "fuel": true 
    },
    {
        "id": 2,
        "ItemType": ItemTypes.IntermidiateProduct,
        "name": "鉄鉱石",
        "miningrable": true,
        "fluid": false,
        "fuel": true 
    },
];

