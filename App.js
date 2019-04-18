import React from 'react';
import { Platform, StatusBar, StyleSheet, View,ScrollView,TextInput,Button,Text } from 'react-native';
import { AppLoading, Asset, Font, Icon, SQLite } from 'expo';
import AppNavigator from './navigation/AppNavigator';

const db = SQLite.openDatabase('db.db');

export default class App extends React.Component {

  componentDidMount() {
    try{
      db.transaction(tx => {
        tx.executeSql(
          'create table if not exists user ( idUser integer NOT NULL primary key, nameUser text NOT NULL,preUser text NOT NULL,mailUser text NOT NULL, passUser text NOT NULL,loginUser text NOT NULL,telUser text DEFAULT NULL, rueUser text DEFAULT NULL,INSEE integer DEFAULT NULL,descUser text DEFAULT NULL)'
        );
      });
      db.transaction(tx => {
        tx.executeSql(
          'select * form user',
          [],
          (_, { rows: { _array } }) => console.log(_array)
        );
      });
      console.log('all is fine');
    }catch(error){
      console.warn('bite',error);
    }
    
  }

  constructor(props){
    super(props);
    this.state = {
      isLoadingComplete: false,
      ident: "",
      pass: "",
      isLog:false,
    };
  }

  _login = async () => {
    let Ident = this.state.ident;
    let Pass = this.state.pass;
    console.log(Ident,Pass);
    try {
      const response = await fetch('http://viabahuet.andreafratani.fr/fetchUser.php?user=' + Ident + '&mdp=' + Pass);
      const responseJson = await response.json();
      if (typeof responseJson.error !== 'undefined') { //Mauvais user ou erreur
        this.setState({
          isLog: false,
          ident: "",
          pass: "",
        });
        alert("Erreur d'identifiant ou de mot de passe.Veuillez réessayer.");
      }else{ 
        // connexion réusi
        this.setState({
          isLog: true
        });
        console.log(responseJson);
        // INSERTION SQLITE
        try {
          db.transaction(tx => {
            tx.executeSql(
              'insert into user [(idUser,nameUser,preUser,mailUser,passUser,loginUser,telUser,rueUser,INSEE,descUser)] values (?,?,?,?,?,?,?,?,?,?)',
              [responseJson.idUser,responseJson.nameUser,responseJson.preUser,responseJson.mailUser,responseJson.passUser,responseJson.loginUser,responseJson.telUser,responseJson.rueUser,responseJson.INSEE,responseJson.descUser]
            )
          });
        } catch (error) {
          console.warn(error);
        }
        
      }
    }// erreur AJAX
    catch (error) {
      console.error(error);
    }
  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      if(this.state.isLog){
        return (
          <View style={styles.container}>
            {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
            <AppNavigator />
          </View>
        );
      }else{
        // FORMULAIRE DE CONNEXION 
        return (
          <View style={styles.container}>
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
              {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
              <TextInput
                style={{height: 40,width:250,marginLeft:15,marginBottom:10}}
                placeholder="Identifiant"
                value={this.state.ident}
                onChangeText={(ident) => this.setState({ident})}
              />
              <TextInput
                style={{height: 40,width:250,marginLeft:15,marginBottom:10}}
                placeholder="Mot de passe"
                value={this.state.pass}
                secureTextEntry={true}
                onChangeText={(pass) =>this.setState({pass})}
              />
              <Button 
              style={{height: 40,width:250,marginLeft:15,marginBottom:10}}
              title="Se connecter" 
              onPress={this._login}></Button>
              <Text style={{padding: 10, fontSize: 42}}>
              Ident :{this.state.ident}
              Pass :{this.state.pass}
            </Text>
            </ScrollView>
          </View>
        );
      }  
    }
  }



  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }, 
  contentContainer: {
    paddingTop: 30,
  },
});
