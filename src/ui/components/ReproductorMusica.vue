<template>
  <div>
    <audio
    v-bind:src="`http://localhost:3000/audio/${song.id}`"
      id="stream"
      preload="auto"
      autoplay
      ref="audioPlayer"
      
      
    />
  <!-- @progress="progressListener"
      @timeupdate="timeUpdate"  -->
    <v-row>
        <v-col cols="2" class="text-center"><v-btn class="boton__crear" v-on:click="goback">Back</v-btn> </v-col>
        <v-col cols="9" >

        </v-col>
        <v-col cols="1"> </v-col>
      </v-row>
    
      <v-row>
        <v-col cols="1"> </v-col>
        <v-col cols="10" class="text-center">
          <img v-bind:src="`http://localhost:3000/imagen/${song.id}`" />
        /></v-col>
        <v-col cols="1"> </v-col>
      </v-row>
  
      <v-row >
        <v-col cols="1"> </v-col>
        <v-col cols="10">
          <div class="text-center">
            <p class="text-yellow-300 font-bold">{{ song.nombre }}</p>
            <p class="text-gray-200">
              {{ song.artista }} - {{ song.album }}
            </p>
            <p class="text-gray-400">{{ song.ano }}</p>
          </div>
        </v-col>
        <v-col cols="1"> </v-col>
      </v-row>
  
      <v-row class="text-center">
        <v-col cols="1"> </v-col>
        <v-col cols="2"> 
         
          <button  v-on:click="mute">
              <v-icon color="#cd853f" :icon="controladorVolumen.icon" size="x-large"></v-icon>
            </button>&nbsp;&nbsp;
            <v-slider color="teal" v-model="volume" min="0" max="1"  @input="setVolume(volume)" step="0.1"></v-slider>
            <!-- <input  @mouseover="volumenVisible()"  class="volumen" type="range" v-model="volume" @input="setVolume(volume)" min="1" max="100" step="0.1"/> -->
      </v-col>
        <v-col cols="2">
          <div >
            <button v-on:click="previous">
              <v-icon color="#cd853f" icon="mdi-skip-previous" size="x-large"></v-icon>
            </button>
            
          </div>
        </v-col>
        <v-col cols="2">
          <div>
            <v-btn
              v-on:click="togglePlay"
              color="#FAD201"
              :icon="boton.icon"
              size="x-large"
            ></v-btn></div
        ></v-col>
        <v-col cols="2">
          <div>
            <button v-on:click="next">
              <v-icon color="#cd853f" icon="mdi-skip-next" size="x-large"></v-icon>
            </button></div
        ></v-col>
        <v-col cols="3"> </v-col>
      </v-row>
      <v-row id="time" class="tiempo">
       
        <v-col cols="1"> </v-col>
        <v-col cols="1"> {{transcurridoCancion}}</v-col>
        <v-col cols="8"> </v-col>
        <v-col cols="1"> {{duracionCanción}}</v-col>
        <v-col cols="1"> </v-col>
     
      </v-row>
      <v-row>
        <v-col cols="1"> </v-col>
        <v-col cols="10">
 
        <!-- <input type="range" v-model="currentTime" @input="mover()" min="0" :max=duracion class="range__duracion" step='0.01'/> -->
        <v-slider
      v-model="currentTime"
      min="0"
      :max="duration"
      @input="seekAudio()"
    ></v-slider>


      </v-col>
      <v-col cols="1"> </v-col>
    </v-row>
    </div>
  </template>
  
  <script>

  export default {
  
    data() {
      return {
        duration: 0,
        currentTime:0,
        verVolumen: false,
        volume :1,
        isPlaying: true,
        boton: {
          icon: "mdi-pause",
        },
        volLevel: "volume_up",
        volumen: 0.5,
        controladorVolumen:{
          icon: "mdi-volume-high",
        },
        dura: 0,
        duracion:0,
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
    emits: [ "next", "previous", "mute"],
    created() {
      
    },
    mounted() {
    // this.audio = this.$refs.audioPlayer;
    // this.audio.addEventListener("canplay", () => {
    //   this.duracion = this.audio.duration;
    //   console.log(this.$refs.audioPlayer)
    // });
  },
  
    methods: {
      goback() {
      this.$emit("goback");
    },
      // timeUpdate(e) {
      //   const target = e.target
      //   this.currentTime = target.currentTime
      //   this.dura=this.currentTime
      //   console.log('esme'+this.dura)
      //    const minutos = parseInt(this.currentTime / 60)
      //   const segundos = parseInt(this.currentTime % 60)
      //   if (parseInt(segundos/10)== 0){
      //     this.segundoTrans = '0'+segundos
      //   }else{
      //     this.segundoTrans = segundos
      //   }
      //   if(parseInt(minutos/10) == 0){
      //     this.minutoTrans = '0'+minutos
      //   }else{
      //     this.minutoTrans = minutos
      //   }
     
      //   this.transcurridoCancion = this.minutoTrans + ':'+this.segundoTrans
      // },
      // progressListener(e) {
      //   const player = e.target
      //   const duration = player.duration
  
      //  console.log('Hola'+duration)
      //  const minutos = parseInt(duration / 60)
      //   const segundos = parseInt(duration % 60)
      //   console.log(minutos, segundos)
      //   if (parseInt(segundos/10)== 0){
      //     this.segundo = '0'+segundos
      //   }else{
      //     this.segundo = segundos
      //   }
      //   if(parseInt(minutos/10) == 0){
      //     this.minuto = '0'+minutos
      //   }else{
      //     this.minuto = minutos
      //   }
      //   this.duracionCanción = this.minuto + ':'+this.segundo
      // },
  
  
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
      mute(){
         
          if (this.$refs.audioPlayer.volume == 0){
              this.$refs.audioPlayer.volume = this.volumen
              this.controladorVolumen= {
          icon: "mdi-volume-high",
        }
          }else{
          this.volumen = this.$refs.audioPlayer.volume
             this.$refs.audioPlayer.volume = 0; 
             this.controladorVolumen= {
          icon: "mdi-volume-off",
        }  
          }
          this.duracion=this.$refs.audioPlayer.duration
      console.log(this.$refs.audioPlayer.duration)
           
      },
      setVolume(volume) {
         console.log('volumen'+ volume)
        if (volume < 5) {
          this.$refs.audioPlayer.volume = Math.round(parseInt(volume) / 100);
          this.volLevel = "volume_off";
          this.controladorVolumen= {
          icon: "mdi-volume-off",
        }
        } else {
          this.$refs.audioPlayer.volume = parseInt(volume) / 100;
          this.volLevel = "volume_up";
          this.controladorVolumen= {
          icon: "mdi-volume-high",
        }
        }
      },    
        mover(){
          this.audio.currentTime = this.currentTime;
          console.log('dkndkansdn'  + this.currentTime)
      },
      seekAudio() {
  
    // const audio = this.$refs.audioPlayer;

    // audio.currentTime = this.currentTime;
 
    // this.currentTime = audio.currentTime;
    console.log ( 'cara culo' + audio)
    },
    updateSlider() {
      // Obtener el elemento de audio del DOM y actualizar el estado del slider
      const audio = this.$refs.audioPlayer;
      this.currentTime = audio.currentTime;
      this.duration = audio.duration;
    },
  
    },
    mounted() {
    this.$refs.audioPlayer.volume = this.volume
    const audio = this.$refs.audioPlayer;
    audio.addEventListener('timeupdate', this.updateSlider);
  },
  watch: {
    volume(newVal) {
      this.$refs.audioPlayer.volume = newVal
      if (newVal < 0.5) {

          this.volLevel = "volume_off";
          this.controladorVolumen= {
          icon: "mdi-volume-off",
        }
        } else {
          this.volLevel = "volume_up";
          this.controladorVolumen= {
          icon: "mdi-volume-high",
        }
        }
    }
  },
     
                                                                                                                                                                                 
  };
  </script>
  <style  scoped>
  img{
    height: 500px;
    width: 500px;
  }
  .range__duracion{
  width: 100%;
  border-radius: 50px;
  }
  .range__duracion::-moz-range-thumb {
  width: 25px;
  height: 25px;
  background-color: #FAD201;
  border-radius: 50%;
  border: 0;
  }
  .range__duracion::-moz-range-progress {
    background-color: #2e2f2d; 
    height: 10px;
    cursor:pointer;
  }
  .range__duracion::-moz-range-track {  
    background-color: #777671;
    height: 10px;
    cursor:pointer;
  }
  .volumen{
    width: 70%;
  border-radius: 50px;
  }
  .volumen::-moz-range-thumb {
  width: 10px;
  height: 10px;
  background-color: #FAD201;
  border-radius: 50%;
  border: 0;
  }
  .volumen::-moz-range-progress {
    background-color: #2e2f2d; 
  }
  .volumen::-moz-range-track {  
    background-color: #777671;
  }
  .barra{
    background-color: #2e2f2d;
  }
  p{
    color: white;
  }
  .tiempo{
    color: aliceblue;
  }
  .boton__crear{
    background-color: #cd853f;
    color: aliceblue;
    margin-top: 40px;
}
  </style>