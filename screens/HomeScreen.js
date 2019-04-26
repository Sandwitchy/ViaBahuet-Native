import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebBrowser,SQLite } from 'expo';

import { MonoText } from '../components/StyledText';

const db = SQLite.openDatabase('db.db');


export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  state = {
    //mode = 0 (read) || mode = 1 (write)
    mode : 0,
    items: null
  };
  
  componentDidMount(){
    db.transaction(tx => {
      tx.executeSql(
        `select * from user where islog = ?;`,
        [1],
        (_, { rows: { _array } }) => this.setState({ items: _array })
      );
    });
  }

  render() {
    var { items } = this.state;
    if((items == null)||(items.lenght == 0)){
      return null;
    }
    //*************************************************
    // mode read
    //*************************************************
    if(this.state.mode == 0){
      return (
        <View style={styles.container}>
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
              {items.map(({ nameuser,preuser,photouser }) => (
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <Image style={{
                        width: 150,
                        height: 150,
                        resizeMode: 'contain',
                      }} source={{
                        uri: photouser
                      }}/>
                      <View style={{width: 150, height: 150,}}>
                        <Text style={styles.important}>
                          {nameuser}
                        </Text>
                        <Text style={styles.important}>
                          {preuser}
                        </Text>
                      </View>
                </View>
              ))}
          </ScrollView>
        </View>
      );
    }else{
      //*************************************************
      // mode write
      //*************************************************
      return (
        <View style={styles.container}>
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
              {items.map(({ nameuser,preuser,photouser }) => (
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <Image style={{
                        width: 150,
                        height: 150,
                        resizeMode: 'contain',
                      }} source={{
                        uri: photouser
                      }}/>
                      <View style={{width: 150, height: 150,}}>
                        <Text style={styles.important}>
                          {nameuser}
                        </Text>
                        <Text style={styles.important}>
                          {preuser}
                        </Text>
                      </View>
                </View>
              ))}
          </ScrollView>
        </View>
      );
    }
   
  }
}

const styles = StyleSheet.create({
  important: {
    fontSize: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
    marginLeft: 10
  },
});
