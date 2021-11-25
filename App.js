import { StatusBar } from 'expo-status-bar';
import React, { Component, useEffect, useState } from 'react';
import { render } from 'react-dom';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Modal, Pressable, TextInput, Button } from 'react-native';
import { FAB } from 'react-native-paper';
import { db } from './firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

function App(){
  const [namaBaru, setNamaBaru] = useState("");
  const [nimBaru, setNimBaru] = useState("");
  const [users, setUsers] = useState([]);
  const usersCollectionRef = collection(db, "mahasiswa");
  const [modalVisible, setModalVisible] = useState(false);
  var modalBackgroundStyle = {
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    };

  const klikSimpan = async () => {
    await addDoc(usersCollectionRef, { nama: namaBaru, nim: nimBaru});
    setModalVisible(false);
    refreshing: true;
  };

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), Id:doc.id})));
    };

    getUsers();
  }, []);

  return(
     <SafeAreaView style={styles.safeAreaView}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.container}>
            <Text style={styles.font}>Data Mahasiswa</Text>
            <View>
              {users.map((user) => {
                return(
                  <View style={[styles.data,{backgroundColor: 'hsl(' + (Math.floor(Math.random() * 360)) + ',80%,90%)'}]}>
                    <Text>{user.nama}</Text>
                    <Text>{user.nim}</Text>
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
    margin: 10,
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 10
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
  })

export default App;

