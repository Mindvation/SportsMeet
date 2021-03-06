import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Dimensions,
    Alert
} from 'react-native';
import ShareMatch from '../common/ShareMatch';
import CommonUtil from '../util/CommonUtil';
import FetchUtil from '../util/FetchUtil';
import Overlay from '../common/Overlay';

const {width} = Dimensions.get('window');

import {matchArrange} from '../data/Arrangement';

export default class MatchDetail extends Component {
    constructor(props) {
        super(props);
        this._shareMatch = this._shareMatch.bind(this);
        this.state = {
            shareModalVisible: false,
            overlayVisible: false
        };
    }

    _shareMatch() {
        this.setState({
            shareModalVisible: true
        })
    }

    _joinMatch(matchInfo, status) {
        const {update} = this.props;
        if (status === "y") {
            Alert.alert(
                "提示",
                "您已加入该比赛",
                [
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                ],
                {cancelable: false}
            );
            return;
        }

        if (matchInfo.joinedAmmount === matchInfo.totalNumber) {
            Alert.alert(
                "提示",
                "该比赛人数已满!",
                [
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                ],
                {cancelable: false}
            );
            return;
        }

        const options = {
            "url": '8086/sports-meetup-papi/matches/joinMatch',
            "params": {
                "matchId": matchInfo.matchId,
                "userId": globalUserInfo.userId
            }
        };

        this.setState({
            overlayVisible: true,
        });

        FetchUtil.post(options).then((res) => {
            this.setState({
                overlayVisible: false
            });

            update && update(res.responseBody);

        }).catch((error) => {
            this.setState({
                overlayVisible: false,
            });
            Alert.alert(
                error.code,
                error.message,
                [
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                ],
                {cancelable: false}
            );
        })
    }

    getUserStatusInMatch(creator, appUsers) {
        let status = 'n';
        if (creator && creator.createdId === globalUserInfo.userId) {
            return 'y';
        }
        appUsers.some((appUser) => {
            if (appUser.userId === globalUserInfo.userId) {
                status = appUser.applyResult;
                return true;
            }
        });

        return status;
    }

    render() {
        const {matchInfo} = this.props;
        if (!matchInfo.fieldType) {
            return;
        }
        /*const test = {
            "date": null,
            "startTime": "2017-09-01 16:00:00",
            "endTime": "2017-09-21 18:00:00",
            "matchType": "4",
            "fieldType": "080104",
            "totalNumber": "8",
            "joinedAmmount": 4,
            "address": null
        };*/
        const blueTeam = Math.round(matchInfo.joinedAmmount / 2);
        const redTeam = matchInfo.joinedAmmount - blueTeam;
        const blueTeamLeft = matchInfo.totalNumber / 2 - blueTeam;
        const redTeamLeft = matchInfo.totalNumber / 2 - redTeam;
        const startTime = CommonUtil.dateFormat(CommonUtil.parseDate(matchInfo.startTime), "hh:mm:ss");
        const endTime = CommonUtil.dateFormat(CommonUtil.parseDate(matchInfo.endTime), "hh:mm:ss");
        let arrangeInfo = matchArrange[matchInfo.totalNumber / 2];
        let teamAAccount = 0;
        let teamBAccount = 0;
        const status = this.getUserStatusInMatch(matchInfo.createdUserInfo, matchInfo.appliedUsersInfo);
        const UniformRed = arrangeInfo.icon === 2 ?
            <Image style={styles.uniform2x}
                   source={require('../../res/images/matchInfo/uniform_red2x.png')}/> :
            <Image style={styles.uniform3x}
                   source={require('../../res/images/matchInfo/uniform_red3x.png')}/>;
        const UniformBlue = arrangeInfo.icon === 2 ? <Image style={styles.uniform2x}
                                                            source={require('../../res/images/matchInfo/uniform_blue2x.png')}/> :
            <Image style={styles.uniform3x}
                   source={require('../../res/images/matchInfo/uniform_blue3x.png')}/>;
        const UniformAdd = arrangeInfo.icon === 2 ? <Image style={styles.uniform2x}
                                                           source={require('../../res/images/matchInfo/uniform_add2x.png')}/> :
            <Image style={styles.uniform3x}
                   source={require('../../res/images/matchInfo/uniform_add3x.png')}/>;

        const arrangeArray = arrangeInfo.arrange;
        const contHeight = arrangeInfo.contHeight;
        return (<View style={[styles.mainCont, {height: contHeight}]}>
            <Image source={require('../../res/images/matchInfo/backImg.png')}
                   style={styles.bgImage}/>
            <View style={styles.matchCont}>
                <View style={styles.matchTimeCont}>
                    <Image style={styles.matchTimeImg} source={require('../../res/images/matchInfo/time.png')}/>
                    <Text style={styles.matchTimeText}>
                        {"时间：" + startTime + "  -  " + endTime}
                    </Text>
                </View>
                <View style={styles.playerInfoCont}>
                    <View style={styles.leftCont}>
                        {arrangeArray.map((result, i) => {
                            return <View key={i} style={styles.columnCont}>
                                {result.map((innerRes, j) => {
                                    teamAAccount++;
                                    return (teamAAccount - 1 + redTeamLeft >= matchInfo.totalNumber / 2) ?
                                        <View key={j} style={styles.imageCont}>{UniformAdd}</View> :
                                        <View key={j} style={styles.imageCont}>{UniformRed}</View>;
                                })}
                            </View>
                        })}

                    </View>
                    <View style={styles.middleCont}>
                        <Text style={styles.middleText}>VS</Text>
                    </View>
                    <View style={styles.rightCont}>
                        {arrangeArray.map((result, i) => {
                            return <View key={i} style={styles.columnCont}>
                                {result.map((innerRes, j) => {
                                    teamBAccount++;
                                    return (teamBAccount - 1 + blueTeamLeft >= matchInfo.totalNumber / 2) ?
                                        <View key={j} style={styles.imageCont}>{UniformAdd}</View> :
                                        <View key={j} style={styles.imageCont}>{UniformBlue}</View>;
                                })}
                            </View>
                        }).reverse()}
                    </View>
                </View>
                <View style={styles.bottomCont}>
                    <View style={styles.shareCont}>
                        <TouchableOpacity onPress={this._shareMatch}>
                            <View style={styles.sharePressRange}>
                                <Image style={styles.shareImg}
                                       source={require('../../res/images/matchInfo/share.png')}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={[styles.joinCont, {backgroundColor: status === "y" ? "#f1a025" : '#f12b2c'}]}>
                        <TouchableOpacity onPress={() => this._joinMatch(matchInfo, status)}>
                            <View>
                                <Text
                                    style={styles.joinText}>{status === "y" ? " 已加入 " : " 立即加入 "}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <ShareMatch
                closeHandle={() => {
                    this.setState({
                        shareModalVisible: false
                    })
                }}
                modalVisible={this.state.shareModalVisible}/>
            <Overlay
                allowClose={false}
                modalVisible={this.state.overlayVisible}
            />
        </View>)
    }
}

const styles = StyleSheet.create({
    mainCont: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8
    },
    matchCont: {
        flex: 1
    },
    matchTimeCont: {
        height: 30,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        marginLeft: 15
    },
    matchTimeImg: {
        width: 20,
        height: 20,
        marginRight: 10
    },
    matchTimeText: {
        fontSize: 17,
        color: '#ffffff'
    },
    playerInfoCont: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 30,
        marginRight: 30
    },
    leftCont: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    bgImage: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        resizeMode: 'stretch',
        width: null,
        height: null,
        position: 'absolute',
        left: 0,
        bottom: 0,
        right: 0,
        top: 0
    },
    middleCont: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 50
    },
    middleText: {
        fontSize: 20,
        color: '#E8E8E8',
    },
    rightCont: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    columnCont: {
        marginLeft: 10,
        marginRight: 10,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageCont: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    uniform2x: {
        width: 25,
        height: 25,
    },
    uniform3x: {
        width: 50,
        height: 50
    },
    bottomCont: {
        height: 40,
        backgroundColor: '#323232',
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    shareCont: {
        width: 120,
        backgroundColor: '#191919',
        height: 40,
    },
    sharePressRange: {
        width: 120,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    joinCont: {
        width: 170,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    shareImg: {
        width: 25,
        height: 25
    },
    joinText: {
        fontSize: 24,
        color: '#E8E8E8',
        fontStyle: 'italic',
        fontWeight: "bold"
    },
    shareTrdCont: {
        width: width,
        height: 130,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingLeft: 60,
        paddingRight: 60
    },
    shareImageCont: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    shareImage: {
        width: 45,
        height: 45
    },
    shareImageText: {
        marginTop: 15
    }
});