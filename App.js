import { StatusBar } from 'expo-status-bar';
import React, { Component, useEffect, useState } from 'react';
import { render } from 'react-dom';
import { Alert, TouchableOpacity, StyleSheet, Text, View, SafeAreaView, ScrollView, Modal, Pressable, TextInput, Button, RefreshControl, Image } from 'react-native';
import { FAB } from 'react-native-paper';
import { db } from './firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

function App(){
  const [namaBaru, setNamaBaru] = useState("");
  const [nimBaru, setNimBaru] = useState("");
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const usersCollectionRef = collection(db, "mahasiswa");
  const [modalVisible, setModalVisible] = useState(false);
  var modalBackgroundStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  };

  const klikSimpan = async () => {
    await addDoc(usersCollectionRef, { nama: namaBaru, nim: nimBaru});
    setModalVisible(false);
    const data = await getDocs(usersCollectionRef);
    setUsers(data.docs.map((doc) => ({ ...doc.data(), Id:doc.id})));
  };

  const deleteUser = async (id) => {
    const userDoc = doc(db, "mahasiswa", id);
    await deleteDoc(userDoc);
  };

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), Id:doc.id})));
    };

    getUsers();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);


  return(
     <SafeAreaView style={styles.safeAreaView}>
        <ScrollView style={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        >
          <View style={styles.container}>
            <Text style={styles.font}>Data Mahasiswa</Text>
            <View>
              {users.map((user) => {
                return(
                  <View style={[styles.data,{backgroundColor: 'hsl(' + (Math.floor(Math.random() * 360)) + ',80%,90%)'}]}>
                    <View>
                      <Text style={styles.labelNama}>{user.Document}</Text>
                      <Text style={styles.labelNama}>{user.nama}</Text>
                      <Text style={styles.labelNim}>{user.nim}</Text>
                    </View>
                    <View style={styles.iconPack}>
                      <Image style={styles.edit} source={require('./src/icon/edit.png')} />
                      <TouchableOpacity onPress={() => Alert.alert(user.Document)}>
                        <Image style={styles.delete} source={require('./src/icon/trash.png')} />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>
        <View style={styles.centeredView}>
            <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setModalVisible(!modalVisible);
            }}
          >
              <View style={[styles.centeredView,modalBackgroundStyle]}>
                <View style={styles.modalView}>
                <Text style={styles.titleModal}>Masukan data mahasiswa</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Nama"
                    onChangeText={setNamaBaru}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="NIM"
                    keyboardType="numeric"
                    onChangeText={setNimBaru}
                  />
                  <View style={styles.fixToText}>
                    <Button
                      title="Batal"
                      color="red"
                      onPress={() => setModalVisible(false)}
                    />
                    <Button
                      title="Simpan"
                      onPress={klikSimpan}
                    />
                  </View>
                </View>
              </View>
            </Modal>
          </View>
          <View>
              <FAB
                style={styles.fab}
                medium
                icon="plus"
                color="white"
                onPress={() =>  setModalVisible(true)}
              />
            </View>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
   container: {
    marginTop: 10
  },
  safeAreaView: {
    height: 650
  },
  scrollView: {
  },
  
  font: {
    textAlign: 'center',
    fontSize: 32,
    marginVertical: 30
  },
  data: {
    flex: 1,
    flexDirection: 'row',
    margin: 10,
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 10
  },
  labelNama: {
    fontSize: 20,
    color: 'black'
  },
  labelNim: {
    color: '#808080'
  },
  fab: {
    position: 'absolute',
    marginRight: 30,
    right: 0,
    bottom: 30,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  titleModal: {
    fontSize:20
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  input: {
    width:250,
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  fixToText: {
    width: 200,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconPack: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  edit: {
    width: 30,
    height: 30,
    marginRight: 10
  },
  delete: {
    width: 30,
    height: 30
  }
  })

export default App;

