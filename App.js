/* eslint-disable prettier/prettier */
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
import type { Node, useState, navigate, useEffect } from 'react';
import axios from 'react-native-axios';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import Login from './Login';
import FlatListBasics from './src/FlatListView/FlatListBasics';
import Toast from 'react-native-toast-message';
// eslint-disable-next-line prettier/prettier
import { Linking } from 'react-native';

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
const Stack = createNativeStackNavigator();

function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ title: 'Đăng nhập' }}
          />
          <Stack.Screen
            name="CartManagement"
            component={FlatListBasics2}
            options={{ title: 'Đơn bạn giao' }}
          />
          <Stack.Screen
            name="CartDetail"
            component={CartDetail}
            options={{ title: 'Chi tiết giỏ hàng' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
}

const styles = StyleSheet.create({
  logOutContainer: {
    flex: 1,
  },
  btnCheckContainer: {
    marginBottom: 12,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 13,
    marginHorizontal: 12,
    marginVertical: 8,
  },
  checkButton: {
    backgroundColor: '#333',
    marginTop: 2,
    borderWidth: 1,
    borderColor: '#333',
    marginRight: 12,
  },
  cancelButton: {
    backgroundColor: 'red',
    borderColor: '#333',
  },
  finishButton: {
    backgroundColor: 'green',
    borderColor: '#333',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    textTransform: 'uppercase',
    marginVertical: 10,
    textDecorationLine: 'underline',
  },
  modalWrapper: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    height: '100%',
  },
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
  container: {
    flex: 1,
    paddingTop: 22,
  },
  item: {
    padding: 4,
    fontSize: 14,
  },
  itemContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomWidth: 1,
  },
});

const CartDetail = ({ route, navigation }) => {
  // const params = useParams(); prams.cartId
  console.log('cartdetail render:', route.params);
  // const notify = (message) => toast.error(message, { autoClose: true, closeDuration: 3000 });//error/info/add
  const [cart, setCart] = React.useState({});
  const [flag, setFlag] = React.useState(false);
  const [employees, setEmployees] = React.useState([]);
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
  React.useEffect(() => {
    console.log(
      `http://localhost:22081/api/GioHang?cartId=${route.params.cartId}`,
    );

    if (route.params.cartId) {
      try {
        axios
          .get('http://localhost:22081/api/NhanVien/delivering')
          .then(res => {
            const response = res.data;
            console.log('emp:', response);
            response.forEach(emp => {
              emp.HO_TEN_STR =
                emp.HO_TEN + ', Đang giao: ' + emp.SO_GH_NV_DANG_GIAO;
            });
            setEmployees(response);
          });
      } catch (error) {
        console.error(error);
      }

      try {
        axios
          .get(
            `http://localhost:22081/api/GioHang?cartId=${route.params.cartId}`,
          )
          .then(res => {
            const response = res.data;
            response.chiTietGioHang2.forEach((resp, index) => {
              try {
                resp.STT = index + 1;
                resp.GIA_STR = intToVNDCurrencyFormat(resp.GIA) + ' ₫';
                resp.TRI_GIA_STR = intToVNDCurrencyFormat(
                  resp.GIA * resp.SO_LUONG,
                  true,
                ); //thêm true + đ
              } catch (e) {
                console.log(e);
              }
            });
            setCart(response);
            //set nhân viên đã được assign
            setFlag(true);
            // dropdownList.current.value = response.MA_NV_GIAO;
            // console.log('nvgiao old:', response.MA_NV_GIAO);
          });
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log('cartId not fresent in props');
    }
  }, [route]);

  const finish = async () => {
    const a = await getData();
    try {
      axios
        .put(
          'http://localhost:22081/api/NhanVien/finish-cart',
          {
            ID_GH: cart.ID_GH,
          },
          {
            headers: {
              Authorization: 'Bearer ' + a.accessToken,
            },
          },
        )
        .then(res => {
          const response = res.data;
          console.log('res: ' + res);
          setCart({ ...cart, TRANG_THAI: 2, TRANG_THAI_STR: 'Đã hoàn tất' });
          showSuccessToast('Giao đơn hàng thành công');
        })
        .catch(error => {
          console.log('zzzzzzzzz', error);
          showErrorToast('Phiên đăng nhập đã hết hạn');
          navigation.navigate('Login');
        });
    } catch (error) {
      console.log('zzzzzzzzz', error);
    }
  };

  const cancel = async () => {
    // if (
    //   cart.TRANG_THAI === -1 ||
    //   cart.TRANG_THAI === 1 ||
    //   cart.TRANG_THAI === 2
    // ) {
    //   showErrorToast('Đơn hàng đã được duyệt, không thể hủy.');
    //   return;
    // }
    try {
      const a = await getData();
      axios
        .put(
          'http://localhost:22081/api/KhachHang/cancel-cart',
          {
            ID_GH: cart.ID_GH,
          },
          {
            headers: {
              Authorization: 'Bearer ' + a.accessToken,
            },
          },
        )
        .then(res => {
          const response = res.data;
          // console.log('res: ' + response);
          setCart({ ...cart, TRANG_THAI: -1, TRANG_THAI_STR: 'Đã hủy' });
          console.log('Hủy đơn hàng thành công');
        });
    } catch (error) {
      console.error(error);
    }
  };

  return flag ? (
    <View style={styles.modalWrapper}>
      <Text style={styles.loginTitle}>Chi tiết GH {route.params.cartId}</Text>
      <View style={styles.btnCheckContainer}>
        {cart.TRANG_THAI === 1 ? (
          <TouchableOpacity
            style={
              ({ marginRight: 100 }, styles.checkButton, styles.finishButton)
            }
            onPress={() => {
              Alert.alert(
                'Hoàn tất đơn hàng',
                'Xác nhận giao thành công',
                [
                  {
                    text: 'Đồng ý',
                    onPress: () => finish(),
                    style: 'default',
                  },
                  {
                    text: 'Hủy',
                    // onPress: () => Alert.alert('ấn hủy'),
                    style: 'cancel',
                  },
                ],
                {
                  cancelable: true,
                  onDismiss: () =>
                    console.log(
                      'This alert was dismissed by tapping outside of the alert dialog.',
                    ),
                },
              );
              // finish();
            }}>
            <Text style={styles.buttonLabel}>Hoàn tất</Text>
          </TouchableOpacity>
        ) : (
          <></>
        )}
        <Text>{'   '}</Text>
        {cart.TRANG_THAI === 1 ? (
          <TouchableOpacity
            style={(styles.checkButton, styles.cancelButton)}
            onPress={() => {
              Alert.alert(
                'Hủy đơn hàng',
                'Xác nhận hủy đơn hàng',
                [
                  {
                    text: 'Đồng ý',
                    onPress: () => cancel(),
                    style: 'default',
                  },
                  {
                    text: 'Hủy',
                    // onPress: () => Alert.alert('ấn hủy'),
                    style: 'cancel',
                  },
                ],
                {
                  cancelable: true,
                  onDismiss: () =>
                    console.log(
                      'This alert was dismissed by tapping outside of the alert dialog.',
                    ),
                },
              );
            }}>
            <Text style={styles.buttonLabel}>Hủy đơn hàng</Text>
          </TouchableOpacity>
        ) : (
          <></>
        )}
      </View>

      <View style={styles.cartInfo}>
        <View style={styles.infoGroup}>
          <Text>
            Tên người nhận: <Text style={styles.inputText}>{cart.HO_TEN}</Text>
          </Text>
        </View>
        <View style={styles.infoGroup}>
          <Text>
            SĐT người nhận: <Text style={styles.inputText}>{cart.SDT}</Text>
          </Text>
        </View>
        <View style={styles.infoGroup}>
          <Text>
            Email: <Text style={styles.inputText}>{cart.EMAIL}</Text>
          </Text>
        </View>
        <View style={styles.infoGroup}>
          <Text>
            Địa chỉ: <Text style={styles.inputText}>{cart.DIA_CHI}</Text>
          </Text>
        </View>
        <View style={styles.infoGroup}>
          <Text>
            Trạng thái đơn hàng:{' '}
            <Text style={styles.inputText}>
              {cart.TRANG_THAI === -1
                ? 'Đã hủy'
                : cart.TRANG_THAI === 0
                  ? 'Chờ duyệt'
                  : cart.TRANG_THAI === 1
                    ? 'Đang giao'
                    : cart.TRANG_THAI === 2
                      ? 'Đã hoàn tất'
                      : ''}
            </Text>
          </Text>
        </View>
        {cart.TRANG_THAI === 1 || cart.TRANG_THAI === 2 ? (
          <>
            <View
              style={
                (styles.infoGroup,
                  styles.infoEmployee,
                  styles.infoEmployeeDelivery1)
              }>
              <View style={(styles.infoGroup, styles.infoEmployee)}>
                <Text>
                  Nhân viên giao:{' '}
                  <Text style={styles.inputText}>{cart.TEN_NV_GIAO}</Text>
                </Text>
              </View>
              <View style={(styles.infoGroup, styles.infoEmployee)}>
                <Text>
                  SĐT nhân viên giao:{' '}
                  <Text style={styles.inputText}>{cart.SDT_NV_GIAO}</Text>
                </Text>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.w100}>
            <View style={(styles.infoGroup, styles.infoEmployee)}>
              <Text>
                Nhân viên duyệt:{' '}
                <Text style={styles.inputText}>{cart.TEN_NV_DUYET}</Text>
              </Text>
            </View>
            <View
              style={
                (styles.infoGroup,
                  styles.infoEmployee,
                  styles.infoEmployeeDelivery,
                {
                  [styles.disabled]: getData().MA_QUYEN === 'Q04',
                })
              }>
              <Text>
                Nhân viên giao:{' '}
                <Text id="filtering" style={styles.inputText}>
                  {cart.TEN_NV_GIAO}
                </Text>
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* detail */}
      <Text style={styles.title}>Sản phẩm trong giỏ</Text>
      <View style={styles.cartDetail}>
        <FlatList
          data={cart.chiTietGioHang2}
          renderItem={({ item }) => (
            <>
              <View style={styles.itemContainer}>
                <Text style={styles.item}>
                  STT: <Text style={styles.inputText}>{item.STT}</Text> {'   '}
                  Tên sản phẩm:{' '}
                  <Text style={styles.inputText}>{item.TEN_SP}</Text>
                </Text>
                <Text style={styles.item}>
                  Màu/ Size: {item.TEN_MAU}/ {item.TEN_SIZE},{'   '} Đơn giá:{' '}
                  {item.GIA_STR}
                </Text>
                <Text style={styles.item}>
                  Số lượng: {item.SO_LUONG} --> Tổng:{' '}
                  <Text style={styles.inputText}>{item.TRI_GIA_STR}</Text>
                </Text>
              </View>
            </>
          )}
        />
        <View style={styles.total}>
          <Text>
            Tổng trị giá:{' '}
            <Text style={styles.inputText}>
              {intToVNDCurrencyFormat(cart.TONG_TRI_GIA) + ' ₫'}
            </Text>
          </Text>
        </View>
      </View>
    </View>
  ) : (
    <></>
  );
};
const FlatListBasics2 = ({ navigation }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [carts, setCarts] = React.useState([]);
  const [emp, setEmp] = React.useState({});
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('employee');
      console.log(jsonValue);
      setEmp(jsonValue != null ? JSON.parse(jsonValue) : null);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
      console.log('getting errpr');
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
              new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short' }).format(
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
              new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short' }).format(
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
        setCarts(cartsFromApi);
        console.log(cartsFromApi);
        setIsLoading(false);
      });
    } catch (error) {
      console.error(error);
    }
  };
  React.useEffect(() => {
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
                new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short' }).format(
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
                new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short' }).format(
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
          setCarts(cartsFromApi);
          console.log(cartsFromApi);
          setIsLoading(false);
        });
      } catch (error) {
        console.error(error);
      }
    };
    getCartsEmpDelivering();
  }, []);
  return (
    <View style={styles.container}>
      {isLoading ? <ActivityIndicator /> : <></>}
      <View style={styles.btnCheckContainer}>
        <View
          style={{
            width: '100%',
            display: 'flex',
            alignItem: 'center',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            paddingRight: 10,
          }}>
          <Text style={(styles.buttonLabel, { color: '#333' })}>
            Chào, <Text style={styles.inputText}>{emp.HO_TEN}</Text> |{' '}
          </Text>
          <TouchableOpacity
            style={
              (styles.checkButton,
              {
                backgroundColor: 'transparent',
                marginLeft: 8,
                marginTop: 1,
              })
            }
            onPress={async e => {
              navigation.navigate('Login');
            }}>
            <Text
              style={(styles.buttonLabel, { textDecorationLine: 'underline' })}>
              Đăng xuất
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={
          (styles.checkButton,
          {
            backgroundColor: '#009eb6',
            marginLeft: 8,
            marginBottom: 8,
            width: 80,
          })
        }
        onPress={async e => {
          try {
            const a = await getData();
            const empId = a.MA_NV;
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
                    new Intl.DateTimeFormat('vi-VN', {
                      dateStyle: 'short',
                    }).format(date),
                  );
                  cart.NGAY_TAO = new Intl.DateTimeFormat('vi-VN', {
                    dateStyle: 'short',
                  }).format(date);
                }
                if (cart.NGAY_GIAO) {
                  let date = new Date(cart.NGAY_GIAO);
                  cart.NGAY_GIAO = date.toLocaleDateString('vi-VN');
                  console.log(
                    new Intl.DateTimeFormat('vi-VN', {
                      dateStyle: 'short',
                    }).format(date),
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
              setCarts(cartsFromApi);
              console.log(cartsFromApi);
              setIsLoading(false);
            });
          } catch (error) {
            console.error(error);
          }
        }}>
        <Text style={styles.buttonLabel}>Làm mới</Text>
      </TouchableOpacity>
      <FlatList
        data={carts ? carts : []}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={e => {
              navigation.navigate('CartDetail', {
                cartId: item.ID_GH,
              });
            }}>
            <View style={styles.itemContainer}>
              <Text style={styles.item}>
                ID_GH: <Text style={styles.inputText}>{item.ID_GH}</Text>
              </Text>
              <Text style={styles.item}>
                Người nhận: <Text style={styles.inputText}>{item.HO_TEN}</Text>
              </Text>
              <Text style={styles.item}>
                SĐT: <Text style={styles.inputText}>{item.SDT}</Text>, {'   '}
                Email: <Text style={styles.inputText}>{item.EMAIL}</Text>
              </Text>
              <Text style={styles.item}>
                Địa chỉ: <Text style={styles.inputText}>{item.DIA_CHI}</Text>,
                {'   '} Trạng thái:{' '}
                <Text style={styles.inputText}>{item.TRANG_THAI_STR}</Text>
              </Text>
              <TouchableOpacity
                onPress={e => {
                  Linking.openURL(`tel:${item.SDT}`);
                }}
                style={{ display: 'flex', borderColor: '#bbb', borderWidth: 1 }}>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    source={require('./assets/call-icon.png')}
                    // eslint-disable-next-line prettier/prettier
                    style={{ width: 32, height: 32, marginHorizontal: 8, marginVertical: 4 }}

                  />
                  <Text style={{ fontWeight: 'bold', textDecorationLine: 'underline', color: '#009eb6', fontSize: 15 }}>{'Gọi cho người nhận'}</Text>
                </View>

              </TouchableOpacity>
            </View>




          </TouchableOpacity>
        )
        }
      />
    </View >
  );
};
const intToVNDCurrencyFormat = (number, withSymbol) => {
  let result;
  result =
    number.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) + '';

  if (withSymbol) {
    result = result + ' ₫';
  } else {
  }

  return result;
};
const showSuccessToast = message => {
  Toast.show({
    type: 'success',
    text1: 'Thông báo',
    text2: message,
  });
};
const showErrorToast = message => {
  Toast.show({
    type: 'error',
    text1: 'Thông báo',
    text2: message,
  });
};
const LogOutIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
      />
    </svg>
  );
};
const CancelIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
      />
    </svg>
  );
};
const CheckIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-2 w-2"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
};

export default App;
