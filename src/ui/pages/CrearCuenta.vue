<template>
    <div >
      <v-app-bar
          color='orange-lighten-4'
          density="compact"
        >
          <template v-slot:append>
              <p>Si ya tienes cuenta &nbsp;</p>
            <v-btn @click="volver()">Sing in</v-btn>
          </template>
        </v-app-bar>
  
        <v-snackbar
      :color="snackbar.color"
      v-model="snackbar.show"
      height="-40"
      absolute
      multi-line
      location="top"
    >
      <strong class="text-center align-center">{{ snackbar.message }}</strong>
    </v-snackbar>
  

  <v-container>
    <v-row>
      <v-col cols="4"></v-col>
      <v-col>
        <h1 v-if="!isVisible">Se ha creado el usuario correctamente</h1>
        <form class="formulario" v-if="isVisible">
          <h1>Crear cuenta</h1>
          <br />
          <v-text-field
            v-model="usuario"
            label="Usuario"
            :rules="[required, min6]"
          > <template v-slot:append>
            <v-icon v-if="successUsuario" color="green">{{ usuarioRule }}</v-icon>
            <v-icon v-if="!successUsuario" color="red">{{ usuarioRule }}</v-icon>
          </template>
        </v-text-field>

          <v-text-field 
          v-model="email"
           label="Email" 
           :rules="[required, validarEmail]"
           ><template v-slot:append>
            <v-icon v-if="successEmail" color="green">{{ emailRule }}</v-icon>
            <v-icon v-if="!successEmail" color="red">{{ emailRule }}</v-icon>
          </template>
        </v-text-field>
        
          <v-text-field
            v-model="clave"
            :type="show1 ? 'text' : 'password'"
            label="Contraseña"
            :rules="[required, min8]"
          ><v-icon class="input-icon password" :icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" @click="contraseñaOcultar1()"></v-icon>
          <template v-slot:append>
            <v-icon v-if="successClave" color="green">{{ claveRule }}</v-icon>
            <v-icon v-if="!successClave" color="red">{{ claveRule }}</v-icon>
          </template>
        </v-text-field>

          <v-text-field
            v-model="claveConfirmar"
            :type="show2 ? 'text' : 'password'"
            label="Repetir contraseña"
           :rules="[required, matchingPasswords]"
           
          ><v-icon class="input-icon password" :icon="show2 ? 'mdi-eye' : 'mdi-eye-off'" @click="contraseñaOcultar2()"></v-icon>
          <template v-slot:append>
            <v-icon v-if="successClaveConfirmar" color="green">{{ claveConfirmarRule }}</v-icon>
            <v-icon v-if="!successClaveConfirmar" color="red">{{ claveConfirmarRule }}</v-icon>
          </template>
        </v-text-field>


          <v-btn block class="button mt-2" @click="enviarFormulario()"
            >Crear cuenta</v-btn
          >
        </form>
      </v-col>
      <v-col cols="4"></v-col>
    </v-row>
  </v-container>
      </div>
  </template>
  <script>
 import axios from "axios"
// import config from '../../../infraestructure/settings'
export default {
  name: "Cuenta",

  data() {
    return {
      show1: false,
      show2: false,
      usuario: "",
      email: "",
      clave: "",
      claveConfirmar: "",
      successClave: false,
      successClaveConfirmar: false,
      successEmail: false,
      successUsuario: false,
      snackbar: {
        show: false,
        message: null,
        color: null,
      },
      isVisible:true
    };
  },
  methods: {
    contraseñaOcultar1(){
      if (this.show1 == false){
         this.show1= true
         return 'mdi-eye-off'
      }else{
        this.show1=false
        return 'mdi-eye'
      }

    },
    contraseñaOcultar2(){
      if (this.show2 == false){
         this.show2= true
         return 'mdi-eye-off'
      }else{
        this.show2=false
        return 'mdi-eye'
      }

    },
    enviarFormulario() {
      if (this.successClave &&
      this.successClaveConfirmar &&
      this.successEmail &&
      this.successUsuario){
      const send = {
        usuario: this.usuario,
        email: this.email,
        contrasena: this.clave,
      };
      console.log(send);
      // const url = `${config.URL}crearCuenta`
      const url = 'http://localhost:3000/insert'
       axios.post(url, send).then(data => {
              if (data.data.añadido == true){
                this.isVisible = false
              }
              else{
                this.snackbar = {
                        message: 'Ya existe usuario o email registrado',
                        color: 'red',
                        show: true
                    }
              }
            })
            .catch(err => {
              this.snackbar = {
                        message: 'No se ha podido crear una cuenta',
                        color: 'error',
                        show: true
                    }
              console.error(err)
            })
    }
      else{
        this.snackbar = {
            message: 'Todos los campos tienen que ser validos',
            color: 'red',
            show: true,
          };
      }
    },
    required(value) {
      if (value) {
        return true;
      } 
      else {
        return "Este campo no puede estar vacio";
      }
    },
    validarEmail(value) {
      if(value.length > 0 && /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ){
        return true
      }
      else {
        return "No es un email valido";
      }
    },
    matchingPasswords() {
      if (this.claveConfirmar === this.clave) {
        return true;
      } else {
        return "Las contraseñas no coinciden";
      }
    },
    min6(value){
      if (value.length >= 6){
        return true
      }else{
        return "Se necesitan minimo 6 caracteres"
      }
    },
    min8(value){
      if (value.length >= 8){
        return true
      }else{
        return "Se necesitan almenos 8 caracteres"
      }
    },
    volver(){
          this.$router.push({ path:`/`});
  
        },

  },
  computed: {
    claveConfirmarRule() {
      if (this.claveConfirmar === "") {
    
        this.successClaveConfirmar = false;
        return "";
      } else if (this.matchingPasswords() === true) {
      
        this.successClaveConfirmar = true;
        return "mdi-check";
      } else {
        
        this.successClaveConfirmar = false;
        return "mdi-close";
      }
    },
    claveRule() {
      if (this.clave === "") {
    
        this.successClave = false;
        return "";
      } else if (this.min8(this.clave) === true) {
      
        this.successClave = true;
        return "mdi-check";
      } else {
        
        this.successClave = false;
        return "mdi-close";
      }
    },
    emailRule() {
      if (this.email === "") {
    
        this.successEmail = false;
        return "";
      } else if (this.validarEmail(this.email) === true) {
      
        this.successEmail = true;
        return "mdi-check";
      } else {
        
        this.successEmail = false;
        return "mdi-close";
      }
    },
    usuarioRule() {
      if (this.usuario === "") {
    
    this.successUsuario = false;
    return "";
  } else if (this.min6(this.usuario) === true) {
  
    this.successUsuario = true;
    return "mdi-check";
  } else {
    
    this.successUsuario = false;
    return "mdi-close";
  }
    },
  },
};
  </script>
  <style lang="scss" scoped>
  .fondo{
      background-image: url('../assets/img/portada.png');
      background-position: center center;
      background-size: cover;
      height: 100%;
    }
    .banda{
  background-color: rgba(160, 141, 136, 0.7);
}
.formulario{
  color: rgb(44, 20, 20);
    font-family: sans-serif;
    background-color: rgba(160, 141, 136, 0.9);
    border-radius: 5px;
    margin-top: 90px;
    margin-bottom: 90px;
    padding: 30px;
    padding-left: 60px;
    padding-bottom: 60px;
}
.button{
          background-color: #d6a86f;
    color: rgb(44, 20, 20);
      }
.button:hover {
    opacity: 0.8;
  }

.input-wrapper {
        position: relative;
        width: 271px;
      }
      
.input {
        box-sizing: border-box;
        color: #191919;
        padding: 15px 15px 15px 35px;
        width: 100%;
      }
      
.input.password {
        padding: 15px 35px 15px 15px;
      }
      
.input-icon {
        position: absolute;
        width: 20px;
        height: 20px;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        cursor:pointer;
      }
      
.input-icon.password {
        left: unset;
        right: 12px;
      }
      a{
        color:rgb(28, 8, 157)
    }
  </style>
  