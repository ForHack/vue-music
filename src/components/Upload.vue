<template>
  <div
      class="bg-white rounded border border-gray-200 relative flex flex-col"
  >
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">Upload</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <div
          :class="{'bg-green-400 border-green-400 border-solid': is_dragover}"
          class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
          @drag.prevent.stop=""
          @dragstart.prevent.stop=""
          @dragend.prevent.stop="is_dragover = false"
          @dragenter.prevent.stop="is_dragover = true"
          @dragover.prevent.stop="is_dragover = true"
          @dragleave.prevent.stop="is_dragover = false"
          @drop.prevent.stop="upload($event)"
      >
        <h5>Drop your files here</h5>
      </div>

      <input multiple type="file" @change="upload($event)">
      <hr class="my-6"/>
      <!-- Progess Bars -->
      <div v-for="upload in uploads" :key="upload.name" class="mb-4">
        <!-- File Name -->
        <div :class="upload.text_class" class="font-bold text-sm">
          <i :class="upload.icon"></i>
          {{ upload.name }}
        </div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div
              :class="upload.variant"
              :style="{
                'width': upload.current_progress + '%'
              }"
              class="transition-all progress-bar"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {storage, auth, songsCollection} from "../includes/firebase";

export default {
  name: 'Upload',
  data() {
    return {
      is_dragover: false,
      uploads: []
    }
  },
  props: ['addSong'],
  methods: {
    upload($event) {
      this.is_dragover = false

      const files = $event.dataTransfer ?
          [...$event.dataTransfer.files] :
          [...$event.target.files]

      files.forEach((file) => {
        if (file.type !== 'audio/mpeg') {
          return
        }

        const storageRef = storage.ref() // vue-music-b7360.appspot.com
        const songsRef = storageRef.child(`songs/${file.name}`)
        const task = songsRef.put(file)

        const uploadIndex = this.uploads.push({
          task,
          current_progress: 0,
          name: file.name,
          variant: 'bg-blue-400',
          icon: 'fas fa-spinner fa-spin',
          text_class: '',
        }) - 1

        task.on('state_changed', (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              this.uploads[uploadIndex].current_progress = progress
            },
            (error) => {
              this.uploads[uploadIndex].variant = 'bg-red-400'
              this.uploads[uploadIndex].icon = 'fas fa-times'
              this.uploads[uploadIndex].text_class = 'text-red-400'
            },
            async () => {
              const song = {
                uid: auth.currentUser.uid,
                display_name: auth.currentUser.displayName,
                original_name: task.snapshot.ref.name,
                modified_name: task.snapshot.ref.name,
                genre: '',
                comment_count: 0,
              }

              song.url = await task.snapshot.ref.getDownloadURL()
              const songRef = await songsCollection.add(song)
              const songSnapshot = await songRef.get()

              this.addSong(songSnapshot)

              this.uploads[uploadIndex].variant = 'bg-green-400'
              this.uploads[uploadIndex].icon = 'fas fa-check'
              this.uploads[uploadIndex].text_class = 'text-green-400'
            }
        )
      })

    },
    cancelUploads() {
      this.uploads.forEach((upload) => {
        upload.task.cancel()
      })
    }
  },
  beforeUnmount() {
    this.uploads.forEach((upload) => {
      upload.task.cancel()
    })
  }
}
</script>
