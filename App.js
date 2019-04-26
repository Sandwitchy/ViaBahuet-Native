import React from 'react';
import { Platform, StatusBar, StyleSheet, View,ScrollView,TextInput,Button,Text } from 'react-native';
import { AppLoading, Asset, Font, Icon, SQLite } from 'expo';
import AppNavigator from './navigation/AppNavigator';

const db = SQLite.openDatabase('db.db');

export default class App extends React.Component {

  componentDidMount() {
      db.transaction(
        tx => {
           /*
            tx.executeSql(
              'drop table user;'
              ,[], (_, { rowsAffected }) =>
              console.log(JSON.stringify(rowsAffected))
            , (_, error) =>
              console.log(error)
            );
          // */
          tx.executeSql(
            'create table if not exists user( iduser integer not null, nameuser text not null,photouser text not null, preuser text not null, mailuser text not null, passuser text not null, loginuser text not null,teluser text, rueuser text, insee integer, descuser text, islog integer not null);'
            ,[], (_, { rowsAffected }) =>
            console.log(JSON.stringify(rowsAffected))
          , (_, error) =>
            console.log(error)
          );
          tx.executeSql('select * from user', [], (_, { rows }) =>
            console.log(JSON.stringify(rows))
          , (_, error) =>
            console.log(error)
          );
          tx.executeSql(
            'update user set islog = 0 where islog = 1;', []
          );
      });
  }
  state = {
    isLoadingComplete: false,
    ident: "",
    pass: "",
    isLog:false,
  };

  _login = async () => { 

    let Ident = this.state.ident;
    let Pass = this.state.pass;

    try {
      const response = await fetch('http://viabahuet.andreafratani.fr/fetchUser.php?user=' + Ident + '&mdp=' + Pass);
      const responseJson = await response.json();
      if (typeof responseJson.error !== 'undefined'){ //Mauvais user ou erreur
        this.setState({
          isLog: false,
          ident: "",
          pass: "",
        });
        alert("Erreur d'identifiant ou de mot de passe.Veuillez réessayer.");

      }else{ 
        
          // INSERTION SQLITE
          await db.transaction(tx => {
                  tx.executeSql(
                    'delete from user where iduser = ?',
                    [responseJson.idUser],
                    (_, { rowsAffected  }) => console.log("Affected delete:",JSON.stringify( rowsAffected )),
                    (_, error) => console.log(error)
                  );
                  tx.executeSql(
                    'insert into user (iduser, nameuser, preuser , descuser, mailuser, loginuser, passuser, insee, rueuser, photouser, islog) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)',
                    [responseJson.idUser,responseJson.nameUser,responseJson.preUser,responseJson.descUser,responseJson.mailUser,responseJson.loginUser,responseJson.passUser,responseJson.INSEE,responseJson.rueUser,responseJson.photoUser],
                    (_, { rowsAffected  }) => console.log("Affected :",JSON.stringify( rowsAffected )),
                    (_, error) => console.log(error)
                  );
                });
          // connexion réusi
          this.setState({
            isLog: true
          });
        
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
              </Text>
              <Text style={{padding: 10, fontSize: 42}}>
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
