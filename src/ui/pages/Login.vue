<template>
    <div>
      <v-snackbar :color="snackbar.color" v-model="snackbar.show" height="-12" absolute  multi-line location="top">
          <strong class="text-center align-center">{{ snackbar.message }}</strong>
      </v-snackbar>
      <v-container class="container">
        <h1 class="titulo">Escucha tu musica
             <span class="typed-text">{{ typeValue }}</span>
             <span class="cursor" :class="{'typing':typeStatus}">&nbsp;</span></h1>
    </v-container>
  
    <v-container>
      <v-row>
        <v-col cols="4"></v-col>
        <v-col>
          <form action class="formulario" @submit.prevent="login">
            <h1>Acceder al sitio</h1>
            <br />
            <v-text-field v-model="usuario" label="Usuario"></v-text-field>
  
            <v-text-field type="password" v-model="clave" label="Contraseña"></v-text-field>
  
            <v-btn type="submit" block class="boton mt-2" value="Login"
              >ACCEDER</v-btn
            >
            <p> <br>
            ¿No esta registrado?

            <router-link to="/crearCuenta">Crear Cuenta</router-link>
</p>
          </form>
        </v-col>
        <v-col cols="4"></v-col>
      </v-row>
  
  
    </v-container>  
  </div>
  
  </template>
  <script>
  import axios from "axios"
  export default {
    name: "Formulario",
  
    data() {
      return {
        usuario: "",
        clave: "",
        snackbar: {
          show: false,
          message: null,
          color: null,
        },
        typeValue: '',
     typeStatus: true,
     typeArray : ['Rock', 'Pop', 'Reggae', 'Rap'],
     typingSpeed: 200,
     erasingSpeed: 100,
     newTextDelay: 2000,
     typeArrayIndex: 0,
     charIndex:0,
      };
    },
    methods: {
      async login() {
        const send = {
          usuario: this.usuario,
          contrasena: this.clave,
        };
        console.log(send);
        // const url = `${config.URL}crearCuenta`
        const url = "http://localhost:3000/acceder";
  
          await axios
            .post(url, send)
            .then((data) => {
              if(data.data.success == true){
              this.$router.push({ path:`/canciones/${data.data.usuario}`});
              this.datas = data.data;
              console.log( 'esmeralda:' + this.datas);
              }else{
                this.snackbar = {
                message: "Contraseña o usuario no son correctos",
                color: "error",
                show: true,
              };
              }
             
            })
            .catch((err) => {
              this.snackbar = {
                message: "Contraseña o usuario no son correctos",
                color: "error",
                show: true,
              };
              console.error(err);
            });
          
      },
      typeText(){
        if(this.charIndex < this.typeArray[this.typeArrayIndex].length){
            if(!this.typeStatus){
                this.typeStatus = true;
            }
            this.typeValue += this.typeArray[this.typeArrayIndex].charAt(this.charIndex)
            this.charIndex +=1;

            setTimeout(this.typeText, this.typingSpeed)
        }
        else{
            this.typeStatus = false;
            setTimeout(this.eraseText, this.newTextDelay)
        }

    },
    eraseText(){
         if(this.charIndex > 0){
            if(!this.typeStatus){
                this.typeStatus = true;
            }
            this.typeValue = this.typeArray[this.typeArrayIndex].substring(0, this.charIndex - 1)
            this.charIndex -= 1;
            setTimeout(this.eraseText, this.erasingSpeed);
         }
         else{
            this.typeStatus = false;
            this.typeArrayIndex +=1;
            if (this.typeArrayIndex >= this.typeArray.length){
                this.typeArrayIndex = 0
            }
            setTimeout(this.typeText, this.typingSpeed + 100)
         }
    }
    },
    created(){
    setTimeout(this.typeText, this.newTextDelay + 200)
}
  };
  </script>
  <style scoped>
.formulario{
    color: rgb(44, 20, 20);
    font-family: sans-serif;
    background-color: rgba(160, 141, 136, 0.7);
    border-radius: 5px;
    padding: 30px;
    margin-top: 90px;
}
.boton{
    background-color: #d6a86f;
    color: rgb(44, 20, 20);
}
a{
    color:rgb(28, 8, 157)
}
.fondo {
    background-image: url('../../assets/img/portada.png');
    background-position: center center;
    background-size: cover;
    height: 100%;
  }
.titulo{
    padding-top: 20px;
    padding-bottom: 20px;
    margin-top: 100px;
    color:rgb(44, 20, 20);
    background-color: rgb(194, 204, 204);
    text-align: center;
    background: rgba(160, 141, 136, 0.5);
    font-size: 4em;
    font-weight: normal;
    font-family: Vegur, 'PT Sans', Verdana, sans-serif;

    span.typed-text{
        color: #ffe4c4;
    }
    span.cursor {
        display: inline-block;
        margin-left: 3px;
        width: 4px;
        background-color: #706b6b;
        animation: cursorBlink 1s infinite;
    }

    span.cursor.typing {
       animation: none; 
    }

}

@keyframes cursorBlink{
    49% {background-color: #fff;}
    50% {background-color: transparent;}
    99% {background-color: transparent;}
}
  </style>