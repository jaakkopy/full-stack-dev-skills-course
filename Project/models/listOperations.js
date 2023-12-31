const mongoose = require('mongoose');
const ValidationError = require('../errors/validationError');
const Group = require('./group');
const ShoppingList = require('./shoppingList');

const validateNewListData = (newList, creator) => {
    if (!newList?.name || !newList?.date || !newList?.group)
        throw new ValidationError("name, date, and group should be defined and non-empty");
    // check that the creator is part of the group
    let groupId = null;
    for (let i = 0; i < creator.groups.length; ++i) {
        if (creator.groups[i].toString() === newList.group) {
            groupId = creator.groups[i];
            break;
        }
    }
    if (groupId == null)
        throw new ValidationError("Must be a member of the group to create a list for that group");
    const date = Date.parse(newList.date);
    if (isNaN(date))
        throw new ValidationError("Given date is not valid in the date time string format (e.g YYYY-MM-DD)");
    return {groupId, date}
}

const createList = async (newList, creator) => {
    const values = validateNewListData(newList, creator);
    const toAdd = ShoppingList({
        name: newList.name,
        date: values.date,
        creatorName: creator.username,
        group: values.groupId,
        items: []
    });
    await toAdd.save();
    return toAdd._id;
}

const getGroupsLists = async (user, groupIdString) => {
    const group = await Group.findOne({_id: new mongoose.Types.ObjectId(groupIdString)});
    if (group == null)
        throw new ValidationError("No group with that id exists");
    if (!user.groups.find(g => g._id.equals(group._id)))
        throw new ValidationError("Not a member of that group");
    const lists = await ShoppingList.find({ group: { $in:  group._id} });
    let toReturn = {name: group.name, lists: []};
    lists.forEach(l => {
        toReturn.lists.push({
            // return only the basic information about the list. Items will be fetched from a different route
            id: l._id,
            name: l.name,
            date: l.date,
            creatorName: l.creatorName
        });
    });
    return toReturn;
}

const getList = async (user, listId) => {
    const list = await ShoppingList.findOne({_id: new mongoose.Types.ObjectId(listId)}); 
    if (list == null)
        throw ValidationError("No such list exists")
    if (user.groups.indexOf(list.group) === -1)
        throw ValidationError("Not a member of that group")
    return list
}

const getLists = async (user) => {
    const lists = await ShoppingList.find({group: {$in: user.groups}});
    let toReturn = [];
    for (let i = 0; i < lists.length; ++i) {
        const group = await Group.findOne({_id: lists[i].group});
        toReturn.push({
            id: lists[i]._id,
            groupName: group.name,
            group: lists[i].group,
            name: lists[i].name,
            date: lists[i].date,
            creatorName: lists[i].creatorName,
        });
    }
    return toReturn;
}

const deleteList = async (user, listId) => {
    const list = await getList(user, listId);
    await ShoppingList.deleteOne({_id: list._id});
}

const getListById = async (user, listId) => {
    const list = await getList(user, listId);
    const toReturn = {
        id: list._id,
        creatorName: list.creatorName,
        name: list.name,
        date: list.date,
        items: list.items
    }
    return toReturn;
}

const validateNewItemData = (newItem) => {
    if (!newItem?.name || !newItem?.quantity)
        throw new ValidationError("name and quantity should be defined and non-empty");
}

const addToList = async (user, listId, newItemData) => {
    const list = await getList(user, listId);
    validateNewItemData(newItemData);
    const toAdd = ShoppingList.ShoppingListItem({
        name: newItemData.name,
        quantity: newItemData.quantity,
        price: newItemData?.price,
        category: newItemData?.category,
        comment: newItemData?.comment
    });
    list.items.push(toAdd);
    await list.save();
    return toAdd._id;
}

const deleteItemFromList = async (user, listid, itemid) => {
    const list = await getList(user, listid);
    list.items = list.items.filter(i => i._id.toString() !== itemid);
    await list.save();
}

const updateListItem = async (user, listid, itemid, newValues) => {
    const list = await getList(user, listid);
    let item = list.items.find(i => i._id.toString() == itemid);
    if (item === -1)
        throw new ValidationError("No item with that id exists");
    if (newValues.name)
        item.name = newValues.name;
    if (newValues.quantity)
        item.quantity = newValues.quantity;
    if (newValues.price)
        item.price = newValues.price;
    if (newValues.category)
        item.category = newValues.category;
    if (newValues.comment)
        item.comment = newValues.comment;
    await list.save();
}

const getStatsForGroup = async (user, groupId) => {
    const group = await Group.findOne({_id: new mongoose.Types.ObjectId(groupId)});
    if (group == null)
        throw new ValidationError("No group with that id exists");
    if (!user.groups.find(g => g._id.equals(group._id)))
        throw new ValidationError("Not a member of that group");
    const lists = await ShoppingList.find({ group: { $in:  group._id} });

    let amountPurchasesByProductName = {};
    let amountPurchasesByCategory = {};
    let totalRegisteredSpendingPerCategory = {};
    let amountListsPerDay = {};
    let totalCosts = [];

    const day = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    day.forEach(d => amountListsPerDay[d] = 0);
    lists.forEach(list => {
        const dayOfWeek = day[new Date(list.date).getDay() - 1];
        amountListsPerDay[dayOfWeek] += 1;
        let totalCost = 0;
        list.items.forEach(item => {
            const category = item.category || "Undefined";
            const price = item.price || 0;
            const name = item.name;
            const quantity = item.quantity;

            amountPurchasesByProductName[name] = (amountPurchasesByProductName[name] ?? 0) + quantity;
            amountPurchasesByCategory[category] = (amountPurchasesByCategory[category] ?? 0) + quantity;
            totalRegisteredSpendingPerCategory[category] = (totalRegisteredSpendingPerCategory[category] ?? 0) + quantity * price;
            totalCost += price * quantity;
        });
        totalCosts.push(totalCost);
    });

    const findKeyWithMaxValue = (obj) => {
        let most = 0;
        let toReturn;
        for (const [key, val] of Object.entries(obj)) {
            if (val > most) {
                most = val;
                toReturn = [key, val];
            }
        }
        return toReturn;
    }

    let mostPurchasedProduct = findKeyWithMaxValue(amountPurchasesByProductName);
    let dayWithMostLists = findKeyWithMaxValue(amountListsPerDay);
    let averageCostOfList = 0;
    if (totalCosts.length > 0)
        averageCostOfList = totalCosts.reduce((acc, cur) => acc + cur) / totalCosts.length;

    return {mostPurchasedProduct, averageCostOfList, dayWithMostLists, amountPurchasesByProductName, amountPurchasesByCategory, totalRegisteredSpendingPerCategory, amountListsPerDay};
}


module.exports = {
    createList,
    deleteList,
    getGroupsLists,
    getListById,
    addToList,
    deleteItemFromList,
    updateListItem,
    getLists,
    getStatsForGroup
};