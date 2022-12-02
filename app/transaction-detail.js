import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import Cicon from './comp/cicon';
import {Styles} from './lib/styles';
import Env from './lib/env';

export default class TransactionDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: null, // category title
      icon: null,
      color: null,
      type: null,
      amount: null,
      date: null,
      memo: null,
    };
  }

  componentDidMount() {
    let transactionId = this.props.route.params.transactionId;

    this.transaction = Env.getTransaction(transactionId);
    this.setTransaction(this.transaction);
  }

  setTransaction(transaction) {
    let category = Env.getCategories(transaction.categoryId, null);

    this.setState({
      title: category.title,
      icon: category.icon,
      color: category.color,
      type: transaction.type,
      amount: Env.formatCurrency(transaction.amount),
      date: Env.formatFullDate(transaction.date),
      memo: transaction.memo,
    });
  }

  deleteTransaction(id) {
    Alert.alert('Borrar registro', '¿Estás seguro de borrar este registro?', [
      {
        text: 'NO',
      },
      {
        text: 'SI',
        onPress: () => {
          Env.deleteTransaction(id);

          Env.changeBackupStatus();

          ToastAndroid.show('Registro eliminado', ToastAndroid.SHORT);
          this.props.navigation.reset({
            index: 0,
            routes: [{name: 'home'}],
          });
        },
      },
    ]);
  }

  renderActionBar() {
    return (
      <View style={Styles.actionbarBox}>
        <TouchableOpacity
          style={Styles.backButton}
          onPress={() => {
            this.props.navigation.reset({
              index: 0,
              routes: [{name: 'home'}],
            });
          }}>
          <Image style={Styles.icon18} source={require('./asset/back.png')} />
        </TouchableOpacity>
        <Text style={Styles.actionbarTitle}>Detalles</Text>
        <TouchableOpacity
          style={Styles.backButton}
          onPress={() => this.deleteTransaction(this.transaction.id)}>
          <Image style={Styles.icon18} source={require('./asset/delete.png')} />
        </TouchableOpacity>
      </View>
    );
  }

  renderEditButton() {
    return (
      <TouchableOpacity
        style={Styles.detailEditButton}
        onPress={() => {
          this.props.navigation.navigate('addTransaction', {
            transaction: this.transaction,
          });
        }}>
        <Image style={Styles.icon14} source={require('./asset/edit.png')} />
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={Styles.sceneBox}>
        {this.renderActionBar()}

        <View style={Styles.detailBox}>
          <View style={Styles.detailCategoryBox}>
            <Cicon
              style={{marginRight: 40}}
              icon={this.state.icon}
              color={this.state.color}
            />
            <Text style={Styles.detailTitle}>{this.state.title}</Text>
          </View>

          <View style={Styles.detailItemBox}>
            <Text style={Styles.detailItem}>Tipo</Text>
            <Text style={Styles.detailValue}>{this.state.type}</Text>
          </View>
          <View style={Styles.detailItemBox}>
            <Text style={Styles.detailItem}>Monto</Text>
            <Text style={Styles.detailValue}>{this.state.amount}</Text>
          </View>
          <View style={Styles.detailItemBox}>
            <Text style={Styles.detailItem}>Fecha</Text>
            <Text style={Styles.detailValue}>{this.state.date}</Text>
          </View>
          <View style={Styles.detailItemBox}>
            <Text style={Styles.detailItem}>Título</Text>
            <Text style={Styles.detailValue}>{this.state.memo}</Text>
          </View>
        </View>

        {this.renderEditButton()}
      </View>
    );
  }
}
