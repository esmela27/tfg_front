<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer
        class="bg-deep-purple"
        theme="dark"
        permanent
      >
        <v-list color="transparent">
          <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard"></v-list-item>
          <v-list-item prepend-icon="mdi-account-box" title="Account"></v-list-item>
          <v-list-item prepend-icon="mdi-gavel" title="Admin"></v-list-item>
        </v-list>

        <template v-slot:append>
          <div class="pa-2">
            <v-btn block>
              Logout
            </v-btn>
          </div>
        </template>
      </v-navigation-drawer>
      <v-main style="height: 1080px">
        <div>
        <div>
      <div v-if="!isPlayerVisible">
        <v-row >
          <v-col cols="1"></v-col>
          <v-col cols="10" class="text-center"><h1>Todas las canciones</h1></v-col>
          <v-col cols="1"></v-col>
        </v-row>
        
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
  </div>
      </v-main>
    </v-layout>
  </v-card>
</template>
   
   <script>
export default {
  data() {
    return {
      isPlaying: true,
      boton: {
        icon: "mdi-pause",
      },
      dura: 0,
      duracion:0,
      currentTime: 0,
      duracionCanción: '',
      transcurridoCancion: '',
      segundo: '',
      minuto: '',
      segundoTrans: '',
      minutoTrans: '',
    };
  },
  name: "SongPlayer",
  props: {
    song: {
      id: Number,
      nombre: String,
      artista: String,
      album: String,
      ano: Number,
    },
  },
  emits: ["goback", "next", "previous"],
  methods: {
    goback() {
      this.$emit("goback");
    },
    togglePlay() {
      if (this.isPlaying) {
        this.$refs.audioPlayer.pause();
        this.boton = {
          icon: "mdi-play",
        };
      } else {
        this.$refs.audioPlayer.play();
        this.boton = {
          icon: "mdi-pause",
        };
      }
      this.isPlaying = !this.isPlaying;
    },
    next() {
      this.$emit("next");
    },
    previous() {
      this.$emit("previous");
    },
    mover(duracion){
        const stream = document.getElementById('stream')
        stream.currentTime = Math.round(parseInt(duracion)) ;
        console.log(stream)
    },
    progressListener(e) {
			const player = e.target
			const duration = player.duration

     console.log('Hola'+duration)
     const minutos = parseInt(duration / 60)
      const segundos = parseInt(duration % 60)
      console.log(minutos, segundos)
      if (parseInt(segundos/10)== 0){
        this.segundo = '0'+segundos
      }else{
        this.segundo = segundos
      }
      if(parseInt(minutos/10) == 0){
        this.minuto = '0'+minutos
      }else{
        this.minuto = minutos
      }
      this.duracionCanción = this.minuto + ':'+this.segundo
		},
        timeUpdate(e) {
			const target = e.target
			this.currentTime = target.currentTime
      this.dura=this.currentTime
      console.log('esme'+this.dura)
       const minutos = parseInt(this.currentTime / 60)
      const segundos = parseInt(this.currentTime % 60)
      if (parseInt(segundos/10)== 0){
        this.segundoTrans = '0'+segundos
      }else{
        this.segundoTrans = segundos
      }
      if(parseInt(minutos/10) == 0){
        this.minutoTrans = '0'+minutos
      }else{
        this.minutoTrans = minutos
      }
   
      this.transcurridoCancion = this.minutoTrans + ':'+this.segundoTrans
			
		},
  },
};
</script>
   <style scoped>
img {
  height: 500px;
  width: 500px;
}
.range{
width: 100%;
border-radius: 50px;
background-color: red;
}
.range::-moz-range-thumb {
width: 25px;
height: 25px;
background-color: #1201fa;
border-radius: 50%;
border: 0;
}
.range::-moz-range-progress {
  background-color: #2e2f2d; 
  height: 10px;
  cursor:pointer;
}
.range::-moz-range-track {  
  background-color: #1b0d63;
  height: 10px;
  cursor:pointer;
}
</style>