export async function checkDuplicate(Transaction, userId, date, description, amount) {
    return await Transaction.findDuplicate(userId, date, description, amount);
}
