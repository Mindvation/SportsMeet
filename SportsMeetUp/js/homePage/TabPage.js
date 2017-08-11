'use strict';

import React, {Component} from 'react';

import {
    StyleSheet,
    View,
    Image,
} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import HomePage from './HomePage'
import Nearby from '../nearby/NearbyMain';
import PersonalCenter from '../personal/PersonalCenter'
import MyMatchMain from '../myMatch/MyMatchMain';
import Util from '../util/CommonUtil';
import Guide from './Guide';
import DataUtil from '../util/DataUtil';


class TabPage extends Component {

    constructor(props) {
        super(props);

        this.state = {selectedTab: 'home', notFirstUse: true};

        Util.updateGobalData("globalUserInfo", {
            "phoneNumber": "15029616602",
            "name": "Migan",
            "gender": "M",
            "weekFreeTime": "晚上",
            "weekendFreeTime": "全天",
            "location": {
                "name": "西安",
                "spellName": "xian",
                "id": 6101,
                "fullname": "陕西/西安",
                "sortLetters": "x"
            }
        });
    }

    componentWillMount() {
        DataUtil.getData("notFirstUse").then((res) => {
            this.setState({
                notFirstUse: res
            })
        }).catch((error) => {
            this.setState({
                notFirstUse: true
            })
        })
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <TabNavigator
                    tabBarStyle={styles.tabBarStyle}>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'home'}
                        title="首页"
                        titleStyle={styles.tabText}
                        selectedTitleStyle={styles.selectedTabText}
                        renderIcon={() => <Image source={require('../../res/images/home_normal.png')}/>}
                        renderSelectedIcon={() => <Image source={require('../../res/images/home_selected.png')}/>}
                        onPress={() => this.setState({selectedTab: 'home'})}>
                        <HomePage navigator={this.props.navigator}/>
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'nearby'}
                        title="附近"
                        titleStyle={styles.tabText}
                        selectedTitleStyle={styles.selectedTabText}
                        renderIcon={() => <Image source={require('../../res/images/nearby_normal.png')}/>}
                        renderSelectedIcon={() => <Image source={require('../../res/images/nearby_selected.png')}/>}
                        onPress={() => this.setState({selectedTab: 'nearby'})}>
                        <Nearby/>
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'match'}
                        title="我的比赛"
                        titleStyle={styles.tabText}
                        selectedTitleStyle={styles.selectedTabText}
                        renderIcon={() => <Image source={require('../../res/images/myMatch_normal.png')}/>}
                        renderSelectedIcon={() => <Image source={require('../../res/images/myMatch_selected.png')}/>}
                        onPress={() => this.setState({selectedTab: 'match'})}>
                        <MyMatchMain navigator={this.props.navigator}/>
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'profile'}
                        title="个人中心"
                        titleStyle={styles.tabText}
                        selectedTitleStyle={styles.selectedTabText}
                        renderIcon={() => <Image source={require('../../res/images/profile_normal.png')}/>}
                        renderSelectedIcon={() => <Image source={require('../../res/images/profile_selected.png')}/>}
                        onPress={() => this.setState({selectedTab: 'profile'})}>
                        <PersonalCenter navigator={this.props.navigator}/>
                    </TabNavigator.Item>
                </TabNavigator>
                {this.state.notFirstUse ? null : <Guide/>}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    tabBarStyle: {
        backgroundColor: "#191919",
    },
    tabText: {
        color: "#b6b6b6",
        fontSize: 10
    },
    selectedTabText: {
        color: "#ffffff",
        fontSize: 10
    }
});


export default TabPage;