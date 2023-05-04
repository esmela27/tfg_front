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
    <div>
      <div>
        <div class="cabecera">
  <v-row >
          <v-col cols="4"><v-img :src="logo" class="logo"></v-img></v-col>
          <v-col cols="7" class="text-center"><h1>Géneros Musicales</h1></v-col>
          <v-col cols="1"></v-col>
        </v-row>
        </div>
        <br>
        <v-row>
          <v-col cols="2"></v-col>
          <v-col cols="3" class="text-center">
            <v-card class="mx-auto sombra" max-width="344">
              <v-img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMJjJ0hqnbo6g1paukrlYPuNiobeo9jrVbwg&usqp=CAU"
                height="200px"
                cover
              ></v-img>

              <v-card-title> Musica Pop </v-card-title>

              <v-card-subtitle>
                Intención de que agrade a las masas
              </v-card-subtitle>

              <v-card-actions>
                <v-btn color="orange-lighten-2" variant="text" @click="generoSeleccionado('Pop')">
                  Escuchar
                </v-btn>

                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="2"> </v-col>
          <v-col cols="3" class="text-center">
            <v-card class="mx-auto sombra" max-width="344">
              <v-img
                src="data:image/png;base64,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"
                height="200px"
                cover
              ></v-img>

              <v-card-title> Musica Rock </v-card-title>

              <v-card-subtitle>
                Intención de que agrade a las masas
              </v-card-subtitle>

              <v-card-actions>
                <v-btn color="orange-lighten-2" variant="text" @click="generoSeleccionado('Rock')">
                  Escuchar
                </v-btn>

                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-col>

          <v-col cols="2"></v-col>
        </v-row>
        <v-row>
          <v-col cols="2"></v-col>
          <v-col cols="3" class="text-center">
            <v-card class="mx-auto sombra" max-width="344">
              <v-img
                src="https://i0.wp.com/rapealo.com/wp-content/uploads/2022/07/rap.jpg?fit=768%2C768&ssl=1"
                height="200px"
                cover
              ></v-img>

              <v-card-title> Musica Rap </v-card-title>

              <v-card-subtitle>
                Intención de que agrade a las masas
              </v-card-subtitle>

              <v-card-actions>
                <v-btn color="orange-lighten-2" variant="text" @click="generoSeleccionado('Rap')">
                  Escuchar
                </v-btn>

                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="2"></v-col>
          <v-col cols="3" class="text-center">
            <v-card class="mx-auto sombra" max-width="344">
              <v-img
                src="https://static.vecteezy.com/system/resources/previews/004/223/889/non_2x/modern-lettering-poster-in-reggae-style-isolated-typography-for-your-design-handwritten-stock-calligraphy-for-logotype-badge-icon-card-postcard-logo-banner-tag-illustration-eps10-free-vector.jpg"
                height="200px"
                cover
              ></v-img>

              <v-card-title> Musica Reggae </v-card-title>

              <v-card-subtitle>
                Intención de que agrade a las masas
              </v-card-subtitle>

              <v-card-actions>
                <v-btn color="orange-lighten-2" variant="text" @click="generoSeleccionado('Reggae')">
                  Escuchar
                </v-btn>

                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-col>

          <v-col cols="2"></v-col>
        </v-row>
      </div>
    </div>
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
      perPage: 4,
      filtrado: [],
      overlay: false,
      logo
    };
  },
  created() {
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
    generoSeleccionado(genero){
      const usuario = this.$route.params.usuario;
      this.$router.push({ path: `/genero/${usuario}/${genero}` });

    },
    artistas(){
      const usuario = this.$route.params.usuario;
      this.$router.push({ path: `/artistas/${usuario}` });
    }


    
  },
  computed: {
 
  },
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
  font-family: "FontAwesome", sans-serif;
  color: wheat;
  font-size: 4em;
  text-transform: uppercase;
  font-weight: 500px;
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
     