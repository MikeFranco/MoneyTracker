import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  ToastAndroid,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import {Styles, Colors, Fonts} from './lib/styles';
import Env from './lib/env';
import GoogleService from './lib/google-service';

export default class Account extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: 'User',
      email: '',
      photo: null,
      backupStatus: 'N', // N/S/U + P (Processing)
      backupTime: '',
      userInfo: {},
    };
  }

  componentDidMount() {
    const userInfo = Env.readStorage(Env.key.USER_INFO);
    const backupStatus = Env.readStorage(Env.key.BACKUP_STATUS);
    const backupTime = Env.readStorage(Env.key.BACKUP_TIME);
    this.setState({
      userInfo,
      name: userInfo.user.name,
      email: userInfo.user.email,
      photo: userInfo.user.photo,
      backupStatus: backupStatus === null ? 'N' : backupStatus,
      backupTime: `Último sync: ${backupTime}`,
    });

    this.googleService = new GoogleService();
  }

  backup() {
    if (this.state.backupStatus === 'S') {
      ToastAndroid.show('Copia de seguridad realizada', ToastAndroid.SHORT);
      return;
    }
    ToastAndroid.show('Realizando copia de seguridad..', ToastAndroid.LONG);
    this.setState({
      backupStatus: 'P',
    });

    const database = Env.getDatabase();
    this.googleService.upload(database, () => {
      const backupTime = Env.formatIso(new Date());
      Env.writeStorage(Env.key.BACKUP_STATUS, 'S');
      Env.writeStorage(Env.key.BACKUP_TIME, backupTime);

      this.setState({
        backupStatus: 'S',
        backupTime: `Última copia de seguridad: ${backupTime}`,
      });
      ToastAndroid.show('Respaldo completado', ToastAndroid.SHORT);
    });
  }

  reset() {
    Alert.alert(
      'Borrar datos',
      '¿Estás seguro de que deseas borrar tus datos?',
      [
        {
          text: 'Cancelar',
        },
        {
          text: 'Sí',
          onPress: () => {
            // delete all data including backup file
            Env.reset();
            if (this.state.userInfo.isGoogle) {
              this.googleService.deleteBackup(() => {});
              this.googleService.signOut(() => {
                // remove local storage
                Env.writeStorage(Env.key.ACCESS_TOKEN, null);
                Env.writeStorage(Env.key.USER_INFO, null);
                this.props.navigation.reset({
                  index: 0,
                  routes: [{name: 'signin'}],
                });
              });
            } else {
              Env.reset();
              Env.writeStorage(Env.key.USER_INFO, null);
              this.props.navigation.reset({
                index: 0,
                routes: [{name: 'signin'}],
              });
            }

            Alert.alert(
              'Reinicio completo',
              'Por favor, inicia sesión nuevamente',
            );
          },
        },
      ],
    );
  }

  signOut = () => {
    // TODO: implement double click to prevent unwanted signout

    const backupStatus = Env.readStorage(Env.key.BACKUP_STATUS);
    if (backupStatus === 'S') {
      this.doSignOut();
    } else {
      Alert.alert(
        'ATENCIÓN',
        'Por favor, realiza una copia de seguridad antes de que cierres sesión o tus datos se perderán',
        [
          {
            text: 'CANCELAR',
          },
          {
            text: 'CERRAR SESIÓN',
            onPress: () => {
              this.doSignOut();
            },
          },
        ],
      );
    }
  };

  doSignOut() {
    if (this.state.userInfo.user.isGoogle) {
      Env.reset();
      this.googleService.signOut(() => {
        // remove local storage
        Env.writeStorage(Env.key.ACCESS_TOKEN, null);
        Env.writeStorage(Env.key.USER_INFO, null);

        this.props.navigation.reset({
          index: 0,
          routes: [{name: 'signin'}],
        });
      });
    } else {
      Env.writeStorage(Env.key.USER_INFO, null);
      Env.reset();

      this.props.navigation.reset({
        index: 0,
        routes: [{name: 'signin'}],
      });
    }
  }

  renderHeader() {
    return (
      <View>
        <StatusBar backgroundColor={Colors.primary} barStyle="dark-content" />
        <View style={Styles.accountHeaderBox}>
          <View style={[Styles.actionbarBox, {elevation: 0}]}>
            <TouchableOpacity
              style={Styles.backButton}
              onPress={() => {
                this.props.navigation.reset({
                  index: 0,
                  routes: [{name: 'home'}],
                });
              }}>
              <Image
                style={Styles.icon18}
                source={require('./asset/back.png')}
              />
            </TouchableOpacity>
            <Text style={Styles.actionbarTitle}>Cuenta</Text>
          </View>

          <View style={Styles.accountNameBox}>
            <Text style={Styles.accountName}>{this.state.name}</Text>
            <Text style={Styles.accountEmail}>{this.state.email}</Text>
          </View>
        </View>
        <View style={Styles.accountPhotoBox}>
          <Image
            style={Styles.accountPhoto}
            source={
              this.state.photo
                ? {uri: this.state.photo}
                : require('./asset/default-account-img.png')
            }
          />
        </View>
      </View>
    );
  }

  renderMenuItem(imageSource, title, showBorder, doEvent) {
    return (
      <TouchableOpacity onPress={doEvent}>
        <View style={Styles.accountMenuItem}>
          <Image style={Styles.accountMenuIcon} source={imageSource} />
          <View
            style={[
              Styles.accountMenuTextBox,
              {borderBottomWidth: showBorder ? 1 : 0},
            ]}>
            <Text style={Styles.accountMenuText}>{title}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  renderBackupMenu() {
    return (
      <>
        {this.state.userInfo?.user?.isGoogle && (
          <View style={[Styles.accountMenuBox, {marginTop: 40}]}>
            <TouchableOpacity
              onPress={() => {
                this.backup();
              }}>
              <View style={Styles.accountMenuItem}>
                <Image
                  style={Styles.accountMenuIcon}
                  source={require('./asset/backup.png')}
                />
                <View style={Styles.accountMenuTextBox}>
                  <Text style={Styles.accountMenuText}>
                    {'Realizar copia de seguridad con Google'}
                  </Text>
                  {this.state.backupStatus !== 'N' && (
                    <Text style={Styles.legendText}>
                      {this.state.backupTime}
                    </Text>
                  )}
                </View>
                <View style={Styles.versionTextBox}>
                  {this.renderSyncIcon()}
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
        {!this.state.userInfo?.user?.isGoogle && (
          <View style={[Styles.accountMenuBox, {marginTop: 40}]}>
            <TouchableOpacity
              onPress={() => {
                this.backup();
              }}>
              <View style={Styles.accountMenuItem}>
                <Image
                  style={Styles.accountMenuIcon}
                  source={require('./asset/backup.png')}
                />
                <View style={Styles.accountMenuTextBox}>
                  <Text style={Styles.accountMenuText}>
                    {'Realizar copia de seguridad local'}
                  </Text>
                  {this.state.backupStatus !== 'N' && (
                    <Text style={Styles.legendText}>
                      {this.state.backupTime}
                    </Text>
                  )}
                </View>
                <View style={Styles.versionTextBox}>
                  {this.renderSyncIcon()}
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </>
    );
  }

  renderSyncIcon() {
    if (this.state.backupStatus === 'S') {
      return (
        <Image style={Styles.icon18} source={require('./asset/sync.png')} />
      );
    }
    if (this.state.backupStatus === 'U') {
      return (
        <Image style={Styles.icon18} source={require('./asset/unsync.png')} />
      );
    } else if (this.state.backupStatus === 'P') {
      return <ActivityIndicator color={Colors.primary} />;
    }
    return null;
  }

  render() {
    return (
      <View style={Styles.sceneBox}>
        {this.renderHeader()}

        <ScrollView>
          {this.renderBackupMenu()}

          <View style={Styles.accountMenuBox}>
            {this.renderMenuItem(
              require('./asset/categories.png'),
              'Categorías',
              true,
              () => {
                this.props.navigation.navigate('categories');
              },
            )}
          </View>

          <View style={Styles.accountMenuBox}>
            {this.renderMenuItem(
              require('./asset/reset.png'),
              'Borrar datos',
              true,
              () => {
                this.reset();
              },
            )}
            <TouchableOpacity
              onPress={() => {
                Alert.alert('MoneyTracker', 'by Mike Franco');
              }}>
              <View style={Styles.accountMenuItem}>
                <Image
                  style={Styles.accountMenuIcon}
                  source={require('./asset/about.png')}
                />
                <View style={Styles.accountMenuTextBox}>
                  <Text style={Styles.accountMenuText}>{'Acerca de'}</Text>
                </View>
                <View style={Styles.versionTextBox}>
                  <Text style={Styles.versionText}>{'v1.0'}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View style={Styles.accountMenuBox}>
            <TouchableOpacity onPress={this.signOut}>
              <View style={Styles.signoutButton}>
                <Text style={Styles.signoutText}>Cerrar sesión</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}
