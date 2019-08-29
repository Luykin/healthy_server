/* 全局导航工具类 */
/*import {createSwitchNavigator} from "react-navigation"*/

export default class NavigationUtil {
    /*跳转到指定页面*/
    static goPage(params, page) {
        console.log(params, page)
        const navigation = NavigationUtil.navigation
        if (!navigation) {
            console.log('navigation undefined')
            return false
        }
        navigation.navigate(page, {...params})
    }

    /*替换页面*/
    static replace(navigation, params, page) {
        if (navigation) {
            navigation.replace(page, {...params})
        }
    }

    /* 返回上一页 */
    static goBack(key) {
        const navigation = NavigationUtil.navigation
        if (!navigation) {
            console.log('navigation undefined')
            return false
        }
        navigation.goBack(key || null)
    }

    /* 切换 主路由*/
    static switchPage(page) {
        const navigation = NavigationUtil.navigation
        if (!navigation || !page) {
            console.log('navigation undefined or page undefined')
            return false
        }
        navigation.navigate(page)
    }
}
