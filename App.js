import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { render } from 'react-dom';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Modal, Pressable, TextInput, Button } from 'react-native';
import { FAB } from 'react-native-paper';

class App extends Component{

  state = {
    modalVisible: false
  };

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }
  
    constructor(props){
      super(props);
      this.state = {
        nama:'',
        alamat:'',
        nim:'',
        jurusan:'',
        telp:'',
        listData:[],
        idEdit:null,
        modalVisible: false
      };
      this.url = "http://192.168.1.103/mahasiswa/api/read.php";
    }
    componentDidMount(){
      this.ambilListData();
    }
    async ambilListData(){
      await fetch(this.url)
      .then((response)=>response.json())
      .then((json)=>{
        console.log('Hasil yang didapat: '+JSON.stringify(json.data.result));
        this.setState({listData:json.data.result});
      })
      .catch((error)=>{
        console.log(error);
      })
    }
    klikSimpan(){
          if(this.state.nama == '' || this.state.alamat == '' || this.state.nim == '' || this.state.jurusan == '' || this.state.telp == ''){
            alert('Silakan masukkan nama dan alamat');
          }else{
              var urlAksi = "http://192.168.1.103/mahasiswa/api/create.php";              

              fetch(urlAksi,{
                  method:'post',
                  headers:{
                      'Content-Type':'application/x-www-form-urlencoded'
                  },
                  body:"nama="+this.state.nama+"&alamat="+this.state.alamat+"&nim="+this.state.nim+"&jurusan="+this.state.jurusan+"&telp="+this.state.telp
              })
              .then((response)=>response.json())
              .then((json)=>{
                  this.setState({nama:''});
                  this.setState({alamat:''});
                  this.setState({nim:''});
                  this.setState({jurusan:''});
                  this.setState({telp:''});
                  this.ambilListData();
              })
          }
      }
  

    render(){
      const { modalVisible } = this.state;
      var modalBackgroundStyle = {
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    };
      return(
        <SafeAreaView style={styles.safeAreaView}>
          <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
              <Text style={styles.font}>Data Mahasiswa</Text>
              {
                this.state.listData.map((val,index)=>
                <View style={[styles.data,{backgroundColor: 'hsl(' + (Math.floor(Math.random() * 360)) + ',80%,90%)'}]} key={index}>
                  <Text>Nama : {val.nama}</Text>
                  <Text>Alamat : {val.alamat}</Text>
                  <Text>NIM : {val.nim}</Text>
                  <Text>Jurusan : {val.jurusan}</Text>
                  <Text>No. HP : {val.telp}</Text>
                </View>)
              }
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
                    value={this.state.nama}
                    onChangeText={(text)=>this.setState({nama:text})}
                    placeholder="Nama"
                  />
                  <TextInput
                    style={styles.input}
                    value={this.state.alamat}
                    onChangeText={(text)=>this.setState({alamat:text})}
                    placeholder="Alamat"
                  />
                  <TextInput
                    style={styles.input}
                    value={this.state.nim}
                    onChangeText={(text)=>this.setState({nim:text})}
                    placeholder="NIM"
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={styles.input}
                    value={this.state.jurusan}
                    onChangeText={(text)=>this.setState({jurusan:text})}
                    placeholder="Jurusan"
                  />
                  <TextInput
                    style={styles.input}
                    value={this.state.telp}
                    onChangeText={(text)=>this.setState({telp:text})}
                    placeholder="No. HP"
                    keyboardType="numeric"
                  />
                  <View style={styles.fixToText}>
                    <Button
                      title="Batal"
                      color="red"
                      onPress={() => this.setModalVisible(false)}
                    />
                    <Button
                      title="Simpan"
                      onPress={() => this.klikSimpan()}
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
              onPress={() => this.setModalVisible(true)}
            />
          </View>
        </SafeAreaView>
      )
    }
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
});

export default App;

