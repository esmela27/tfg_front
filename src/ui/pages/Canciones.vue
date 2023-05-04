<template>
  <div>
    <v-card  >
    <v-layout >
      <v-navigation-drawer
        color="#1F7087"
        theme="dark"
        permanent
        class="sombra"
      >
      <h2>{{ $route.params.usuario }}</h2>
      <v-divider class="divisor"></v-divider>
        <v-list density="compact" nav>
          <v-list-item prepend-icon="mdi-view-dashboard" title="Inicio" value="inicio" @click="inicio()"> </v-list-item>
          <v-list-item prepend-icon="mdi-album" title="Generos" value="generos" @click="generos()" ></v-list-item>
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
          <v-col cols="7" class="text-center"><h1>Todas las canciones</h1></v-col>
          <v-col cols="1"></v-col>
        </v-row>
        </div>
    <div>
      <div v-if="!isPlayerVisible">
      
        
        <v-row >
      <v-col cols="1"></v-col>
      <v-col cols="10" >
        <v-text-field
            prepend-inner-icon="mdi-magnify"
            v-model="search"
            placeholder="Buscar canción, artista o album"
            class="pt-4 mr-2 shrink custom-placeholder-color input__text"
          ></v-text-field>
      </v-col>
      <v-col cols="1"></v-col>
    </v-row> 
      <v-row v-for="(item, indexItem) in filteredData" v-bind:key="item.id">
        <v-col cols="1"></v-col>
        <v-col cols="10">
          <v-card
            color="#1F7087"
            theme="dark"
            class="sombra"
          >
            <div class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-card-title class="text-h5">
                  {{ item.nombre }}
                </v-card-title>

                <v-card-subtitle>{{ item.artista }}</v-card-subtitle>

                <v-card-actions>
                  <v-btn
                    class="ms-2"
                    icon="mdi-play"
                    variant="text"
                    @click="playSong(indexItem)"
                  ></v-btn>
                </v-card-actions>
              </div>
              <v-spacer></v-spacer>
              <v-avatar
                class="ma-3 avatar"
                size="125"
                rounded="3px"
                
              >
                <v-img :src="`http://localhost:3000/imagen/${item.id}`"></v-img>
              </v-avatar>
              <v-menu>
                <template v-slot:activator="{ props }">
              <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props" @click="cogerId(item.id)"></v-btn>
              </template>
              <v-list>
              <v-list-item
                v-for="(item, i) in items"
                :key="i"
              >
                <v-list-item-title class="menu" @click="getBiblioteca(), overlayBiblioteca= !overlayBiblioteca">{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
              </v-menu>
              <!-- <v-btn icon="mdi-dots-vertical" variant="text" @click="overlayBiblioteca= !overlayBiblioteca, cogerId(item.id)" ></v-btn> -->
            </div>
          </v-card>
        </v-col>
        <v-col cols="1"></v-col>
      </v-row>
      
        <v-row>
        <v-col cols="2"></v-col>
        <v-col cols="12" md="8" lg="3">

          <v-pagination
            active-color="#ebb655"
            v-model="page"
            :length="paginas"
            :total-visible="5"
          class="paginacion"
          ></v-pagination>
        </v-col>

      
      </v-row>
      </div>
      <div v-if="isPlayerVisible">
        <SongPlayer
          v-bind:song="filteredData[currentSongIndex]"
          @goback="isPlayerVisible = !isPlayerVisible"
          @next="playNext"
          @previous="playPrevious"
        />
      </div>
    </div>
    <v-overlay 
    opacity="0.7"
    v-model="overlay"
    scroll-strategy="reposition"
    class="align-center justify-center">
    <v-card width="400" title="Cerrar sesión" text="¿Desea cerrar sesión?">
      <v-btn color="#f5deb3" @click="volver()"> Si</v-btn>
    </v-card>

    </v-overlay>
    <v-overlay 
    v-model="overlayBiblioteca"
    scroll-strategy="reposition"
    class="align-center justify-center">
    <!-- <v-card width="400" title="Biblioteca" text="Escribe nombre de biblioteca">
      <form class="form__biblioteca">       
         <v-text-field
        label="biblioteca" variant="outlined" v-model="nombreBiblioteca"
          ></v-text-field>
          <v-btn color="#f5deb3" @click="añadirCancion()"> Añadir</v-btn>

      </form>
      
    </v-card> -->
    <v-card width="400" title="Seleccione playlist" >

      <v-text-field
            prepend-inner-icon="mdi-magnify"
            v-model="searchBiblioteca"
            placeholder="Buscar biblioteca"
            class="buscador"
          ></v-text-field>
        <v-list>
              <v-list-item
                v-for="(item) in  filteredDataBiblioteca"
                :key="item.id"
              >
                <v-list-item-title class="menu biblioteca" @click="añadirCancion(item.nombre)">{{ item.nombre }}</v-list-item-title>
              </v-list-item>
            </v-list>
            
          <v-pagination
            active-color="#1F7087"
            v-model="pageBiblioteca"
            :length="paginasBiblioteca"
            :total-visible="3"
            class="buscador"
          ></v-pagination>
      
    </v-card>

    </v-overlay>
  </v-main>
    </v-layout>
  </v-card>
  </div>
</template>
   
   <script>
import SongPlayer from '../components/ReproductorMusica.vue';
import axios from 'axios'
import logo from '../assets/img/logo.png'
export default {
  data() {
    return {
      isPlayerVisible: false,
      currentSongIndex: 0,
      bibliotecasLista: [],
      registro: [],
      search: '',
      searchBiblioteca: '',
      page: 1,
      perPage: 4,
      pageBiblioteca: 1,
      perPageBiblioteca: 4,
      filtrado: [],
      filtradoBiblioteca: [],
      overlay: false,
      overlayBiblioteca: false,
      usuario: [],
      identificacion: null,
      nombreBiblioteca: '',
      snackbar: {
          show: false,
          message: null,
          color: null,
        },
        items: [
        { title: 'Añdir a una playlist' }
      ],
      logo
    };
  },
  created() {
    this.getCanciones();
    this.getUsuario()
},
components: {
    SongPlayer
    },
  methods: {
    async getBiblioteca() {
        const id = this.usuario[0].id
      console.log("hola" + id);
      axios
        .get(`http://localhost:3000/biblioteca/${id}`)
        .then((response) => {
          console.log(response);
          this.bibliotecasLista = response.data;
          console.log(this.bibliotecas)
        })
        .catch((error) => {
          console.log(error);
        });
    },
    añadirCancion(nombre){
      const send = {
        id_cancion: this.identificacion,
        nombre_biblioteca: nombre
      };
      console.log(send)
      const url = 'http://localhost:3000/anadirFavoritos'
       axios.post(url, send).then(data => {
              if (data.data.añadido == true){
                this.snackbar = {
                        message: 'Añadido correctamente',
                        color: 'green',
                        show: true
                    }
              }
              else{
                this.snackbar = {
                        message: 'no existe biblioteca con ese nombre',
                        color: 'red',
                        show: true
                    }
              }
            })

    },
    cogerId(id){
      this.identificacion = id
      console.log(this.identificacion)
    },
    bibliotecas(){
      const id = this.usuario[0].id
      console.log('este es el id'+id)
      const usuario = this.$route.params.usuario;
      this.$router.push({ path: `/bibliotecas/${usuario}/${id}` });
    },
    artistas(){
      const usuario = this.$route.params.usuario;
      this.$router.push({ path: `/artistas/${usuario}` });
    },
    generos(){
      const usuario = this.$route.params.usuario
this.$router.push({ path:`/generos/${usuario}`});

    },
    inicio(){
      const usuario = this.$route.params.usuario
      this.$router.push({ path:`/canciones/${usuario}`});
      this.isPlayerVisible = false
    },
    volver() {
      this.$router.push({ path: `/` });
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
    async getCanciones() {
      console.log('hola')
      axios
        .get("http://localhost:3000/cancionesDatos")
        .then((response) => {
          console.log(response);
          this.registro = response.data;
          console.log(this.registro)
        })
        .catch((error) => {
          console.log(error);
        });
    },
    playSong (index) {
            this.currentSongIndex = index;
            console.log(this.currentSongIndex)
            this.isPlayerVisible = true;
    },
    playNext () {
            if (this.currentSongIndex < this.registro.length - 1) {
                this.currentSongIndex += 1;
            } else {
                this.currentSongIndex = 0;
            }
        },
        playPrevious () {
            if (this.currentSongIndex != 0) {
                this.currentSongIndex -= 1;
            } else {
                this.currentSongIndex = this.registro.length - 1;
            }
        },
    paginar(urls) {
        //Ordenar los registros segun la cantidad que haya por cada pagina
      return urls.slice(
        this.page * this.perPage - this.perPage,
        this.page * this.perPage
      );
    },
    paginarBiblioteca(urls) {
        //Ordenar los registros segun la cantidad que haya por cada pagina
      return urls.slice(
        this.pageBiblioteca * this.perPageBiblioteca - this.perPageBiblioteca,
        this.pageBiblioteca * this.perPageBiblioteca
      );
    },
  },
  computed: {
    filteredData() {
      //filtrar datos del buscador
      return this.paginar(
        (this.filtrado = this.registro.filter(({ artista, nombre }) =>
          [artista.toLowerCase(), nombre.toLowerCase()].some((val) =>
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
    filteredDataBiblioteca() {
      //filtrar datos del buscador
      return this.paginarBiblioteca(
        (this.filtradoBiblioteca = this.bibliotecasLista.filter(({  nombre }) =>
          [ nombre.toLowerCase()].some((val) =>
            val.includes(this.searchBiblioteca.toLowerCase())
          )
        )),
        console.log(this.filtrado.length)
      );
    },
    paginasBiblioteca() {
      //Numero de paginas que tiene
      if (this.filtradoBiblioteca.length / this.perPageBiblioteca < 1) {
        this.pageBiblioteca = 1;
        return 1;
      }
      if (this.filtradoBiblioteca.length % 10 == 0) {
        return this.filtradoBiblioteca.length / this.perPageBiblioteca;
      }
      return Math.trunc(this.filtradoBiblioteca.length / this.perPageBiblioteca + 1);
    },

  }
};
</script>
   <style lang="scss" scoped>
   
img {
  width: 50px;
  height: 50px;
}
.fila-mano {
  cursor: pointer;
}
table {
  text-align: center;
  width: 100%;
}
th {
  color: #2e2f2d;
  background-color: #fad201;
  text-align: center;
}
td {
  border-bottom: 1px solid #fad201;
}
h1 {
  margin-top: 30px;

  color: white;
  font-size: 3em;
  text-transform: uppercase;
  font-weight: 500px;
}
.input__text {
  color: wheat;
  
}
.paginacion{
  color: #f5deb3;
}
.avatar{
  float: right;
}
.biblioteca{

  background-color: #f5deb3 ;
  margin: 1px;
  padding: 10px;
  border-radius: 15px;
}
.menu{
    cursor:pointer;
}
.buscador{
  margin-top: 5px;
  margin-bottom: -5px;
  margin-right: 15px;
  margin-left: 15px;
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
  box-shadow: 10px 10px 5px rgb(37, 37, 37);  
}
.divisor{
  color: #000;
}
</style>
   