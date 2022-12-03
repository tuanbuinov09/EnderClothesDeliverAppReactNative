/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
// eslint-disable-next-line prettier/prettier
// import type { Node, useState, navigate, useEffect } from 'react';
import type {Node, useState, navigate, useEffect} from 'react';
import axios from 'react-native-axios';
// import {NavigationContainer} from '@react-navigation/native';
// import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import FlatListBasics from './src/FlatListView/FlatListBasics';
// import Login from './src/Login/Login';

/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */
// eslint-disable-next-line prettier/prettier
const Section = ({ children, title }): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const Login = ({navigation}) => {
  const storeData = async value => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('employee', jsonValue);
      console.log('done saving');
    } catch (e) {
      // saving error
      console.log('saving errpr');
    }
  };

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('employee');
      console.log(jsonValue);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
      console.log('getting errpr');
    }
  };

  const removeData = async () => {
    try {
      await AsyncStorage.removeItem('employee');
      console.log('=============== done removing');
    } catch (e) {
      // error reading value
      console.log('removing errpr');
    }
  };

  const getCartsEmpDelivering = async () => {
    try {
      const a = await getData();
      console.log(103, a);
      const empId = a.MA_NV;
      console.log(105, empId);
      setIsLoading(true);
      let url = `http://localhost:22081/api/NhanVien/delivering-by-emp?deliverEmpId=${empId}`;
      console.log(url);
      axios.get(url).then(res => {
        const cartsFromApi = res.data;
        // console.log(cartsFromApi);
        cartsFromApi.forEach(cart => {
          if (cart.NGAY_TAO) {
            let date = new Date(cart.NGAY_TAO);
            cart.NGAY_TAO = date.toLocaleDateString('vi-VN');
            console.log(
              new Intl.DateTimeFormat('vi-VN', {dateStyle: 'short'}).format(
                date,
              ),
            );
            cart.NGAY_TAO = new Intl.DateTimeFormat('vi-VN', {
              dateStyle: 'short',
            }).format(date);
          }
          if (cart.NGAY_GIAO) {
            let date = new Date(cart.NGAY_GIAO);
            cart.NGAY_GIAO = date.toLocaleDateString('vi-VN');
            console.log(
              new Intl.DateTimeFormat('vi-VN', {dateStyle: 'short'}).format(
                date,
              ),
            );
            cart.NGAY_GIAO = new Intl.DateTimeFormat('vi-VN', {
              dateStyle: 'short',
            }).format(date);
          }
          if (cart.TRANG_THAI === 0) {
            cart.TRANG_THAI_STR = 'Chờ duyệt';
          }
          if (cart.TRANG_THAI === 1) {
            cart.TRANG_THAI_STR = 'Đang giao hàng';
          }
          if (cart.TRANG_THAI === 2) {
            cart.TRANG_THAI_STR = 'Đã hoàn tất';
          }
          if (cart.TRANG_THAI === -1) {
            cart.TRANG_THAI_STR = 'Đã hủy';
          }
        });
        // console.log(cartsFromApi);
        // setCarts(cartsFromApi);
        console.log(cartsFromApi);
        setIsLoading(false);
      });
    } catch (error) {
      console.error(error);
    }
  };
  const isDarkMode = useColorScheme() === 'dark';

  React.useEffect(() => {
    let emp = getData();
    emp.then(res => {
      console.log(res, '111111111111');
    });
  }, []);
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  // eslint-disable-next-line prettier/prettier
  const [data, setData] = React.useState({ EMAIL: '', MAT_KHAU: '' });
  const [isLoading, setIsLoading] = React.useState(false);
  const [showListView, setShowListView] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const handleSubmit = () => {
    // console.log(data.EMAIL + '; ' + data.MAT_KHAU);
  };

  const login = async () => {
    let url = '';

    removeData();
    url = 'http://localhost:22081/api/NhanVien/login';
    console.log(url, {
      MAT_KHAU: data.MAT_KHAU,
      EMAIL: data.EMAIL,
    });
    setErrorMessage('');
    setIsLoading(true);
    axios
      .post(url, {
        MAT_KHAU: data.MAT_KHAU,
        EMAIL: data.EMAIL,
      })
      .then(async res => {
        const userInfoFromRes = res.data;
        // console.log(userInfoFromRes);

        if (userInfoFromRes) {
          setErrorMessage('');
          await storeData(userInfoFromRes);
          const a = await getData();
          if (a.MA_QUYEN === 'Q04') {
            // navigate('/admin/cart-management', {replace: true});
          } else {
            // navigate('/admin/dashboard', {replace: true});
          }

          await getCartsEmpDelivering();
          navigation.navigate('CartManagement', {name: 'Jane'});

          // setShowListView(true);
        } else {
          setErrorMessage('*Xem lại tài khoản và mật khẩu');
        }
        setIsLoading(false);
      });
  };
  return (
    <View>
      <View>
        {/* eslint-disable-next-line prettier/prettier*/}
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <View
            style={{
              alignItems: 'center',
              backgroundColor: '#333',
              width: '100%',
              position: 'relative',
            }}>
            {/* eslint-disable-next-line prettier/prettier*/}
            <Text style={{ width: 144, height: 120, position: 'absolute' }, styles.logo}>CLO<Text style={{ color: '#009eb6' }}>T</Text>HES</Text>
            <Image
              source={require('./assets/logo-example.png')}
              // eslint-disable-next-line prettier/prettier
              style={{ width: 120, height: 120, marginTop: 0, marginBottom: 16, marginRight: -194 }}
            />
          </View>
          <View style={styles.hairline} />
          <Text style={styles.loginTitle}>Đăng nhập </Text>
          {isLoading ? <ActivityIndicator size="large" /> : <></>}

          {/* eslint-disable-next-line prettier/prettier*/}
          <View style={{ justifyContent: 'flex-start', width: '100%', paddingHorizontal: 36 }}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.inputText}
                textContentType="emailAddress"
                defaultValue={data.EMAIL}
                onChangeText={e => {
                  // console.log(e.target);
                  // eslint-disable-next-line prettier/prettier
                  setData({ ...data, EMAIL: e });
                }}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Mật khẩu</Text>
              <TextInput
                style={styles.inputText}
                textContentType="password"
                secureTextEntry={true}
                returnKeyType="go"
                autoCorrect={false}
                defaultValue={data.MAT_KHAU}
                onChangeText={e => {
                  // eslint-disable-next-line prettier/prettier
                  setData({ ...data, MAT_KHAU: e });
                }}
              />
            </View>
            <Text style={styles.errorMessage}>{errorMessage}</Text>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={e => {
                handleSubmit();
                login();
              }}
              underlayColor="#fff">
              <Text style={styles.loginText}>ĐĂNG NHẬP</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* {showListView ? <FlatListBasics /> : <></>} */}

      {/* <SafeAreaView style={backgroundStyle}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={backgroundStyle}>
          <Header />
          <View
            style={{
              backgroundColor: isDarkMode ? Colors.black : Colors.white,
            }}>
            <Section title="Step One">
              Edit <Text style={styles.highlight}>App.js</Text> to change this
              screen and then come back to see your edits.
            </Section>
            <Section title="See Your Changes">
              <ReloadInstructions />
            </Section>
            <Section title="Debug">
              <DebugInstructions />
            </Section>
            <Section title="Learn More">
              Read the docs to discover what to do next:
            </Section>
            <LearnMoreLinks />
          </View>
        </ScrollView>
      </SafeAreaView> */}
    </View>
  );
};

const styles = StyleSheet.create({
  errorMessage: {
    color: 'red',
    height: 16,
    fontSize: 14,
    width: '100%',
    textAlign: 'right',
  },
  loginText: {
    color: '#fff',
    textAlign: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#009eb6',
    marginTop: 44,
    borderWidth: 1,
    borderColor: '#009eb6',
    paddingTop: 10,
    paddingBottom: 10,
  },
  logo: {
    width: 156,
    borderWidth: 2,
    borderColor: '#fff',
    color: '#fff',
    textTransform: 'uppercase',
    fontSize: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    left: -80,
    top: '50%',
    marginTop: -28,
    letterSpacing: 2,
  },
  inputGroup: {
    marginTop: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#555',
    fontWeight: 'bold',
  },
  inputText: {
    width: '100%',
    appearance: 'none',
    outline: 'none',
    border: 'none',
    borderBottomColor: '#555',
    borderBottomWidth: 1.0,
    paddingRight: 8,
    paddingVertical: 6,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#009eb6',
  },
  loginTitle: {
    textTransform: 'uppercase',
    color: '#009eb6',
    fontWeight: 'bold',
    marginVertical: 16,
    fontSize: 20,
  },
  hairline: {
    backgroundColor: '#A2A2A2',
    height: 1,
    width: '100%',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default Login;
