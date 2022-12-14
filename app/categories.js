import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  ToastAndroid,
} from 'react-native';
import Cicon from './comp/cicon';
import {Colors, Styles} from './lib/styles';
import Env from './lib/env';

export default class Categories extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tabSelectedIndex: 0,
      eCategories: [],
      iCategories: [],
    };
  }

  componentDidMount() {
    let eCategories = Env.getCategories(null, Env.EXPENSE_TYPE);
    let iCategories = Env.getCategories(null, Env.INCOME_TYPE);
    this.setState({eCategories, iCategories});
  }

  setCategories() {
    if (this.state.tabSelectedIndex === 0) {
      let eCategories = Env.getCategories(null, Env.EXPENSE_TYPE);
      this.setState({eCategories: eCategories});
    } else {
      let iCategories = Env.getCategories(null, Env.INCOME_TYPE);
      this.setState({iCategories: iCategories});
    }
  }

  deleteCategory(id) {
    Alert.alert(
      'Borrar categoría',
      'Borrar esta categoría también borrará todos los registros de ésta.',
      [
        {
          text: 'Cancelar',
        },
        {
          text: 'Borrar categoría',
          onPress: () => {
            Env.deleteCategory(id);
            this.setCategories();
            Env.changeBackupStatus();
            ToastAndroid.show(
              'Categoría borrada con éxito',
              ToastAndroid.SHORT,
            );
          },
        },
      ],
    );
  }

  renderTab() {
    return (
      <View>
        <View style={[Styles.actionbarBox, {elevation: 0}]}>
          <TouchableOpacity
            style={Styles.backButton}
            onPress={() => {
              this.props.navigation.reset({
                index: 0,
                routes: [{name: 'account'}],
              });
            }}>
            <Image style={Styles.icon18} source={require('./asset/back.png')} />
          </TouchableOpacity>
          <Text style={Styles.actionbarTitle}>Categorías</Text>
        </View>
        <View style={Styles.tabBox}>
          <TouchableOpacity
            style={[
              Styles.center,
              this.state.tabSelectedIndex === 0 ? Styles.tabSelected : null,
            ]}
            onPress={() => this.setState({tabSelectedIndex: 0})}>
            <Text>Gastos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              Styles.center,
              this.state.tabSelectedIndex === 1 ? Styles.tabSelected : null,
            ]}
            onPress={() => this.setState({tabSelectedIndex: 1})}>
            <Text>Ingresos</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderCategories(categories) {
    return (
      <FlatList
        data={categories}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => {
          return (
            <View style={Styles.listIconBox}>
              <Cicon style={{marginRight: 15}} icon={item.icon} />
              <Text style={{flex: 1, color: Colors.black}}>{item.title}</Text>
              <TouchableOpacity
                style={Styles.deleteIconBox}
                onPress={() => this.deleteCategory(item.id)}>
                <Image
                  style={Styles.icon18}
                  source={require('./asset/delete.png')}
                />
              </TouchableOpacity>
            </View>
          );
        }}
      />
    );
  }

  render() {
    return (
      <View style={Styles.sceneBox}>
        {this.renderTab()}
        {this.state.tabSelectedIndex == 0
          ? this.renderCategories(this.state.eCategories)
          : this.renderCategories(this.state.iCategories)}
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('addCategory', {
              transactionType:
                this.state.tabSelectedIndex === 0
                  ? Env.EXPENSE_TYPE
                  : Env.INCOME_TYPE,
            });
          }}>
          <View style={Styles.listAddBox}>
            <Image
              style={[Styles.icon12, {marginRight: 5}]}
              source={require('./asset/add.png')}
            />
            <Text style={{fontWeight: 'bold', color: Colors.black}}>Agregar categoría</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
