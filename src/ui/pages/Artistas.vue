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
        <div class="cabecera">
  <v-row >
          <v-col cols="4"><v-img :src="logo" class="logo"></v-img></v-col>
          <v-col cols="7" class="text-center"><h1>Artistas musicales</h1></v-col>
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
              placeholder="Buscar artista"
              class="pt-4 mr-2 shrink custom-placeholder-color input__text"
            ></v-text-field>
          </v-col>
          <v-col cols="5"> </v-col>
          <v-col cols="1"></v-col>
        </v-row>


        <v-row v-for="item in filteredData" v-bind:key="item.id">
          <v-col cols="1"></v-col>
          <v-col cols="10" class="text-center">
            <div class="contenedor sombra">
                <div class="contenedor__descripcion">
                    <v-img class="imagen"
                  :src="`http://localhost:3000/imagenArtista/${item.id}`"
                  height="400px"
                  cover
                ></v-img>
                </div>
                <div class="contenedor__descripcion"> <h1>{{ item.nombre }}</h1>
                    <p class="parrafo">{{ item.descripcion }}</p>
                    <v-btn @click="artistaSeleccionado(item.nombre)" > Escuchar</v-btn>
                </div>
                   
            

            </div>
          </v-col>
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
    v-model="overlay"
    scroll-strategy="reposition"
    class="align-center justify-center">
    <v-card width="400" title="Cerrar sesión" text="¿Desea cerrar sesión?">
      <v-btn color="#f5deb3" @click="volver()"> Si</v-btn>
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
      perPage: 2,
      filtrado: [],
      overlay: false,
      logo
    };
  },
  created() {
    this.getArtistas();
    this.getUsuario();
  },
  components: {
    SongPlayer,
  },
  methods: {
    bibliotecas(){
      const id = this.usuario[0].id
      console.log('este es el id'+id)
      const usuario = this.$route.params.usuario;
      this.$router.push({ path: `/bibliotecas/${usuario}/${id}` });
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
    async getArtistas() {
      console.log("hola");
      axios
        .get(`http://localhost:3000/artistas`)
        .then((response) => {
          console.log(response);
          this.registro = response.data;
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
  },
   computed: {
    filteredData() {
      //filtrar datos del buscador
      return this.paginar(
        (this.filtrado = this.registro.filter(({nombre }) =>
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
.contenedor {
  background-color: wheat;
  height: 300px;
  border-radius: 15px;
  margin: 20px;
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
.imagen{
  border-radius: 15px;
}
.parrafo{
  margin: 20px;
}
.contenedor__descripcion{
    display: inline-block;
  width: 50%;
  height: 300px;
  text-align: center;
  vertical-align: middle;
}
.paginacion{
  color: #f5deb3;
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
h1 {
  margin-top: 30px;

  color: white;
  font-size: 3em;
  text-transform: uppercase;
  font-weight: 500px;
}
</style>
       