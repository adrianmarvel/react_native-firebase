import { StatusBar } from 'expo-status-bar';
import React, { Component, useEffect, useState } from 'react';
import { render } from 'react-dom';
import { Alert, TouchableOpacity, StyleSheet, Text, View, SafeAreaView, ScrollView, Modal, Pressable, TextInput, Button, RefreshControl, Image } from 'react-native';
import { FAB } from 'react-native-paper';
import { db } from './firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, runTransaction } from 'firebase/firestore';

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

function App(){
  const [namaBaru, setNamaBaru] = useState("");
  const [nimBaru, setNimBaru] = useState("");
  const [editId, setId] = useState("")
  const [editDoc, setDoc] = useState("");
  const [users, setUsers] = useState([]);
  const usersCollectionRef = collection(db, "mahasiswa");
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  var modalBackgroundStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  };

  const klikSimpan = async () => {
    await addDoc(usersCollectionRef, { nama: namaBaru, nim: nimBaru});
    setModalVisible1(false);
    getUsers();
    /*
    const data = await getDocs(usersCollectionRef);
    setUsers(data.docs.map((doc) => ({ ...doc.data(), Id:doc.id})));
    */
  };

  const deleteUser = async (id) => {
    const userDoc = doc(db, "mahasiswa", id);
    await deleteDoc(userDoc);
    getUsers();
    /*
    const data = await getDocs(usersCollectionRef);
    setUsers(data.docs.map((doc) => ({ ...doc.data(), Id:doc.id})));
    */
  };

  const editUser = async (Id, nama, nim) => {
    setModalVisible2(true);
    {setDoc(doc(db, "mahasiswa", Id))}
    {setId(Id)}
    {setNamaBaru(nama)};
    {setNimBaru(nim)};
  }

  const updateUser = async (Id, nama, nim) => {
    const userDoc = doc(db, "mahasiswa", Id)
    const field = { nama : namaBaru, nim : nimBaru};
    await updateDoc(editDoc, field);
    setModalVisible2(false);
    getUsers();
    /*
    const data = await getDocs(usersCollectionRef);
    setUsers(data.docs.map((doc) => ({ ...doc.data(), Id:doc.id})));
    */
  }

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), Id:doc.id})));
    };


  return(
     <SafeAreaView style={styles.safeAreaView}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.container}>
            <Text style={styles.font}>Data Mahasiswa</Text>
            <View>
              {users.map((user) => {
                return(
                  <View style={[styles.data,{backgroundColor: 'hsl(' + (Math.floor(Math.random() * 360)) + ',80%,90%)'}]}>
                    <View>
                      <Text style={styles.labelNama}>{user.nama}</Text>
                      <Text style={styles.labelNim}>{user.nim}</Text>
                    </View>
                    <View style={styles.iconPack}>
                      <TouchableOpacity onPress={() =>  editUser(user.Id, user.nama, user.nim)}>
                        <Image style={styles.edit} source={require('./src/icon/edit.png')} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => deleteUser(user.Id)}>
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
            visible={modalVisible1}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setModalVisible1(!modalVisible);
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
                      onPress={() => setModalVisible1(false)}
                    />
                    <Button
                      title="Simpan"
                      onPress={klikSimpan}
                    />
                  </View>
                </View>
              </View>
            </Modal>
            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible2}
              onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible2(!modalVisible2);
               }}
            >
              <View style={[styles.centeredView,modalBackgroundStyle]}>
                <View style={styles.modalView}>
                  <Text style={styles.titleModal}>Edit data mahasiswa</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Nama"
                    value={namaBaru}
                    onChangeText={setNamaBaru}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="NIM"
                    value={nimBaru}
                    keyboardType="numeric"
                    onChangeText={setNimBaru}
                  />
                  <View style={styles.fixToText}>
                    <Button
                      title="Batal"
                      color="red"
                      onPress={() => setModalVisible2(false)}
                    />
                    <Button
                      title="Update"
                      onPress={() => {updateUser(namaBaru, nimBaru)}}
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
                onPress={() =>  setModalVisible1(true)}
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

