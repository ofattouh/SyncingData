/**
 * SyncingData React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import NetInfo from '@react-native-community/netinfo';

export default class App extends React.Component {
  state = {
    isConnected: null,
    syncStatus: null,
    serverResponse: null,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    NetInfo.addEventListener(connectionInfo => {
      // console.log('\nconnectionInfo: ', connectionInfo);

      if (connectionInfo.isConnected) {
        this.setState({isConnected: true});
      } else {
        this.setState({isConnected: false});
        this.setState({syncStatus: 'Pending'});
      }
    });
  }

  submitData(requestBody) {
    return fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    })
      .then(response => {
        return response.text();
      })
      .then(responseText => {
        this.setState({serverResponse: responseText});
        this.setState({syncStatus: 'Completed'});
      })
      .catch(e => {
        console.log(e);
      });
  }

  onSubmitPress = () => {
    const requestBody = {
      title: 'foo',
      body: 'bar',
      userId: 1,
    };

    if (this.state.isConnected) {
      this.setState({syncStatus: 'Syncing...'});
      this.submitData(requestBody);
    } else {
      this.setState({syncStatus: 'Pending'});
    }
  };

  render() {
    const {isConnected, syncStatus, serverResponse} = this.state;

    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.onSubmitPress}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Submit Data</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.status}>
          Network is {isConnected ? 'connected' : 'disconnected'}
        </Text>
        <Text style={styles.status}>Sync Status: {syncStatus}</Text>
        <Text style={styles.status}>Server Response: {serverResponse}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#3E6C7F',
    padding: 15,
    marginBottom: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
  },
  status: {
    fontSize: 22,
    marginBottom: 30,
  },
});

// npx react-native init MyApp
// npm install --save @react-native-community/netinfo
// pod install  // cd ios (autolink @react-native-community/netinfo)
