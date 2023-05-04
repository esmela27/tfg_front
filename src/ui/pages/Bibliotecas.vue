<template>
  <div>
    <v-card>
    <v-layout>
      <v-navigation-drawer
      color="#1F7087"
        theme="dark"
        permanent
      >
      <h2>{{ $route.params.usuario }}</h2>
      <v-list density="compact" nav>
          <v-list-item prepend-icon="mdi-view-dashboard" title="Inicio" value="inicio" @click="inicio()"> </v-list-item>
          <v-list-item prepend-icon="mdi-album" title="Generos" value="generos()" @click="generos()" ></v-list-item>
          <v-list-item prepend-icon="mdi-account-music" title="Artistas" value="artistas"  @click="artistas()" ></v-list-item>
          <v-list-item prepend-icon="mdi-music-box-multiple" title="Bibliotecas" value="bibliotecas" @click="bibliotecas()"></v-list-item>
        </v-list>

        <template v-slot:append>
          <div class="pa-2 boton_nav">
            <v-btn block  @click="overlay = !overlay" >
              Logout
            </v-btn>
          </div>
        </template>
      </v-navigation-drawer>
      <v-main style="height: 1080px" class="cuerpo">
    <v-snackbar :color="snackbar.color" v-model="snackbar.show" height="-12" absolute  multi-line location="top">
          <strong class="text-center align-center">{{ snackbar.message }}</strong>
      </v-snackbar>
      <div class="cabecera">
        <v-row >
          <v-col cols="4"><v-img :src="logo" class="logo"></v-img></v-col>
          <v-col cols="7" class="text-center"><h1>Playlist</h1></v-col>
          <v-col cols="1"></v-col>
        </v-row>
        </div>
    <div>
      <div>

        <v-row>
          <v-col cols="1"></v-col>
          <v-col cols="5">
            <v-text-field
              prepend-inner-icon="mdi-magnify"
              v-model="search"
              placeholder="Buscar biblioteca"
              class="pt-4 mr-2 shrink custom-placeholder-color input__text"
            ></v-text-field>
          </v-col>
          <v-col cols="3"> </v-col>
          <v-col cols="2" ><v-btn class="boton__crear" @click="overlayBiblioteca=!overlayBiblioteca">crear playlist</v-btn> </v-col>
          <v-col cols="1"></v-col>
        </v-row>
        <v-row>
        <v-col cols="1"></v-col>
        <v-col cols="10">
          <v-table theme="dark">
            <thead>
              <tr>
                <th class="text-left">Fecha creación</th>
                <th class="text-left">Nombre</th>
                
              </tr>
            </thead>
            <tbody>
              <tr class="fila" v-for="item in filteredData" :key="item.id" >
                <td @click="mostrarCanciones(item.id)"> {{new Date(item.fecha).toLocaleString()}}</td>
                <td @click="mostrarCanciones(item.id)">{{ item.nombre }}</td>
                <td class="centrar">  
                    <v-btn variant="text" icon="mdi-trash-can-outline" @click="overlayBasura= !overlayBasura, identBiblioteca(item.id)"></v-btn>   
                    <v-btn variant="text" icon="mdi-square-edit-outline" @click="overlayEditar= !overlayEditar, identBiblioteca(item.id)"></v-btn>
                </td>
                
              </tr>
            </tbody>
          </v-table>
        </v-col>
        <v-col cols="1"></v-col>
    </v-row>

      </div>
    </div>
    <v-row>
      <v-col cols="2"></v-col>
      <v-col cols="12" md="8" lg="3">
        <!-- <v-btn
              class="btn-anterior-siguiente"
              v-if="page != 1"
              @click="page--"
            >
              <v-icon left>mdi-chevron-left</v-icon> ANTERIOR</v-btn
            > -->
        <v-pagination
          active-color="#ebb655"
          v-model="page"
          :length="paginas"
          :total-visible="5"
          class="paginacion"
        ></v-pagination>
      </v-col>
      <!-- <v-btn
              class="btn-anterior-siguiente"
              v-if="page < paginas"
              @click="page++"
            >
              SIGUIENTE<v-icon right>mdi-chevron-right</v-icon></v-btn
            > -->
    </v-row>
    <v-overlay
    opacity="0.7"
      v-model="overlay"
      scroll-strategy="reposition"
      class="align-center justify-center"
    >
      <v-card width="400" title="Cerrar sesión" text="¿Desea cerrar sesión?">
        <v-btn class="form__biblioteca" color="#f5deb3" @click="volver()"> Si</v-btn>
      </v-card>
    </v-overlay>

    <v-overlay
    opacity="0.7"
      v-model="overlayBasura"
      scroll-strategy="reposition"
      class="align-center justify-center"
    >
      <v-card   width="400" title="Borrar biblioteca" text="¿Desea borrar biblioteca?">
        <v-btn class="form__biblioteca" color="#f5deb3" @click="borrarBiblioteca()"> Si</v-btn>
      </v-card>
    </v-overlay>

    <v-overlay
    opacity="0.7"
      v-model="overlayEditar"
      scroll-strategy="reposition"
      class="align-center justify-center"
    >
      <v-card   width="400" title="Modificar nombre" text="Introduzca el nuevo nombre">
        <form class="form__biblioteca" >       
             <v-text-field
        label="biblioteca" variant="outlined" v-model="nombre"
          ></v-text-field>
        <v-btn color="#f5deb3" @click="editarNombre()"> Si</v-btn>
    </form>
      
      </v-card>
    </v-overlay>


    <v-overlay
      v-model="overlayBiblioteca"
      scroll-strategy="reposition"
    class="align-center justify-center">
    <v-card width="400" title="Crear biblioteca" text="Escribe nombre de biblioteca">
      <form class="form__biblioteca" >        <v-text-field
        label="biblioteca" variant="outlined" v-model="biblioteca"
          ></v-text-field>
          <v-btn color="#f5deb3" @click="agregarRegistro()"> Crear</v-btn>

      </form>
      
    </v-card>
    </v-overlay>
  </v-main>
    </v-layout>
  </v-card>
  </div>
</template>
<script>
import SongPlayer from "../components/ReproductorMusica.vue";
import axios from "axios";
import logo from '../assets/img/logo.png'

export default {
  data() {
    return {
      isPlayerVisible: false,
      currentSongIndex: 0,
      registro: [],
      search: "",
      page: 1,
      perPage: 3,
      filtrado: [],
      overlay: false,
      overlayBiblioteca:false,
      overlayBasura:false,
      overlayEditar:false,
      biblioteca:'',
      identificadorBiblioteca:null,
      snackbar: {
          show: false,
          message: null,
          color: null,
        },
    nombre:'',
    logo
    };
  },
  created() {
    this.getBiblioteca();
    this.getUsuario();
  },
  components: {
    SongPlayer,
  },
  methods: {
    identBiblioteca(id){
        this.identificadorBiblioteca = id
    },
    editarNombre(){
        const send ={
            id: this.identificadorBiblioteca,
            nombre: this.nombre
        }
        axios.post ('http://localhost:3000/editarNombre', send)
        .then(data => {
          this.getBiblioteca();
            console.log(data.data)
     
                this.snackbar = {
                        message: 'biblioteca actualizada',
                        color: 'green',
                        show: true
                    }
              
            })

    },
    borrarBiblioteca(){
        const send ={
            id: this.identificadorBiblioteca
        }
        axios.post ('http://localhost:3000/borrarBiblioteca', send)
        .then(data => {
          this.getBiblioteca();
            console.log(data.data)
     
                this.snackbar = {
                        message: 'biblioteca borrada',
                        color: 'red',
                        show: true
                    }
              
            })

    },
    mostrarCanciones(biblioteca){
        const usuario = this.$route.params.usuario;
        const id = this.$route.params.id; 
        this.identificadorBiblioteca = biblioteca
        const idBiblioteca = this.identificadorBiblioteca
       
        console.log(this.identificadorBiblioteca)
        this.$router.push({ path:`/biblioteca/${usuario}/${id}/${idBiblioteca}`});
    },
    async getBiblioteca() {
        const id = this.$route.params.id;
      console.log("hola");
      axios
        .get(`http://localhost:3000/biblioteca/${id}`)
        .then((response) => {
          console.log(response);
          this.registro = response.data;
          console.log(this.registro)
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getUsuario() {
      const usuario = this.$route.params.usuario
      console.log('hola')
      axios
        .get(`http://localhost:3000/getUsuario/${usuario}`)
        .then((response) => {
          console.log(response);
          this.usuario = response.data;
          console.log(this.usuario[0].id)
        })
        .catch((error) => {
          console.log(error);
        });
    },
    artistas() {
      const usuario = this.$route.params.usuario;
      this.$router.push({ path: `/artistas/${usuario}` });
    },
    generos() {
      const usuario = this.$route.params.usuario;
      this.$router.push({ path: `/generos/${usuario}` });
    },
    inicio() {
      const usuario = this.$route.params.usuario;
      this.$router.push({ path: `/canciones/${usuario}` });
      this.isPlayerVisible = false;
    },
    volver() {
      this.$router.push({ path: `/` });
    },
    artistaSeleccionado(artista) {
      const usuario = this.$route.params.usuario;
      this.$router.push({ path: `/artista/${usuario}/${artista}` });
    },
    paginar(urls) {
      //Ordenar los registros segun la cantidad que haya por cada pagina
      return urls.slice(
        this.page * this.perPage - this.perPage,
        this.page * this.perPage
      );
    },
    agregarRegistro(){
        const fechaActual = new Date();
            console.log(this.$route.params.id)
            const send = {
        usuario_id: this.$route.params.id,
        nombre: this.biblioteca,
        fecha: fechaActual.toISOString().slice(0, 19).replace('T', ' ')
      };
      console.log(send);
      // const url = `${config.URL}crearCuenta`
      const url = 'http://localhost:3000/crearBiblioteca'
       axios.post(url, send).then(data => {
        this.getBiblioteca()
        console.log(data.data)
     
     this.snackbar = {
             message: 'biblioteca creada',
             color: 'green',
             show: true
         }
            })
    },

  },
  computed: {
    filteredData() {
      //filtrar datos del buscador
      return this.paginar(
        (this.filtrado = this.registro.filter(({ nombre }) =>
          [nombre.toLowerCase()].some((val) =>
            val.includes(this.search.toLowerCase())
          )
        )),
        console.log(this.filtrado.length)
      );
    },

    paginas() {
      //Numero de paginas que tiene
      if (this.filtrado.length / this.perPage < 1) {
        this.page = 1;
        return 1;
      }
      if (this.filtrado.length % 10 == 0) {
        return this.filtrado.length / this.perPage;
      }
      return Math.trunc(this.filtrado.length / this.perPage + 1);
    },
  },
};
</script>
         <style lang="scss" scoped>
.centrar {
  text-align: center;
}
img {
  width: 50px;
  height: 50px;
}
.titulo {
  margin-top: 30px;
  font-family: "FontAwesome", sans-serif;
  color: wheat;
  font-size: 4em;
  text-transform: uppercase;
  font-weight: 500px;
}
.input__text {
  color: wheat;

}
h1 {
  margin-top: 30px;
  font-family: "FontAwesome", sans-serif;
  color: wheat;
  font-size: 4em;
  text-transform: uppercase;
  font-weight: 500px;
}
.paginacion {
  color: #f5deb3;
}
.boton__crear{
    background-color: #cd853f;
    color: aliceblue;
    margin: 40px;
}
.form__biblioteca{
  margin: 10px;
}
.fila{
    cursor:pointer;
}
.cuerpo{
  height: 1080px;
  background: linear-gradient(50deg, rgb(32, 32, 37), rgb(69, 65, 82));
}
h2{
  margin: 30px;
}
.boton_nav{
  margin-bottom: 20px;
  margin-right: 10px;
  margin-left: 10px;
}
.cabecera{
  background-color: #252627;
  height: 125px;
  box-shadow: 5px 5px 40px;  
}
.logo{
  height: 100px;

}
.sombra{
  box-shadow: 5px 5px 40px;  
}

</style>