import AsyncStorage from "@react-native-community/async-storage"

const clearAsyncStorage = async () => {
    let keys: any = []
    keys = await AsyncStorage.getAllKeys()
    let KeysToDelete: any = []
    keys.forEach((element: any) => {
        if (element !== "onBoardKey") {
            KeysToDelete.push(element)
        }
    })
    try {
        await AsyncStorage.multiRemove(KeysToDelete)
        return true
    } catch (e) {
        // remove error
        return false
    }
}
export default clearAsyncStorage