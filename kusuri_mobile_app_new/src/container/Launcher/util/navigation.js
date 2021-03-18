
import LauncherScreen from '../screen/LauncherScreen';
import OverScreen from '../screen/OverScreen';
import RuleScreen from '../screen/RuleScreen';


export const LauncherStack = {
    Over: {
        screen: OverScreen,
        navigationOptions: {
            header: null
        }
    },
    INTRODUCE_IMAGE: {
        screen: OverScreen,
        navigationOptions: {
            header: null
        }
    },
    Rule: {
        screen: RuleScreen,
        navigationOptions: {
            header: null
        }
    },
    Launcher: {
        screen: LauncherScreen,
        navigationOptions: {
            header: null
        }
    },
    TERM: {
        screen: RuleScreen,
        navigationOptions: {
            header: null
        }

    },
};
