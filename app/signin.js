import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  Alert,
  ToastAndroid,
  TouchableOpacity,
  Button,
} from 'react-native';
import {StackActions, NavigationActions} from 'react-navigation';
import {Styles, Colors} from './lib/styles';
import GoogleService from './lib/google-service';
import Env from './lib/env';

export default class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      name: '',
      isSignInWithEmail: true,
      keyboardShow: false,
    };
  }

  onKeyboardDidShow(e) {
    // const { height, screenX, screenY, width } = e.endCoordinates;
    this.setState({keyboardShow: true});
  }
  onKeyboardDidHide(e) {
    this.setState({keyboardShow: false});
  }
  componentDidMount() {
    this.googleService = new GoogleService();
  }

  redirectToHome(userInfo) {
    ToastAndroid.show(`Welcome, ${userInfo.user.name}`, ToastAndroid.SHORT);
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: 'home',
        }),
      ],
    });
    this.props.navigation.navigate('home');
  }

  signIn = () => {
    this.googleService.signIn((userInfo, fileId, backupData) => {
      if (backupData !== null) {
        Alert.alert(
          'Copia de seguridad encontrada',
          '¿Deseas reestablecer tus datos?',
          [
            {
              text: 'NO',
              onPress: () => {
                // init default categories
                Env.initDefaultCategories();

                this.redirectToHome(userInfo);
              },
            },
            {
              text: 'SI',
              onPress: () => {
                // restoring data
                Env.restoreDatabase(fileId, backupData);

                this.redirectToHome(userInfo);
              },
            },
          ],
        );
      } else {
        this.redirectToHome(userInfo);
      }
    });
  };

  signInwithEmail = () => {
    const userInfo = {
      user: {
        email: this.state.email,
        name: this.state.name,
        photo: null,
      }
    };
    this.redirectToHome(userInfo);
  };

  render() {
    const {isSignInWithEmail, email, name} = this.state;
    return (
      <View style={[Styles.sceneBox, Styles.center]}>
        <TouchableOpacity style={Styles.googleButton} onPress={this.signIn}>
          <Image style={Styles.icon24} source={require('./asset/google.png')} />
          <Text style={Styles.googleButtonText}>Iniciar sesión con Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={Styles.emailButton}
          onPress={() =>
            this.setState({isSignInWithEmail: !isSignInWithEmail})
          }>
          <Image style={Styles.icon24} source={require('./asset/sobre.png')} />
          <Text style={Styles.emailButtonText}>
            Iniciar sesión con correo electrónico
          </Text>
        </TouchableOpacity>

        {isSignInWithEmail && (
          <>
            <View
              style={[
                Styles.boardBox,
                {
                  height: this.state.keyboardShow ? 50 : 130,
                  width: '78%',
                  margin: 10,
                  padding: 15,
                },
              ]}>
              <TextInput
                style={Styles.signInwithEmailInput}
                autoCorrect={false}
                underlineColorAndroid={Colors.primary}
                placeholder={'Email'}
                onChangeText={text => this.setState({email: text})}
                value={this.state.email}
              />
              <TextInput
                style={Styles.signInwithEmailInput}
                autoCorrect={false}
                underlineColorAndroid={Colors.primary}
                placeholder={'Nombre'}
                onChangeText={text => this.setState({name: text})}
                value={this.state.name}
              />
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                maxHeight: 40,
                justifyContent: 'space-around',
                width: '77%',
              }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  textColor: 'black',
                  backgroundColor: Colors.white,
                  maxWidth: 100
                }}
                onPress={() =>
                  this.setState({isSignInWithEmail: !isSignInWithEmail})
                }>
                <View
                  style={Styles.emailButtonOptionContainer}>
                  <Text
                    style={Styles.emailButtonOption}>
                    Cancelar
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={{flex: 1, backgroundColor: Colors.primary, maxWidth: 150}}
                onPress={() => this.signInwithEmail()}>
                <View
                  style={Styles.emailButtonOptionContainer}>
                  <Text
                    style={Styles.emailButtonOption}>
                    Iniciar sesión
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    );
  }
}
