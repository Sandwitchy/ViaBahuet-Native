import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  View,
} from 'react-native';
import { SQLite } from 'expo';

const db = SQLite.openDatabase('db.db');


export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: "Mon Profil",
  };
  state = {
    //mode = 0 (read) || mode = 1 (write)
    mode : 0,
    items: null,
    change: null,
  };
  
  componentDidMount(){
    db.transaction(tx => {
      tx.executeSql(
        `select * from user where islog = ?;`,
        [1],
        (_, { rows: { _array } }) => this.setState({ items: _array}),
        (_, error) => console.log(error)
      );
    });
    if(this.state.change == null){
      const items =  this.state.items;
      const changenew = items;                        //updating value
      if(changenew != null){
        console.log(changenew,items);
      }
      this.setState({change: changenew});
      console.log("change:",this.state.change);
    }
  }

  _setMode(bool) {
    this.setState({mode : bool});
  }
  render() {
    var { items } = this.state;
    if((items == null)||(items.lenght == 0)){
     // Loading Screen
      return(
        <View>
          <ScrollView>
            <Image  style={{
                          width: 400,
                          height: 400,
                          resizeMode: 'contain',
                        }} 
                    source={ require('./../assets/images/pizza.gif')} />
          </ScrollView>
        </View>
      );
    }
    //*************************************************
    // mode read
    //*************************************************
    if(this.state.mode == 0){
      return (
        <View style={styles.container}>
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
              {items.map(({ nameuser,preuser,photouser, teluser, rueuser,descuser }) => (
                <View key={'parent'}>
                  <View style={{flex: 1, flexDirection: 'row'}} key={'top'}>
                      <Image style={{
                          width: 150,
                          height: 150,
                          resizeMode: 'contain',
                          marginLeft: 5,
                          marginRight: 10,
                          marginBottom: 10,
                        }} source={{
                          uri: photouser
                        }}/>
                        <View style={{width: 150, height: 150,}} key={'infos1'}>
                          <Text key={nameuser}>
                           <Text style={styles.important}>Nom : </Text>{nameuser} {'\n'}
                           <Text style={styles.important}>Prénom :</Text>{preuser}{'\n'}
                           <Text style={styles.important}>Téléphone :</Text> {teluser}
                          </Text>
                        </View>
                        <TouchableHighlight onPress={() => this._setMode(1)}>
                          <Image
                            style={styles.button}
                            source={require('./../assets/images/edit.png')}
                          />
                        </TouchableHighlight>
                  </View>
                  <View  key={'infos2'}>
                    <Text>
                      <Text style={styles.important}>Adresse :</Text> {rueuser}{'\n'}
                      <Text style={styles.important}>Description :</Text> {descuser}
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
                <View key={'parent'}>
                  <View style={{flex: 1, flexDirection: 'row'}} key={'top'}>
                      <Image style={{
                          width: 150,
                          height: 150,
                          resizeMode: 'contain',
                        }} source={{
                          uri: this.state.change.photouser
                        }}/>
                        <View style={{width: 150, height: 150,}} key={'infos1'}>
                          <TextInput
                            style={styles.form}
                            placeholder="Votre nom"
                            value={this.state.change.nameuser}
                            onChangeText={(nameuser) =>this.setState({change: { nameuser}})}
                          />
                           <TextInput
                            style={styles.form}
                            placeholder="Votre prénom"
                            value={this.state.change.preuser}
                            onChangeText={(preuser) =>this.setState({change: { preuser}})}
                          />
                        </View>
                        <TouchableHighlight onPress={() => this._setMode(0)}>
                          <Image
                            style={styles.button}
                            source={require('./../assets/images/edit.png')}
                          />
                        </TouchableHighlight>
                  </View>
                </View>
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
  form: {
    height: 40,
    width:250,
    marginLeft:15,
    marginBottom:10,
    borderBottomColor: 'grey',
    borderBottomWidth: 1
  },
  button:{
    height:30,
    width: 30,
    left:0,
    top:0,
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
